import React from 'react';

interface ControlPanelProps {
  onSimulateTikvFailover: () => void;
  onSimulatePdFailover: () => void;
  onReset: () => void;
  isSimulating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onSimulateTikvFailover,
  onSimulatePdFailover,
  onReset,
  isSimulating,
}) => {
  const baseButtonClass = 'w-full px-4 py-2 text-sm font-semibold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  const activeButtonClass = 'text-white';
  const disabledButtonClass = 'bg-gray-600 text-gray-400 cursor-not-allowed';

  return (
    <div className="w-full md:w-auto bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-gray-700 space-y-3">
      <h3 className="text-lg font-bold text-cyan-300 text-center">Controls</h3>
      <button
        onClick={onSimulatePdFailover}
        disabled={isSimulating}
        className={`${baseButtonClass} ${isSimulating ? disabledButtonClass : `${activeButtonClass} bg-purple-600 hover:bg-purple-500 focus:ring-purple-400`}`}
      >
        Simulate PD Leader Failure
      </button>
      <button
        onClick={onSimulateTikvFailover}
        disabled={isSimulating}
        className={`${baseButtonClass} ${isSimulating ? disabledButtonClass : `${activeButtonClass} bg-teal-600 hover:bg-teal-500 focus:ring-teal-400`}`}
      >
        Simulate TiKV Leader Failure
      </button>
      <button
        onClick={onReset}
        disabled={isSimulating}
        className={`${baseButtonClass} ${isSimulating ? disabledButtonClass : `${activeButtonClass} bg-gray-500 hover:bg-gray-400 focus:ring-gray-300`}`}
      >
        Reset Simulation
      </button>
    </div>
  );
};

export default ControlPanel;