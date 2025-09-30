import React, { useState, useCallback } from 'react';
import { Node, NodeStatus, NodeType } from './types';
import { INITIAL_PD_NODES, INITIAL_TIKV_NODES } from './constants';
import ClusterVisualizer from './components/ClusterVisualizer';
import ControlPanel from './components/ControlPanel';
import EventLog from './components/EventLog';

const App: React.FC = () => {
  const [pdNodes, setPdNodes] = useState<Node[]>(INITIAL_PD_NODES);
  const [tikvNodes, setTikvNodes] = useState<Node[]>(INITIAL_TIKV_NODES);
  const [logs, setLogs] = useState<string[]>(['Simulation initialized. Ready.']);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const addLog = (message: string) => setLogs(prev => [...prev, message]);

  const handleReset = useCallback(() => {
    setPdNodes(INITIAL_PD_NODES);
    setTikvNodes(INITIAL_TIKV_NODES);
    setLogs(['Simulation initialized. Ready.']);
    setIsSimulating(false);
  }, []);

  const runSimulation = async (steps: (() => Promise<void>)[]) => {
    setIsSimulating(true);
    for (const step of steps) {
      await step();
    }
    setIsSimulating(false);
    addLog('Simulation complete. Press Reset to start over.');
  };

  const simulateTikvFailover = () => {
    const upNodes = tikvNodes.filter(n => n.status === NodeStatus.UP);
    const leader = upNodes.find(n => n.isLeader);

    if (upNodes.length <= 1) {
      addLog('TiKV cluster already unavailable. Please Reset.');
      return;
    }

    if (!leader) {
      addLog('No active TiKV leader to fail. Please Reset or wait.');
      return;
    }

    const remainingUpNodesAfterFailure = upNodes.length - 1;
    const totalNodes = INITIAL_TIKV_NODES.length;
    const quorumSize = Math.floor(totalNodes / 2) + 1;
    
    const isMajorityFailure = remainingUpNodesAfterFailure < quorumSize;

    const steps = [
      async () => {
        addLog(isMajorityFailure ? 'Starting TiKV majority failure simulation...' : 'Starting TiKV leader failover simulation...');
        await sleep(500);
      },
      async () => {
        addLog(`TiKV Leader peer on node ${leader.label} fails!`);
        setTikvNodes(prev => prev.map(n => n.id === leader.id
          ? { ...n, status: NodeStatus.DOWN, isLeader: false }
          : n
        ));
        await sleep(2000);
      },
      ...(isMajorityFailure
        ? [ // Steps for majority failure
            async () => {
              addLog('Remaining follower attempts to start an election.');
              setTikvNodes(prev => prev.map(n => n.status === NodeStatus.UP ? { ...n, status: NodeStatus.ELECTING } : n));
              await sleep(2500);
            },
            async () => {
              addLog(`Quorum lost (${remainingUpNodesAfterFailure}/${totalNodes} nodes active). Cannot elect a new leader.`);
              addLog('TiKV Region 1 is now unavailable for writes.');
            }
          ]
        : [ // Steps for regular failover
            async () => {
              addLog('Followers detect leader failure after timeout.');
              setTikvNodes(prev => prev.map(n => n.status === NodeStatus.UP ? { ...n, status: NodeStatus.ELECTING } : n));
              await sleep(2000);
            },
            async () => {
              addLog('New leader election starts for Region 1...');
              setTikvNodes(prev => {
                const followers = prev.filter(n => n.status === NodeStatus.ELECTING);
                if (followers.length > 0) {
                  const newLeader = followers[0];
                  addLog(`${newLeader.label} wins the election and becomes the new leader for Region 1.`);
                  return prev.map(n => {
                    if (n.id === newLeader.id) return { ...n, isLeader: true, status: NodeStatus.UP };
                    if (n.status === NodeStatus.ELECTING) return { ...n, status: NodeStatus.UP };
                    return n;
                  });
                }
                return prev;
              });
              await sleep(1500);
            },
            async () => addLog('Region 1 is operational again with a new leader.')
          ]
      )
    ];

    runSimulation(steps);
  };
  
  const simulatePdFailover = () => {
    const upNodes = pdNodes.filter(n => n.status === NodeStatus.UP);
    const leader = upNodes.find(n => n.isLeader);

    if (upNodes.length <= 1) {
      addLog('PD cluster is already unavailable. Please Reset.');
      return;
    }

    if (!leader) {
      addLog('No active PD leader to fail. Please Reset or wait.');
      return;
    }

    const remainingUpNodesAfterFailure = upNodes.length - 1;
    const totalNodes = INITIAL_PD_NODES.length;
    const quorumSize = Math.floor(totalNodes / 2) + 1;
    
    const isMajorityFailure = remainingUpNodesAfterFailure < quorumSize;

    const steps = [
      async () => {
        addLog(isMajorityFailure ? 'Starting PD majority failure simulation...' : 'Starting PD leader failover simulation...');
        await sleep(500);
      },
      async () => {
        addLog(`PD Leader node ${leader.label} fails!`);
        setPdNodes(prev => prev.map(n => n.id === leader.id
          ? { ...n, status: NodeStatus.DOWN, isLeader: false }
          : n
        ));
        await sleep(2000);
      },
      ...(isMajorityFailure
        ? [ // Steps for majority failure
            async () => {
              addLog('Remaining PD node attempts to start an election.');
              setPdNodes(prev => prev.map(n => n.status === NodeStatus.UP ? { ...n, status: NodeStatus.ELECTING } : n));
              await sleep(2500);
            },
            async () => {
              addLog(`Quorum lost (${remainingUpNodesAfterFailure}/${totalNodes} nodes active). Cannot elect a new PD leader.`);
              addLog('PD cluster is now unavailable.');
            }
          ]
        : [ // Steps for regular failover
            async () => {
              addLog('PD Followers detect leader failure.');
              setPdNodes(prev => prev.map(n => n.status === NodeStatus.UP ? { ...n, status: NodeStatus.ELECTING } : n));
              await sleep(2000);
            },
            async () => {
              addLog('New PD leader election starts...');
              setPdNodes(prev => {
                const followers = prev.filter(n => n.status === NodeStatus.ELECTING);
                if (followers.length > 0) {
                  const newLeader = followers[0];
                  addLog(`${newLeader.label} is elected as the new PD leader.`);
                  return prev.map(n => {
                    if (n.id === newLeader.id) return { ...n, isLeader: true, status: NodeStatus.UP };
                    if (n.status === NodeStatus.ELECTING) return { ...n, status: NodeStatus.UP };
                    return n;
                  });
                }
                return prev;
              });
              await sleep(1500);
            },
            async () => addLog('PD cluster is healthy and managing the cluster again.')
          ]
      )
    ];
    runSimulation(steps);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-gray-900 bg-grid-gray-700/[0.2]">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-purple-400">
          TiKV/PD Raft Auto-Failover
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          An interactive animation of the Raft consensus algorithm ensuring high availability in a distributed system.
        </p>
      </header>
      
      <main className="w-full max-w-7xl flex-grow flex flex-col items-center">
        <ClusterVisualizer pdNodes={pdNodes} tikvNodes={tikvNodes} />
        
        <div className="w-full mt-8 flex flex-col md:flex-row gap-8 justify-center">
            <ControlPanel
                onSimulateTikvFailover={simulateTikvFailover}
                onSimulatePdFailover={simulatePdFailover}
                onReset={handleReset}
                isSimulating={isSimulating}
            />
            <EventLog logs={logs} />
        </div>
      </main>

       <footer className="text-center text-gray-500 text-sm mt-8">
            <p>Built by a world-class senior frontend React engineer.</p>
        </footer>
    </div>
  );
};

export default App;