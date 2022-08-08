import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { DiagramNode } from '../../models/node.model';
import { DiagramComponent } from '../diagram/diagram.component';

@Component({
  selector: 'app-menu-container',
  templateUrl: './menu-container.component.html',
  styleUrls: ['./menu-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuContainerComponent {
  static readonly LEFT_OFFSET = 10;

  @Input() diagram: DiagramComponent;

  @Input() set node(value: DiagramNode) {
    this.nodeElement = this.diagram.mermaid.nativeElement.querySelector(`.node[id*="${value.id}"]`);
  }

  private nodeElement: HTMLElement;

  @HostBinding('style.top') get topPosition() {
    return Math.floor(this.nodeElement.getBoundingClientRect().top) + window.pageYOffset + 'px';
  }

  @HostBinding('style.left') get leftPosition() {
    return (
      Math.floor(this.nodeElement.getBoundingClientRect().right) +
      MenuContainerComponent.LEFT_OFFSET +
      'px'
    );
  }
}
