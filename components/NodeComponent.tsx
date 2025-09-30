import React from 'react';
import { Node, NodeStatus, NodeType } from '../types';
import { CrownIcon, DownIcon, HeartbeatIcon } from '../constants';

interface NodeComponentProps {
  node: Node;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node }) => {
  const getStatusColor = () => {
    if (node.status === NodeStatus.DOWN) return 'bg-red-800 border-red-500';
    if (node.status === NodeStatus.ELECTING) return 'bg-yellow-700 border-yellow-400 animate-pulse';
    if (node.isLeader) return node.type === NodeType.PD ? 'bg-purple-600 border-purple-300' : 'bg-teal-600 border-teal-300';
    return node.type === NodeType.PD ? 'bg-gray-700 border-gray-500' : 'bg-gray-700 border-gray-500';
  };

  const nodeSize = node.type === NodeType.PD ? 'w-28 h-28' : 'w-32 h-32';
  const nodeShape = node.type === NodeType.PD ? 'rounded-lg' : 'rounded-full';

  return (
    <div
      className={`absolute flex flex-col items-center justify-center p-2 text-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out ${nodeSize} ${nodeShape} ${getStatusColor()}`}
      style={{ left: node.position.x, top: node.position.y }}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        {node.isLeader && node.status === NodeStatus.UP && <CrownIcon className="w-6 h-6 absolute -top-1 text-yellow-400" />}
        {node.status === NodeStatus.DOWN && <DownIcon className="w-12 h-12 text-red-400 opacity-80" />}
        {node.status === NodeStatus.ELECTING && <HeartbeatIcon className="w-12 h-12 text-yellow-300 opacity-80 animate-ping" />}

        <div className={`transition-opacity duration-500 text-center ${node.status !== NodeStatus.UP ? 'opacity-0' : 'opacity-100'}`}>
          <div className="font-bold text-sm">{node.label}</div>
            {node.type === NodeType.TIKV ? (
                <>
                <div className="text-xs text-gray-300 mt-1">Region 1 Peer</div>
                <div className="text-xs text-gray-400">{node.isLeader ? 'Leader' : 'Follower'}</div>
                </>
            ) : (
                <>
                <div className="text-xs text-gray-300 mt-1">PD Node</div>
                <div className="text-xs text-gray-400">{node.isLeader ? 'Leader' : 'Follower'}</div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default NodeComponent;