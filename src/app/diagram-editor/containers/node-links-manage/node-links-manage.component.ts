import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DiagramNode, DiagramNodeLink } from '../../models/node.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DiagramEditorStore } from '../../store/diagram-editor.store';

@Component({
  selector: 'app-node-links-manage',
  templateUrl: './node-links-manage.component.html',
  styleUrls: ['./node-links-manage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeLinksManageComponent implements OnInit {
  node: DiagramNode | null;
  nodes: DiagramNode[];

  isAddLinkVisible = false;

  form = new FormGroup({
    node: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    text: new FormControl(''),
  });

  constructor(private readonly store: DiagramEditorStore) {}

  ngOnInit(): void {
    // TODO: Unsubscribe
    this.store.nodes$.subscribe((nodes) => {
      this.nodes = nodes;
    });

    // TODO: Unsubscribe
    this.store.selectedNode$.subscribe((node) => {
      this.node = node;
    });
  }

  addLink() {
    if (!this.form.valid) {
      return;
    }

    const { node, text } = this.form.value;

    if (this.node && node) {
      const link: DiagramNodeLink = {
        nodeId: node,
        text: text ?? undefined,
      };
      this.store.addNodeLink({ nodeId: this.node.id, link });
      this.isAddLinkVisible = false;
      this.form.reset();
    }
  }

  removeLink(toNodeId: string) {
    if (this.node) {
      this.store.deleteNodeLink({ fromNodeId: this.node.id, toNodeId });
    }
  }

  highlightNode(nodeId: string | null) {
    // TODO: Hightlight
  }
}
