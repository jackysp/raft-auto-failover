
import React, { useRef, useEffect } from 'react';

interface EventLogProps {
  logs: string[];
}

const EventLog: React.FC<EventLogProps> = ({ logs }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-gray-700">
      <h3 className="text-lg font-bold mb-3 text-cyan-300">Simulation Log</h3>
      <div ref={logContainerRef} className="h-64 overflow-y-auto pr-2 space-y-2">
        {logs.map((log, index) => (
          <p key={index} className="text-sm text-gray-300 font-mono animate-fade-in">
            <span className="text-cyan-400 mr-2">{`[${index.toString().padStart(2, '0')}]>`}</span>
            {log}
          </p>
        ))}
      </div>
    </div>
  );
};

export default EventLog;
