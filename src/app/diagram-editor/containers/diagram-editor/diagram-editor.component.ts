import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { DiagramNode } from '../../../diagram-editor/models/node.model';
import { NodeBarOption } from '../../components/node-options-bar/node-options-bar.component';
import { DiagramEditorStore } from '../../store/diagram-editor.store';

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  providers: [DiagramEditorStore],
})
export class DiagramEditorComponent implements OnInit, OnDestroy {
  @ViewChild('mermaid') mermaid!: ElementRef;

  @Input()
  set nodes(value: DiagramNode[]) {
    this.store.setNodes(value);
  }

  nodes$: Observable<DiagramNode[]>;
  selectedNode: DiagramNode | null = null;
  section: NodeBarOption | null = null;
  sections = NodeBarOption;

  private ngUnsubscribe$ = new Subject<void>();

  @HostListener('document:keydown.control.z', ['$event'])
  undo(e: KeyboardEvent) {
    e.preventDefault();
    this.store.undo();
  }

  constructor(private readonly store: DiagramEditorStore) {}

  ngOnInit(): void {
    this.nodes$ = this.store.nodes$;

    this.store.selectedNode$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((node) => {
      this.selectedNode = node;

      if (!node || node.id !== this.selectedNode?.id) {
        this.section = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  nodeBarOptionClicked(option: NodeBarOption) {
    if (!this.selectedNode) {
      return;
    }

    if (option === NodeBarOption.DeleteNode) {
      this.deleteNode(this.selectedNode);
      return;
    }

    this.section = option;
  }

  nodeClicked(node: DiagramNode | null) {
    this.store.selectNode(node?.id ?? null);
  }

  deleteNode(node: DiagramNode) {
    this.store.deleteNode(node.id);
  }
}
