import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DiagramNode } from '../../models/node.model';
import * as mermaid from 'mermaid';
import { generateMermaidCode } from '../../node.utils';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiagramComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('mermaid') mermaid!: ElementRef;
  @Input() nodes: DiagramNode[];

  @Input() selectedNode: DiagramNode | null;
  @Output() selectedNodeChanged = new EventEmitter<DiagramNode | null>();
  @Output() nodeClick = new EventEmitter<DiagramNode | null>();

  initialized = false;

  ngOnInit(): void {
    // TODO: Unsubscribe
    this.nodeClick.subscribe((selection) => {
      this.selectedNode = selection;
      this.setNodesFocus(null);
    });
  }

  ngOnChanges(): void {
    this.render();
    this.setNodesFocus(null);
  }

  ngAfterViewInit(): void {
    mermaid.default.initialize({
      startOnLoad: true,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'monotoneX',
      },
    });

    this.initialized = true;

    this.render();
  }

  onClicked(event: MouseEvent) {
    const targetElement = event.target as HTMLElement | null;
    const nodeElement = targetElement?.closest('.node');
    let node = null;
    if (nodeElement) {
      const id = nodeElement.getAttribute('id');
      node = this.nodes.find((node) => id?.includes(node.id));
    }
    this.nodeClick.emit(node);
  }

  // TODO: Create a directive to highlight the diagram elements
  private setNodesFocus(nodeId: string | null) {
    this.nodes.forEach((x) => {
      const selectedNodeElement = this.getNodeElement(x.id);
      if (selectedNodeElement) {
        const svgElement = selectedNodeElement.children[0] as SVGAElement;
        svgElement.style.stroke = '';
        svgElement.style.strokeWidth = '';
        svgElement.style.fill = '';
      }
    });

    // Aways focus the selected one
    if (this.selectedNode) {
      const selectedNodeElement = this.getNodeElement(this.selectedNode.id);
      if (selectedNodeElement) {
        const svgElement = selectedNodeElement.children[0] as SVGAElement;
        svgElement.style.stroke = '#2590EB';
        svgElement.style.fill = '#BEAFE';
        svgElement.style.strokeWidth = '2px';
      }
    }

    if (nodeId) {
      (this.getNodeElement(nodeId)?.children[0] as SVGElement).style.stroke = '#22C55E';
      (this.getNodeElement(nodeId)?.children[0] as SVGElement).style.fill = '#E7FCDC';
      (this.getNodeElement(nodeId)?.children[0] as SVGElement).style.strokeWidth = '2px';
    }
  }

  private getNodeElement(nodeId: string): Element | null {
    let result = null;
    const mermaidElement = this.mermaid?.nativeElement as HTMLElement;
    if (mermaidElement) {
      mermaidElement.querySelectorAll('.node').forEach((nodeElement) => {
        const id = nodeElement?.getAttribute('id');
        if (id?.includes(nodeId)) {
          result = nodeElement;
        }
      });
    }
    return result;
  }

  private render() {
    if (!this.initialized) {
      return;
    }

    const element = this.mermaid.nativeElement;
    mermaid.default.render('chart', generateMermaidCode(this.nodes), (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      bindFunctions(element);
    });
  }
}
