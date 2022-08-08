import { DiagramNode, DiagramNodeLink, DiagramNodeShape } from './models/node.model';

import * as uuid from 'uuid';

const generateId = (): string => {
  return uuid.v4().slice(0, 7);
};

// Private

const getParentNodes = (nodes: ReadonlyArray<DiagramNode>, nodeId: string): DiagramNode[] => {
  return nodes.filter((n) => n.links?.map((l) => l.nodeId).includes(nodeId));
};

const getChildNodes = (nodes: ReadonlyArray<DiagramNode>, nodeId: string): DiagramNode[] => {
  const childNodeIds = (nodes.find((n) => n.id === nodeId)?.links || []).map((l) => l.nodeId);
  return nodes.filter((n) => childNodeIds.includes(n.id));
};

// Public

export const addChildNode = (
  nodes: ReadonlyArray<DiagramNode>,
  node: Omit<DiagramNode, 'id'>,
  targetNodeId: string
): DiagramNode[] => {
  const nodeId = generateId();

  // Add the new node
  nodes = [...nodes, { ...node, id: nodeId }];

  // Add the link to the parent node
  nodes = addNodeLink(nodes, targetNodeId, { nodeId });

  return [...nodes];
};

export const addDirectChildNode = (
  nodes: ReadonlyArray<DiagramNode>,
  node: Omit<DiagramNode, 'id'>,
  targetNodeId: string
): DiagramNode[] => {
  const nodeId = generateId();
  const newNode = { ...node, id: nodeId };
  const targetNode = nodes.find((n) => n.id === targetNodeId);

  // Add the new node
  nodes = [...nodes, newNode];

  // Set the same links as the parent node
  nodes = updateNode(nodes, newNode.id, (n) => ({
    ...n,
    links: targetNode?.links,
  }));

  // Remove all links from the parent
  nodes = updateNode(nodes, targetNodeId, (n) => ({
    ...n,
    links: undefined,
  }));

  // Add new link to the parent node
  nodes = addNodeLink(nodes, targetNodeId, { nodeId });

  return [...nodes];
};

export const addDirectParentNode = (
  nodes: ReadonlyArray<DiagramNode>,
  node: Omit<DiagramNode, 'id'>,
  targetNodeId: string
): DiagramNode[] => {
  const nodeId = generateId();
  const newNode = { ...node, id: nodeId };
  const targetNode = nodes.find((n) => n.id === targetNodeId);

  // Add the new node
  nodes = [...nodes, newNode];

  // Move all links from the target to the new node
  nodes = nodes = updateNodes(nodes, (n) => ({
    ...n,
    links: n.links?.map((l) => (l.nodeId !== targetNodeId ? l : { ...l, nodeId: newNode.id })),
  }));

  // Add new link to the current node
  nodes = addNodeLink(nodes, newNode.id, { nodeId: targetNodeId });

  return [...nodes];
};

export const addNode = (
  nodes: ReadonlyArray<DiagramNode>,
  node: Omit<DiagramNode, 'id'>,
  targetNodeId: string,
  position: 'TOP' | 'BOTTOM' | 'CHILD'
): DiagramNode[] => {
  switch (position) {
    case 'TOP':
      return addDirectParentNode(nodes, node, targetNodeId);
    case 'BOTTOM':
      return addDirectChildNode(nodes, node, targetNodeId);
    case 'CHILD':
      return addChildNode(nodes, node, targetNodeId);
  }
};

export const updateNode = (
  nodes: ReadonlyArray<DiagramNode>,
  id: string,
  updateFn: (node: DiagramNode) => Partial<DiagramNode>
): DiagramNode[] => {
  return updateNodes(nodes, (node) => ({
    ...node,
    ...(node.id === id ? updateFn(node) : null),
  }));
};

export const updateNodes = (
  nodes: ReadonlyArray<DiagramNode>,
  updateFn: (node: DiagramNode) => Partial<DiagramNode>
): DiagramNode[] => {
  return nodes.map((node) => ({
    ...node,
    ...updateFn(node),
  }));
};

export const deleteNode = (nodes: ReadonlyArray<DiagramNode>, id: string): DiagramNode[] => {
  // Remove the node
  nodes = nodes.filter((x) => x.id !== id);

  // Remove all links from and to that node
  nodes = removeNodeLinkById(nodes, id);

  return [...nodes];
};

export const deleteNodeSmart = (nodes: ReadonlyArray<DiagramNode>, id: string): DiagramNode[] => {
  const node = nodes.find((n) => n.id === id);
  const parentNodes = getParentNodes(nodes, id);
  const childNodes = getChildNodes(nodes, id);

  // For 1 parents and many children, add the new links to the parent elements
  if (parentNodes.length === 1 && childNodes.length > 0) {
    nodes = updateNode(nodes, parentNodes[0].id, (n) => ({
      ...n,
      links: [...(n.links ?? []), ...(node?.links ?? [])],
    }));

    nodes = deleteNode(nodes, id);
    return [...nodes];
  }

  // For many parents and 1 child, update the parents links to point to the child node
  if (parentNodes.length > 0 && childNodes.length === 1) {
    parentNodes.forEach((parentNode) => {
      nodes = updateNode(nodes, parentNode.id, (n) => ({
        ...n,
        links: n.links?.map((l) =>
          l.nodeId === id
            ? {
                ...l,
                nodeId: childNodes[0].id,
              }
            : l
        ),
      }));
    });

    nodes = deleteNode(nodes, id);
    return [...nodes];
  }

  nodes = deleteNode(nodes, id);
  return [...nodes];
};

export const removeNodeLinkById = (
  nodes: ReadonlyArray<DiagramNode>,
  linkNodeId: string
): DiagramNode[] => {
  return updateNodes(nodes, (node) => ({
    ...node,
    links: node.links?.filter((link) => link.nodeId !== linkNodeId),
  }));
};

export const addNodeLink = (
  nodes: ReadonlyArray<DiagramNode>,
  nodeId: string,
  link: DiagramNodeLink
): DiagramNode[] => {
  return updateNode(nodes, nodeId, (node) => ({
    ...node,
    links: [...(node.links || []), link],
  }));
};

export const removeNodeLink = (
  nodes: DiagramNode[],
  nodeId: string,
  targetNodeId: string
): DiagramNode[] => {
  return updateNode(nodes, nodeId, (node) => ({
    ...node,
    links: node.links?.filter((link) => link.nodeId !== targetNodeId),
  }));
};

export const fromMermaidCode = (value: string): DiagramNode[] => {
  return [];
};

export const generateMermaidCode = (nodes: DiagramNode[]): string => {
  const links = nodes.flatMap((node) =>
    node.links?.map((link) => ({
      node,
      link,
    }))
  );

  const nodesString = nodes
    .map((n) => {
      const brackets = {
        default: '[*]',
        [DiagramNodeShape.RoundEdges]: '(*)',
        [DiagramNodeShape.Rhombus]: '{*}',
        [DiagramNodeShape.Hexagon]: '{{*}}',
        [DiagramNodeShape.Circle]: '((*))',
        [DiagramNodeShape.Parallelogram]: '[/*/]',
        [DiagramNodeShape.Stadium]: '([*])',
      };
      const text = (n.text || ' ').replace(/"/g, '#quot;');
      return n.id + brackets[n.shape || 'default'].replace('*', `"${text}"`);
    })
    .join('\r\n');

  const linksString = links
    .filter((x) => x?.node)
    .map((x) => {
      if (x?.link.text) {
        return `${x?.node.id} --> |${x?.link.text}| ${x?.link.nodeId}`;
      }
      return `${x?.node.id} --> ${x?.link.nodeId};`;
    })
    .join('\r\n');

  return ['flowchart TD;', nodesString, linksString].join('\r\n');
};
