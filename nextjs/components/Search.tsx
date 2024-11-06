import React, { useState, useEffect } from 'react';
import ResearchForm from './Task/ResearchForm'; // Import ResearchForm
import Report from './Task/Report';
import AgentLogs from './Task/AgentLogs';
import AccessReport from './Task/AccessReport';

interface Task {
  value: string;
}

interface ReportType {
  value: string;
}

interface ReportSource {
  value: string;
}

const Search = () => {
  // Manage chatBoxSettings state
  const [chatBoxSettings, setChatBoxSettings] = useState({
    report_type: 'multi_agents',
    report_source: 'web',
    tone: 'neutral',
  });

  const [agentLogs, setAgentLogs] = useState<string[]>([]);
  const [report, setReport] = useState<string>('');
  const [accessData, setAccessData] = useState<string>('');
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { protocol, pathname } = window.location;
      let { host } = window.location;
      host = host.includes('localhost') ? 'localhost:8000' : host;
      const ws_uri = `ws://ec2-3-107-19-247.ap-southeast-2.compute.amazonaws.com${pathname}ws`;

      const newSocket = new WebSocket(ws_uri);
      setSocket(newSocket);

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'agentLogs') {
          setAgentLogs((prevLogs) => [...prevLogs, data.output]);
        } else if (data.type === 'report') {
          setReport(data.output);
        } else if (data.type === 'accessData') {
          setAccessData(data.output);
        }
      };

      return () => {
        newSocket.close();
      };
    }
  }, []);

  const handleFormSubmit = () => {
    // Send chatBoxSettings data to the WebSocket server if necessary
    if (socket) {
      const data = "start " + JSON.stringify({
        task: 'research', // You can modify this according to your use case
        report_type: chatBoxSettings.report_type,
        report_source: chatBoxSettings.report_source,
      });
      socket.send(data);
    }
  };

  return (
    <div>
      {/* Pass chatBoxSettings and setChatBoxSettings as props */}
      <ResearchForm 
        chatBoxSettings={chatBoxSettings} 
        setChatBoxSettings={setChatBoxSettings} 
      />

      {/* You can add a submit button here that calls handleFormSubmit */}
      <button onClick={handleFormSubmit}>Start Research</button>

      <AgentLogs agentLogs={agentLogs} />
      <Report report={report} />
      <AccessReport accessData={accessData} report={report} />
    </div>
  );
};

export default Search;
