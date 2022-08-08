import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { DiagramNode, DiagramNodeLink } from '../models';
import { addNode, addNodeLink, updateNode, deleteNodeSmart, removeNodeLink } from '../node.utils';

export interface DiagramEditorState {
  nodes: DiagramNode[];
  selectedNode: string | null;
  history: Array<DiagramNode[]>;
}

const defaultState: DiagramEditorState = {
  nodes: [],
  selectedNode: null,
  history: [],
};

@Injectable()
export class DiagramEditorStore extends ComponentStore<DiagramEditorState> {
  constructor() {
    super(defaultState);
  }

  // Updaters

  readonly setNodes = this.updater((state, nodes: DiagramNode[]) => ({
    ...state,
    nodes,
  }));

  readonly selectNode = this.updater((state, id: string | null) => ({
    ...state,
    selectedNode: id,
  }));

  readonly addNode = this.updater(
    (
      state,
      {
        node,
        parentNodeId,
        position,
      }: {
        node: Omit<DiagramNode, 'id'>;
        parentNodeId: string;
        position: 'TOP' | 'BOTTOM' | 'CHILD';
      }
    ) => ({
      ...state,
      nodes: addNode(state.nodes, node, parentNodeId, position),
      selectedNode: null,
      // TODO: Add helper functions for the store
      history: [...state.history, state.nodes].slice(-10),
    })
  );

  readonly updateNode = this.updater((state, node: DiagramNode) => ({
    ...state,
    nodes: updateNode(state.nodes, node.id, () => node),
    selectedNode: null,
    history: [...state.history, state.nodes].slice(-10),
  }));

  readonly deleteNode = this.updater((state, id: string) => ({
    ...state,
    nodes: deleteNodeSmart(state.nodes, id),
    selectedNode: null,
    history: [...state.history, state.nodes].slice(-10),
  }));

  readonly addNodeLink = this.updater(
    (state, { nodeId, link }: { nodeId: string; link: DiagramNodeLink }) => ({
      ...state,
      nodes: addNodeLink(state.nodes, nodeId, link),
      history: [...state.history, state.nodes].slice(-10),
    })
  );

  readonly deleteNodeLink = this.updater(
    (state, { fromNodeId, toNodeId }: { fromNodeId: string; toNodeId: string }) => ({
      ...state,
      nodes: removeNodeLink(state.nodes, fromNodeId, toNodeId),
      history: [...state.history, state.nodes].slice(-10),
    })
  );

  readonly undo = this.updater((state) => ({
    ...state,
    ...(state.history.length
      ? {
          nodes: state.history.slice(-1)[0],
          history: state.history.slice(0, -1),
          selected: null,
        }
      : null),
  }));

  // Selectors

  readonly nodes$ = this.select(({ nodes }) => nodes);

  readonly selectedNode$ = this.select(({ nodes, selectedNode }) =>
    selectedNode ? nodes.find((n) => n.id === selectedNode) ?? null : null
  );
}
