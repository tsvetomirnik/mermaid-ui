export interface Diagram {
  direction: DiagramDirection;
  nodes: DiagramNode[];
}

export interface DiagramNode {
  id: string;
  text?: string;
  shape?: DiagramNodeShape;
  links?: DiagramNodeLink[];
}

export enum DiagramDirection {
  LeftToRight = 'LR',
  TopToDown = 'TD',
}

export enum DiagramNodeShape {
  RoundEdges = 'RoundEdges',
  Stadium = 'Stadium',
  Rhombus = 'Rhombus',
  Hexagon = 'Hexagon',
  Circle = 'Circle',
  Parallelogram = 'Parallelogram',
}

export interface DiagramNodeLink {
  nodeId: string;
  text?: string;
}
