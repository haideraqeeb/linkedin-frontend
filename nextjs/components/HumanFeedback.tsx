// /multi_agents/frontend/components/HumanFeedback.tsx

import React, { useState, useEffect } from "react";

interface HumanFeedbackProps {
  questionForHuman: string;
  websocket: WebSocket | null;
  onFeedbackSubmit: (feedback: string | null) => void;
}

const HumanFeedback: React.FC<HumanFeedbackProps> = ({
  questionForHuman,
  websocket,
  onFeedbackSubmit,
}) => {
  const [feedbackRequest, setFeedbackRequest] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFeedbackSubmit(userFeedback === "" ? null : userFeedback);
    setFeedbackRequest(null);
    setUserFeedback("");
  };

  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow-md">
      <h3 className="mb-2 text-lg font-semibold">Human Feedback Required</h3>
      <p className="mb-4">{questionForHuman}</p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full rounded-md border p-2"
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          placeholder="Enter your feedback here (or leave blank for 'no')"
        />
        <button
          type="submit"
          className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default HumanFeedback;
