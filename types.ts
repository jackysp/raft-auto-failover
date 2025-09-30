
export enum NodeType {
  PD = 'PD',
  TIKV = 'TIKV',
}

export enum NodeStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  ELECTING = 'ELECTING',
}

export interface Node {
  id: string;
  type: NodeType;
  isLeader: boolean;
  status: NodeStatus;
  position: { x: string; y: string };
  label: string;
}
