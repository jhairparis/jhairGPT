import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[textareaAutoresize]',
  standalone: true
})
export class TextareaAutoresizeDirective {
  @Output() resized: EventEmitter<number> = new EventEmitter();
  @Input() maxHeight: number = 300;
  lengthOld = -99;

  constructor(private elementRef: ElementRef) { }

  @HostListener(':input')
  onInput() {
    this.resize();
  }

  responsive(width: number): number {
    return Math.round(width * 0.131) - 19
  }

  @HostListener('window:resize')
  resize() {
    let scrollHeight = this.elementRef.nativeElement.scrollHeight;

    if (scrollHeight > this.maxHeight)
      return;

    this.elementRef.nativeElement.style.height = '0';
    const responsiveLength = this.responsive(this.elementRef.nativeElement.clientWidth)

    if (this.lengthOld >= this.elementRef.nativeElement.value.length && this.elementRef.nativeElement.value.length < responsiveLength)
      scrollHeight = this.elementRef.nativeElement.scrollHeight;

    this.lengthOld = this.elementRef.nativeElement.value.length;
    this.elementRef.nativeElement.style.height = scrollHeight + 'px';
    this.resized.emit(scrollHeight);
  }
}
