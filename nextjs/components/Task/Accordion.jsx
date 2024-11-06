// multi_agents/gpt_researcher_nextjs/components/Task/Accordion.tsx

import { useState } from "react";

const plainTextFields = [
  "task",
  "sections",
  "headers",
  "sources",
  "research_data",
];

const Accordion = ({ logs }) => {
  console.log("logs in Accordion", logs);

  const getLogHeaderText = (log) => {
    const regex = /📃 Source: (https?:\/\/[^\s]+)/;
    const match = log.text.match(regex);
    let sourceUrl = "";

    if (match) {
      sourceUrl = match[1];
    }

    return log.header === "differences"
      ? "The following fields on the Langgraph were updated: " +
          Object.keys(JSON.parse(log.text).data).join(", ")
      : `📄 Retrieved relevant content from the source: ${sourceUrl}`;
  };

  const renderLogContent = (log) => {
    if (log.header === "differences") {
      return log.processedData.map((data, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-body-color dark:text-dark-6 b text-lg font-semibold">
            {data.field}:
          </h3>
          {data.isMarkdown ? (
            <div
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: data.htmlContent }}
            />
          ) : (
            <p className="text-body-color dark:text-dark-6">
              {typeof data.htmlContent === "object"
                ? JSON.stringify(data.htmlContent)
                : data.htmlContent}
            </p>
          )}
          <style jsx>{`
            .markdown-content {
              margin: 0;
              padding: 0;
              h1,
              h2,
              h3,
              h4,
              h5,
              h6 {
                font-size: inherit;
                font-weight: bold;
                margin-top: 1em;
                margin-bottom: 0.2em;
                line-height: 1.2;
              }
              h1 {
                font-size: 2.5em;
                color: #333;
              }
              h2 {
                font-size: 2em;
                color: #555;
              }
              h3 {
                font-size: 1.5em;
                color: #777;
              }
              h4 {
                font-size: 1.2em;
                color: #999;
              }
              ul {
                list-style-type: none;
                padding-left: 0;
                margin-top: 1em;
                margin-bottom: 1em;
              }
              ul > li {
                margin-bottom: 0.5em;
              }
              ul > li > ul {
                margin-left: 1em;
                list-style-type: disc;
              }
              ul > li > ul > li {
                margin-bottom: 0.3em;
              }
              ul > li > ul > li > ul {
                margin-left: 1em;
                list-style-type: circle;
              }
              ul > li > ul > li > ul > li {
                margin-bottom: 0.2em;
              }
            }
          `}</style>
        </div>
      ));
    } else {
      return (
        <p className="text-body-color dark:text-dark-6 mb-2">{log.text}</p>
      );
    }
  };

  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      id="accordion-collapse"
      data-accordion="collapse"
      className="mb-4 rounded-lg border-[1px] border-white/30"
    >
      {logs.map((log, index) => (
        <div key={index} className="">
          <h2 id={`accordion-collapse-heading-${index}`}>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-t-xl p-5 font-medium text-white"
              onClick={() => handleToggle(index)}
              aria-expanded={openIndex === index}
              aria-controls={`accordion-collapse-body-${index}`}
            >
              <span className="flex-grow text-left">
                {getLogHeaderText(log)}
              </span>
              <svg
                data-accordion-icon
                className={`h-3 w-3 ${openIndex === index ? "rotate-180" : ""} shrink-0`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </button>
          </h2>
          <div
            id={`accordion-collapse-body-${index}`}
            className={`${openIndex === index ? "" : "hidden"}`}
            aria-labelledby={`accordion-collapse-heading-${index}`}
          >
            <div className="dark:white p-5 text-white dark:bg-none">
              {renderLogContent(log)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
