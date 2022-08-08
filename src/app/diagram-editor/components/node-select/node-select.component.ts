import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DiagramNode } from '../../models/node.model';

@Component({
  selector: 'app-node-select',
  templateUrl: './node-select.component.html',
  styleUrls: ['./node-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NodeSelectComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeSelectComponent implements ControlValueAccessor {
  @Input() nodes: DiagramNode[];
  @Output() optionHover = new EventEmitter<string | null>();

  selectedNode: DiagramNode | null = null;
  isOpen = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  set value(id: string) {
    this.selectedNode = this.nodes.find((x) => x.id === id) ?? null;
    this.onChange(id);
    this.onTouch(id);
  }

  writeValue(value: DiagramNode): void {
    this.selectedNode = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  selectNode(id: string) {
    this.value = id;
    this.isOpen = false;
  }
}
