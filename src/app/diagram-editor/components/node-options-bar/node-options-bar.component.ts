import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DiagramNode } from '../../models/node.model';

export enum NodeBarOption {
  AddNode,
  EditNode,
  EditLinks,
  DeleteNode,
}

@Component({
  selector: 'app-node-options-bar',
  templateUrl: './node-options-bar.component.html',
  styleUrls: ['./node-options-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeOptionsBarComponent {
  readonly NodeOption = NodeBarOption;

  @Input() node: DiagramNode;
  @Output() optionClick = new EventEmitter<NodeBarOption>();

  constructor() {}
}
