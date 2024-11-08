import React, { useState, useEffect } from "react";
import "./App.css";
import ChatBox from "./ChatBox";
import axios from "axios";
import { getHost } from "../../helpers/getHost";

export default function Modal({ setChatBoxSettings, chatBoxSettings }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [apiVariables, setApiVariables] = useState({
    ANTHROPIC_API_KEY: "",
    TAVILY_API_KEY: "",
    LANGCHAIN_TRACING_V2: "true",
    LANGCHAIN_API_KEY: "",
    OPENAI_API_KEY: "",
    DOC_PATH: "./my-docs",
    RETRIEVER: "tavily", // Set default retriever to Tavily
    GOOGLE_API_KEY: "",
    GOOGLE_CX_KEY: "",
    BING_API_KEY: "",
    SEARCHAPI_API_KEY: "",
    SERPAPI_API_KEY: "",
    SERPER_API_KEY: "",
    SEARX_URL: "",
    LANGGRAPH_HOST_URL: "",
  });

  useEffect(() => {
    const storedConfig = localStorage.getItem("apiVariables");
    if (storedConfig) {
      setApiVariables(JSON.parse(storedConfig));
    } else {
      axios
        .get(`${getHost()}/getConfig`)
        .then((response) => {
          setApiVariables(response.data);
          localStorage.setItem("apiVariables", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error fetching config:", error);
        });
    }
  }, [showModal]);

  const handleSaveChanges = () => {
    setChatBoxSettings(chatBoxSettings);
    localStorage.setItem("apiVariables", JSON.stringify(apiVariables));
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApiVariables((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    localStorage.setItem(
      "apiVariables",
      JSON.stringify({
        ...apiVariables,
        [name]: value,
      }),
    );
  };

  const renderConditionalInputs = () => {
    switch (apiVariables.RETRIEVER) {
      case "google":
        return (
          <>
            <div className="form-group">
              <label className="form-group-label">GOOGLE_API_KEY</label>
              <input
                type="text"
                name="GOOGLE_API_KEY"
                value={apiVariables.GOOGLE_API_KEY}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-group-label">GOOGLE_CX_KEY</label>
              <input
                type="text"
                name="GOOGLE_CX_KEY"
                value={apiVariables.GOOGLE_CX_KEY}
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case "bing":
        return (
          <div className="form-group">
            <label className="form-group-label">BING_API_KEY</label>
            <input
              type="text"
              name="BING_API_KEY"
              value={apiVariables.BING_API_KEY}
              onChange={handleInputChange}
            />
          </div>
        );
      case "searchapi":
        return (
          <div className="form-group">
            <label className="form-group-label">SEARCHAPI_API_KEY</label>
            <input
              type="text"
              name="SEARCHAPI_API_KEY"
              value={apiVariables.SEARCHAPI_API_KEY}
              onChange={handleInputChange}
            />
          </div>
        );
      case "serpapi":
        return (
          <div className="form-group">
            <label className="form-group-label">SERPAPI_API_KEY</label>
            <input
              type="text"
              name="SERPAPI_API_KEY"
              value={apiVariables.SERPAPI_API_KEY}
              onChange={handleInputChange}
            />
          </div>
        );
      case "googleSerp":
        return (
          <div className="form-group">
            <label className="form-group-label">SERPER_API_KEY</label>
            <input
              type="text"
              name="SERPER_API_KEY"
              value={apiVariables.SERPER_API_KEY}
              onChange={handleInputChange}
            />
          </div>
        );
      case "searx":
        return (
          <div className="form-group">
            <label className="form-group-label">SEARX_URL</label>
            <input
              type="text"
              name="SEARX_URL"
              value={apiVariables.SEARX_URL}
              onChange={handleInputChange}
            />
          </div>
        );
      // Add cases for other retrievers if needed
      default:
        return null;
    }
  };

  return (
    <div className="settings">
      <button
        className="mb-1 mr-1 rounded border border-white/30 bg-none px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-white/30"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Settings
      </button>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden text-white outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-[#191A1A] shadow-lg outline-none focus:outline-none">
                <div className="relative flex-auto p-6">
                  <div className="tabs">
                    <button
                      onClick={() => setActiveTab("search")}
                      className={`tab-button ${activeTab === "search" ? "active" : ""}`}
                    >
                      Search Settings
                    </button>
                    <button
                      onClick={() => setActiveTab("api")}
                      className={`tab-button ${activeTab === "api" ? "active" : ""}`}
                    >
                      API Variables
                    </button>
                  </div>
                  {activeTab === "search" && (
                    <div className="App">
                      <header className="App-header">
                        <ChatBox
                          setChatBoxSettings={setChatBoxSettings}
                          chatBoxSettings={chatBoxSettings}
                        />
                      </header>
                    </div>
                  )}
                  {activeTab === "api" && (
                    <main className="container" id="form">
                      <form method="POST" className="report_settings">
                        <div className="form-group">
                          <label className="form-group-label">
                            Search Engine
                          </label>
                          <select
                            name="RETRIEVER"
                            value={apiVariables.RETRIEVER}
                            onChange={handleInputChange}
                          >
                            <option value="" disabled>
                              Select Retriever
                            </option>
                            <option value="tavily">Tavily</option>
                            <option value="google">Google</option>
                            <option value="searx">Searx</option>
                            <option value="searchapi">SearchApi</option>
                            <option value="serpapi">SerpApi</option>
                            <option value="googleSerp">GoogleSerp</option>
                            <option value="duckduckgo">DuckDuckGo</option>
                            <option value="bing">Bing</option>
                          </select>
                        </div>
                        {renderConditionalInputs()}

                        <div className="form-group">
                          <label className="form-group-label">
                            OPENAI_API_KEY
                          </label>
                          <input
                            type="text"
                            name="OPENAI_API_KEY"
                            value={apiVariables.OPENAI_API_KEY}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-group-label">DOC_PATH</label>
                          <input
                            type="text"
                            name="DOC_PATH"
                            value={apiVariables.DOC_PATH}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-group-label">
                            TAVILY_API_KEY
                          </label>
                          <input
                            type="text"
                            name="TAVILY_API_KEY"
                            value={apiVariables.TAVILY_API_KEY}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-group-label">
                            LANGCHAIN_API_KEY
                          </label>
                          <input
                            type="text"
                            name="LANGCHAIN_API_KEY"
                            value={apiVariables.LANGCHAIN_API_KEY}
                            onChange={handleInputChange}
                          />
                        </div>

                        {apiVariables.LANGCHAIN_API_KEY && (
                          <>
                            <div className="form-group">
                              <label className="form-group-label">
                                LANGGRAPH_HOST_URL
                              </label>
                              <input
                                type="text"
                                name="LANGGRAPH_HOST_URL"
                                value={apiVariables.LANGGRAPH_HOST_URL}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-group-label">
                                ANTHROPIC_API_KEY
                              </label>
                              <input
                                type="text"
                                name="ANTHROPIC_API_KEY"
                                value={apiVariables.ANTHROPIC_API_KEY}
                                onChange={handleInputChange}
                              />
                            </div>
                          </>
                        )}
                      </form>
                    </main>
                  )}
                </div>
                <div className="flex items-center justify-end p-3">
                  <button
                    className="mb-1 mr-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    onClick={handleSaveChanges}
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </div>
  );
}
