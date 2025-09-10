import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextAndNumberOnly]'
})
export class TextAndNumberOnlyDirective {

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Tab'];
    if (!allowedKeys.includes(event.key) && !this.isTextNumberKey(event.key)) {
      event.preventDefault();
    }
  }

  isTextNumberKey(key: string): boolean {
    return /^[0-9 ]*$/.test(key);
  }

}
