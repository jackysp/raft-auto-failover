
import React from 'react';
import { Node, NodeStatus } from '../types';
import NodeComponent from './NodeComponent';

interface ClusterVisualizerProps {
  pdNodes: Node[];
  tikvNodes: Node[];
}

const ConnectionLine: React.FC<{ fromNode: Node; toNode: Node; isHeartbeat: boolean }> = ({ fromNode, toNode, isHeartbeat }) => {
  if (fromNode.status !== NodeStatus.UP || toNode.status !== NodeStatus.UP) {
    return null;
  }
  
  const fromX = `calc(${fromNode.position.x})`;
  const fromY = `calc(${fromNode.position.y})`;
  const toX = `calc(${toNode.position.x})`;
  const toY = `calc(${toNode.position.y})`;

  return (
    <svg className="absolute w-full h-full top-0 left-0" style={{ zIndex: -1 }}>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        className={`transition-all duration-500 ${isHeartbeat ? 'stroke-green-400/70' : 'stroke-gray-500/70'}`}
        strokeWidth="2"
        strokeDasharray={isHeartbeat ? "4 4" : "2 2"}
      >
        {isHeartbeat && <animate attributeName="stroke-dashoffset" values="8;0;8" dur="0.5s" repeatCount="indefinite" />}
      </line>
    </svg>
  );
};

const ClusterVisualizer: React.FC<ClusterVisualizerProps> = ({ pdNodes, tikvNodes }) => {
  const allNodes = [...pdNodes, ...tikvNodes];
  const pdLeader = pdNodes.find(n => n.isLeader);
  const tikvLeader = tikvNodes.find(n => n.isLeader);

  return (
    <div className="relative w-full h-[500px] bg-gray-900 rounded-lg shadow-inner overflow-hidden border border-gray-700">
      {/* PD -> TiKV Leader communication */}
      {pdLeader && tikvLeader && <ConnectionLine fromNode={pdLeader} toNode={tikvLeader} isHeartbeat={false} />}
      
      {/* PD Leader -> PD Followers heartbeats */}
      {pdLeader && pdNodes.filter(n => !n.isLeader).map(follower => (
        <ConnectionLine key={`${pdLeader.id}-${follower.id}`} fromNode={pdLeader} toNode={follower} isHeartbeat={true} />
      ))}

      {/* TiKV Leader -> TiKV Followers heartbeats */}
      {tikvLeader && tikvNodes.filter(n => !n.isLeader).map(follower => (
        <ConnectionLine key={`${tikvLeader.id}-${follower.id}`} fromNode={tikvLeader} toNode={follower} isHeartbeat={true} />
      ))}
      
      {allNodes.map(node => (
        <NodeComponent key={node.id} node={node} />
      ))}
      <div className="absolute top-4 left-6">
          <h2 className="text-xl font-bold text-purple-400">PD Cluster</h2>
      </div>
      <div className="absolute top-1/3 left-6">
          <h2 className="text-xl font-bold text-teal-400">TiKV Raft Group (1 Region)</h2>
      </div>
    </div>
  );
};

export default ClusterVisualizer;
