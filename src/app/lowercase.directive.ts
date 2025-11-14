import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[lowercase]'
})
export class LowercaseDirective {

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const value = event.target.value.toLowerCase();
    this.control.control?.setValue(value, { emitEvent: false });
  }
}
