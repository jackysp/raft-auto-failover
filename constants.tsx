import React from 'react';
import { Node, NodeType, NodeStatus } from './types';

export const INITIAL_PD_NODES: Node[] = [
  { id: 'pd1', type: NodeType.PD, isLeader: true, status: NodeStatus.UP, position: { x: '25%', y: '15%' }, label: 'PD 1' },
  { id: 'pd2', type: NodeType.PD, isLeader: false, status: NodeStatus.UP, position: { x: '50%', y: '15%' }, label: 'PD 2' },
  { id: 'pd3', type: NodeType.PD, isLeader: false, status: NodeStatus.UP, position: { x: '75%', y: '15%' }, label: 'PD 3' },
];

export const INITIAL_TIKV_NODES: Node[] = [
  { id: 'tikv1', type: NodeType.TIKV, isLeader: true, status: NodeStatus.UP, position: { x: '50%', y: '50%' }, label: 'TiKV 1' },
  { id: 'tikv2', type: NodeType.TIKV, isLeader: false, status: NodeStatus.UP, position: { x: '25%', y: '75%' }, label: 'TiKV 2' },
  { id: 'tikv3', type: NodeType.TIKV, isLeader: false, status: NodeStatus.UP, position: { x: '75%', y: '75%' }, label: 'TiKV 3' },
];

export const CrownIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 6.5L2 7.25L7.5 12L6 19L12 15.5L18 19L16.5 12L22 7.25L14.5 6.5L12 2Z" />
  </svg>
);

export const HeartbeatIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

export const DownIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
);