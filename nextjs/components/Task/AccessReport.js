import { getHost } from "../../helpers/getHost";

export default function AccessReport({ accessData, report }) {
  const host = getHost();

  function copyToClipboard(text) {
    if ("clipboard" in navigator) {
      navigator.clipboard.writeText(report);
    } else {
      document.execCommand("copy", true, report);
    }
  }

  const getReportLink = (dataType) => {
    return `${host}/${accessData[dataType]}`;
  };

  return (
    <div className="mt-4 flex justify-center">
      <a
        id="downloadLink"
        href={getReportLink("pdf")}
        className="mb-1 mr-1 rounded px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-purple-600"
        target="_blank"
      >
        View as PDF
      </a>
      <a
        id="downloadLink"
        href={getReportLink("docx")}
        className="mb-1 mr-1 rounded bg-purple-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-purple-600"
        target="_blank"
      >
        Download DocX
      </a>
    </div>
  );
}
