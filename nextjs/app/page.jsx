"use client";
import Answer from "@/components/Answer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InputArea from "@/components/InputArea";
import Sources from "@/components/Sources";
import Question from "@/components/Question";
import SubQuestions from "@/components/SubQuestions";
import ImageDisplay from "@/components/ImageDisplay";
import { useRef, useState, useEffect } from "react";
import { startLanggraphResearch } from "../components/Langgraph/Langgraph";
import findDifferences from "../helpers/findDifferences";
import HumanFeedback from "@/components/HumanFeedback";
const linkedInAuth = async () => {
  window.location.href = "/api/auth";
};
export default function Home() {
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [postGenerated, setPostGenerated] = useState(false);
  const [formattedAnswer, setFormattedAnswer] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatBoxSettings, setChatBoxSettings] = useState({
    report_source: "web",
    report_type: "research_report",
    tone: "Objective",
  });
  const chatContainerRef = useRef(null);

  const [answerData, setAnswerData] = useState("");

  const [question, setQuestion] = useState("");
  const [sources, setSources] = useState([]);
  const [similarQuestions, setSimilarQuestions] = useState([]);

  const [socket, setSocket] = useState(null);
  const [orderedData, setOrderedData] = useState([]);
  const heartbeatInterval = useRef(null);
  const [showHumanFeedback, setShowHumanFeedback] = useState(false);
  const [questionForHuman, setQuestionForHuman] = useState(false);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [orderedData]);

  const startResearch = (chatBoxSettings) => {
    const storedConfig = localStorage.getItem("apiVariables");
    const apiVariables = storedConfig ? JSON.parse(storedConfig) : {};
    const headers = {
      retriever: apiVariables.RETRIEVER,
      langchain_api_key: apiVariables.LANGCHAIN_API_KEY,
      openai_api_key: apiVariables.OPENAI_API_KEY,
      tavily_api_key: apiVariables.TAVILY_API_KEY,
      google_api_key: apiVariables.GOOGLE_API_KEY,
      google_cx_key: apiVariables.GOOGLE_CX_KEY,
      bing_api_key: apiVariables.BING_API_KEY,
      searchapi_api_key: apiVariables.SEARCHAPI_API_KEY,
      serpapi_api_key: apiVariables.SERPAPI_API_KEY,
      serper_api_key: apiVariables.SERPER_API_KEY,
      searx_url: apiVariables.SEARX_URL,
    };

    if (!socket) {
      if (typeof window !== "undefined") {
        const { protocol, pathname } = window.location;
        let { host } = window.location;
        host = host.includes("localhost") ? "localhost:8000" : host;
        const ws_uri = "ws://ec2-3-107-19-247.ap-southeast-2.compute.amazonaws.com/ws";
        console.log(ws_uri);
        const newSocket = new WebSocket(ws_uri);
        console.log(newSocket)
        setSocket(newSocket);

        newSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("websocket data caught in frontend: ", data);

          if (data.type === "human_feedback" && data.content === "request") {
            console.log("triggered human feedback condition");
            setQuestionForHuman(data.output);
            setShowHumanFeedback(true);
          } else {
            const contentAndType = `${data.content}-${data.type}`;
            setOrderedData((prevOrder) => [
              ...prevOrder,
              { ...data, contentAndType },
            ]);

            if (data.type === "report") {
              setAnswer((prev) => prev + data.output);
            } else if (data.type === "path") {
              setLoading(false);
              newSocket.close();
              setSocket(null);
            }
          }
        };

        newSocket.onopen = () => {
          const { task, report_type, report_source, tone } = chatBoxSettings;
          let data =
            "start " +
            JSON.stringify({
              task: promptValue,
              report_type,
              report_source,
              tone,
              headers,
            });
          newSocket.send(data);

          // Start sending heartbeat messages every 30 seconds
          // heartbeatInterval.current = setInterval(() => {
          //   newSocket.send(JSON.stringify({ type: 'ping' }));
          // }, 3000);
        };

        newSocket.onclose = () => {
          clearInterval(heartbeatInterval.current);
          setSocket(null);
        };
      }
    } else {
      const { task, report_type, report_source, tone } = chatBoxSettings;
      let data =
        "start " +
        JSON.stringify({
          task: promptValue,
          report_type,
          report_source,
          tone,
          headers,
        });
      socket.send(data);
    }
  };

  // Add this function to handle feedback submission
  const handleFeedbackSubmit = (feedback) => {
    console.log("user feedback is passed to handleFeedbackSubmit: ", feedback);
    if (socket) {
      socket.send(
        JSON.stringify({ type: "human_feedback", content: feedback }),
      );
    }
    setShowHumanFeedback(false);
  };

  const handleDisplayResult = async (newQuestion) => {
    newQuestion = newQuestion || promptValue;

    setShowResult(true);
    setLoading(true);
    setQuestion(newQuestion);
    setPromptValue("");
    setAnswer(""); // Reset answer for new query
    // Add the new question to orderedData
    setOrderedData((prevOrder) => [
      ...prevOrder,
      { type: "question", content: newQuestion },
    ]);

    const imageUrl = "/image.png";
    const imageAlt = "This is an image";
    const { report_type, report_source, tone } = chatBoxSettings;

    // Retrieve LANGGRAPH_HOST_URL from local storage or state
    const storedConfig = localStorage.getItem("apiVariables");
    const apiVariables = storedConfig ? JSON.parse(storedConfig) : {};
    const langgraphHostUrl = apiVariables.LANGGRAPH_HOST_URL;

    if (report_type === "multi_agents" && langgraphHostUrl) {
      let { streamResponse, host, thread_id } = await startLanggraphResearch(
        newQuestion,
        report_source,
        langgraphHostUrl,
      );

      const langsmithGuiLink = `https://smith.langchain.com/studio/thread/${thread_id}?baseUrl=${host}`;

      console.log("langsmith-gui-link in page.tsx", langsmithGuiLink);
      // Add the Langgraph button to orderedData
      setOrderedData((prevOrder) => [
        ...prevOrder,
        { type: "langgraphButton", link: langsmithGuiLink },
      ]);

      let previousChunk = null;

      for await (const chunk of streamResponse) {
        console.log(chunk);
        if (
          chunk.data.report != null &&
          chunk.data.report != "Full report content here"
        ) {
          setOrderedData((prevOrder) => [
            ...prevOrder,
            { ...chunk.data, output: chunk.data.report, type: "report" },
          ]);
          setLoading(false);
        } else if (previousChunk) {
          const differences = findDifferences(previousChunk, chunk);
          setOrderedData((prevOrder) => [
            ...prevOrder,
            {
              type: "differences",
              content: "differences",
              output: JSON.stringify(differences),
            },
          ]);
        }
        previousChunk = chunk;
      }
    } else {
      startResearch(chatBoxSettings);

      // await Promise.all([
      // handleSourcesAndAnswer(newQuestion),
      // handleSimilarQuestions(newQuestion),
      // ]);
    }
  };

  const reset = () => {
    setShowResult(false);
    setPromptValue("");
    setQuestion("");
    setAnswer("");
    setSources([]);
    setSimilarQuestions([]);
  };

  const handleClickSuggestion = (value) => {
    setPromptValue(value);
    const element = document.getElementById("input-area");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const preprocessOrderedData = (data) => {
    const groupedData = [];
    let currentAccordionGroup = null;
    let currentSourceGroup = null;
    let currentReportGroup = null;
    let finalReportGroup = null;
    let linkedInButton = null;
    let sourceBlockEncountered = false;
    let lastSubqueriesIndex = -1;

    data.forEach((item, index) => {
      const { type, content, metadata, output, link } = item;

      if (type === "report") {
        if (!currentReportGroup) {
          currentReportGroup = { type: "reportBlock", content: "" };
          groupedData.push(currentReportGroup);
        }
        currentReportGroup.content += output;
      } else if (type === "logs" && content === "research_report") {
        if (!finalReportGroup) {
          finalReportGroup = { type: "reportBlock", content: "" };
          groupedData.push(finalReportGroup);
        }
        finalReportGroup.content += output.report;
      } else if (type === "langgraphButton") {
        groupedData.push({ type: "langgraphButton", link });
      } else if (type === "question") {
        groupedData.push({ type: "question", content });
      } else {
        if (currentReportGroup) {
          currentReportGroup = null;
        }

        if (content === "subqueries") {
          if (currentAccordionGroup) {
            currentAccordionGroup = null;
          }
          if (currentSourceGroup) {
            groupedData.push(currentSourceGroup);
            currentSourceGroup = null;
          }
          groupedData.push(item);
          lastSubqueriesIndex = groupedData.length - 1;
        } else if (type === "sourceBlock") {
          currentSourceGroup = item;
          if (lastSubqueriesIndex !== -1) {
            groupedData.splice(lastSubqueriesIndex + 1, 0, currentSourceGroup);
            lastSubqueriesIndex = -1;
          } else {
            groupedData.push(currentSourceGroup);
          }
          sourceBlockEncountered = true;
          currentSourceGroup = null;
        } else if (content === "added_source_url") {
          if (!currentSourceGroup) {
            currentSourceGroup = { type: "sourceBlock", items: [] };
            if (lastSubqueriesIndex !== -1) {
              groupedData.splice(
                lastSubqueriesIndex + 1,
                0,
                currentSourceGroup,
              );
              lastSubqueriesIndex = -1;
            } else {
              groupedData.push(currentSourceGroup);
            }
            sourceBlockEncountered = true;
          }
          const hostname = new URL(metadata).hostname.replace("www.", "");
          currentSourceGroup.items.push({ name: hostname, url: metadata });
        } else if (type !== "path" && content !== "") {
          if (sourceBlockEncountered) {
            if (!currentAccordionGroup) {
              currentAccordionGroup = { type: "accordionBlock", items: [] };
              groupedData.push(currentAccordionGroup);
            }
            currentAccordionGroup.items.push(item);
          } else {
            groupedData.push(item);
          }
        } else {
          if (currentAccordionGroup) {
            currentAccordionGroup = null;
          }
          if (currentSourceGroup) {
            currentSourceGroup = null;
          }
          groupedData.push(item);
        }
      }
    });

    return groupedData;
  };

  let answerRendered = false;
  const renderComponentsInOrder = () => {
    const groupedData = preprocessOrderedData(orderedData);
    console.log("orderedData in renderComponentsInOrder: ", groupedData);

    return groupedData.map((data, index) => {
      if (data.type === "sourceBlock") {
        const uniqueKey = `sourceBlock-${index}`;
        return (
          <Sources key={uniqueKey} sources={data.items} isLoading={false} />
        );
      } else if (data.type == "imageDisplay") {
        const uniqueKey = `imageDisplay-${index}`;
        return <ImageDisplay key={uniqueKey} src="/image.png" alt={data.alt} />;
      } else if (data.type === "reportBlock") {
        answerRendered = true;
        const uniqueKey = `reportBlock-${index}`;
        return <Answer key={uniqueKey} answer={data.content} />;
      } else if (data.type === "langgraphButton") {
        const uniqueKey = `langgraphButton-${index}`;
        return <div key={uniqueKey}></div>;
      } else if (data.type === "question") {
        const uniqueKey = `question-${index}`;
        return <Question key={uniqueKey} question={data.content} />;
      } else {
        const { type, content, metadata, output } = data;
        const uniqueKey = `${type}-${content}-${index}`;

        if (content === "subqueries") {
          return (
            <SubQuestions
              key={uniqueKey}
              metadata={data.metadata}
              handleClickSuggestion={handleClickSuggestion}
            />
          );
        }

        // Rendering the placeholder before the "Post on LinkedIn" button
        if (answerRendered && index === groupedData.length - 1) {
          return (
            <div
              key="final-section"
              className="mb-5 flex flex-col items-center"
            >
              <button
                className="rounded-md bg-blue-600 px-2 py-2 text-white"
                onClick={() => {
                  generateFormattedAnswer(answerData);
                  setPostGenerated(true);
                }}
              >
                Generate Post
              </button>

              {/* Suspense for the formatted text */}
              {postGenerated && (
                <div className="my-5 text-lg leading-10 text-white">
                  {loadingText ? (
                    <span className="animate-pulse">
                      Generating formatted text...
                    </span>
                  ) : (
                    formattedAnswer?.output.split("\n\n").map((paragraph, index)=> {
                      return (
                        <p className="" key={index}>
                        {paragraph}
                        </p>
                      )
                    })
                  )}
                </div>
              )}

              {/* Suspense for the image */}
              {postGenerated && (
                <>
                  <div className="image-placeholder mb-4 flex h-auto w-full items-center justify-center bg-gray-200">
                    {loadingImage ? (
                      <span className="animate-pulse text-gray-500">
                        Generating image...
                      </span>
                    ) : (
                      imageSrc && (
                        <img src={imageSrc} alt="AI generated image" />
                      )
                    )}
                  </div>

                  <button
                    className="rounded-md border border-white/30 bg-blue-500 px-2 py-2 font-bold text-white"
                    onClick={linkedInAuth}
                  >
                    Post On LinkedIn
                  </button>
                </>
              )}
            </div>
          );
        } else {
          return null;
        }
      }
    });
  };

  const generateFormattedAnswer = async (answer) => {
    try {
      setLoadingText(true);

      const answerFormat = await fetch(
        "https://linkedin-backend-green.vercel.app/format",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ output: answer }),
        },
      );

      const result = await answerFormat.json();
      console.log("result:", result);
      setFormattedAnswer(result);

      setLoadingText(false);
      setLoadingImage(true);

      const imageResponse = await fetch(
        "https://linkedin-backend-green.vercel.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `This is the text for my LinkedIn post: ${result.output}; 
              generate an abstract wallpaper-like image for this`,
          }),
        },
      );
      console.log(imageResponse);
      if (!imageResponse.ok) {
        throw new Error("Failed to generate image");
      }

      const imageData = await imageResponse.json();
      const base64Image = imageData.image;
      console.log("image base64: ", base64Image);

      setImageSrc(`data:image/jpeg;base64,${base64Image}`);
      setLoadingImage(false);

      const response = await fetch("/api/answer", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ answer: result.output }),
      });

      if (!response.ok) {
        console.error("Error sending answer:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error in generating formatted answer:", error);
    }
  };

  const generateImage = async (prompt) => {};

  const sendAnswer = async (answer) => {};

  useEffect(() => {
    const groupedData = preprocessOrderedData(orderedData);
    const answerBlock = groupedData.find((data) => data.type === "reportBlock");

    if (answerBlock) {
      sendAnswer(answerBlock.content); // Assuming answerBlock.content is the correct value to send
      setAnswerData(answerBlock.content);
    }
  }, [orderedData]);

  return (
    <>
      <Header />
      <main className="h-full px-4 pb-4 pt-10">
        {!showResult && (
          <Hero
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        )}

        {showResult && (
          <div className="flex h-full min-h-[68vh] w-full grow flex-col justify-between">
            <div className="container w-full space-y-2">
              <div className="container space-y-2">
                {renderComponentsInOrder()}
              </div>

              {showHumanFeedback && (
                <HumanFeedback
                  questionForHuman={questionForHuman}
                  websocket={socket}
                  onFeedbackSubmit={handleFeedbackSubmit}
                />
              )}

              {loading && (
                <div className="flex items-center justify-center">
                  <div className="loader w-[80px] pb-1">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div className="pt-1 sm:pt-2" ref={chatContainerRef}></div>
            </div>
            <div id="input-area" className="container px-4 lg:px-0">
              <div className="text-white"></div>
              {!loading && (
                <InputArea
                  promptValue={promptValue}
                  setPromptValue={setPromptValue}
                  handleDisplayResult={handleDisplayResult}
                  disabled={loading}
                  reset={reset}
                />
              )}
            </div>
          </div>
        )}
      </main>
      <Footer
        setChatBoxSettings={setChatBoxSettings}
        chatBoxSettings={chatBoxSettings}
      />
    </>
  );
}
