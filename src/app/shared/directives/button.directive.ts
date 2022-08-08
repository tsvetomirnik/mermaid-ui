import { Attribute, Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { BaseTailwindDirective } from './tailwind.directive';

interface AppButtonOptions {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'red' | 'orange' | 'yellow';
}

@Directive({
  selector: '[appButton]',
})
export class ButtonDirective extends BaseTailwindDirective implements OnInit {
  readonly defaultOptions: AppButtonOptions = {
    size: 'sm',
    color: 'blue',
  };

  @Input() appButton?: AppButtonOptions;

  ngOnInit(): void {
    const options = {
      ...this.defaultOptions,
      ...this.appButton,
    };

    this.setClasses(`
      inline-block
      px-6
      py-2.5
      text-${options.size}
      font-medium
      uppercase
      leading-tight
      text-white
      bg-${options.color}-600
      hover:bg-${options.color}-700
      focus:bg-${options.color}-700
      active:bg-${options.color}-800
      disabled:bg-${options.color}-300
      disabled:cursor-not-allowed
      rounded
      focus:outline-none
      focus:ring-0
      transition
      duration-150
      ease-in-out
    `);
  }
}
