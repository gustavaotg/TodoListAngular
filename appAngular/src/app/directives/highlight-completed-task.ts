import { Directive, input, effect, inject, ElementRef } from '@angular/core';


@Directive({
  selector: '[appHighlightCompletedTask]',
})
export class HighlightCompletedTask {
  isCompleted = input(false);
  el = inject(ElementRef);
  constructor() { }

  stylesEffect = effect(() => {
    if (this.isCompleted()) {
      this.el.nativeElement.style.textDecoration = 'line-through';
      this.el.nativeElement.style.color = 'gray';
    } else {
      this.el.nativeElement.style.textDecoration = 'none';
      this.el.nativeElement.style.color = 'black';
    }
  });
}
