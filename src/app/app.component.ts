import { Component } from '@angular/core';
import { DiagramNode, DiagramNodeShape } from './diagram-editor/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // TODO: Instead of node array use a mermaid string
  nodes: DiagramNode[] = [
    {
      id: '969e0c94',
      shape: DiagramNodeShape.Circle,
      links: [{ nodeId: 'c6403232' }],
    },
    {
      id: 'c6403232',
      text: 'Ready?',
      shape: DiagramNodeShape.Rhombus,
      links: [
        { nodeId: '02cf745e', text: 'Yes' },
        { nodeId: '2b50b17b', text: 'No' },
      ],
    },
    {
      id: '02cf745e',
      text: 'Item B',
      links: [{ nodeId: 'aa28679e' }],
    },
    {
      id: '2b50b17b',
      text: 'Item C',
      links: [{ nodeId: 'aa28679e' }],
    },
    {
      id: 'aa28679e',
      text: 'Action',
      links: [{ nodeId: '53b3b0f6', text: 'Confirm' }],
    },
    {
      id: '53b3b0f6',
      text: 'Exit',
      links: [{ nodeId: '3dc15563' }],
    },
    {
      id: '3dc15563',
      shape: DiagramNodeShape.Circle,
    },
  ];
}
