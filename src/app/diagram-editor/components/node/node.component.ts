import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DiagramNode } from '../../models/node.model';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent {
  @Input() node: DiagramNode;
}
