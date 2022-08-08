import { Attribute, Directive, ElementRef, HostBinding, Input, OnInit } from '@angular/core';

@Directive({})
export class BaseTailwindDirective {
  @HostBinding('class') classes: string;

  protected setClasses(value: string) {
    const existingClasses = (this.classes || '')
      .split(' ')
      .map((x) => x?.trim())
      .filter((x) => x?.length);
    const buttonClasses = value
      .split(/\r?\n/)
      .map((line) => line?.trim())
      .filter((line) => line?.length);
    this.classes = Array.from(new Set([...buttonClasses, ...existingClasses])).join(' ');
  }
}
