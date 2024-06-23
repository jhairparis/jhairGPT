import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[textareaAutoresize]',
  standalone: true
})
export class TextareaAutoresizeDirective implements OnInit {
  @Output() resized: EventEmitter<number> = new EventEmitter();
  @Input() maxHeight: number = 300;
  constructor(private elementRef: ElementRef) { }

  @HostListener(':input')
  onInput() {
    this.resize();
  }

  ngOnInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  resize() {
    if (this.elementRef.nativeElement.scrollHeight + 2 > this.maxHeight) {
      return;
    }
    this.elementRef.nativeElement.style.height = '0';
    this.elementRef.nativeElement.style.height = (this.elementRef.nativeElement.scrollHeight + 2) + 'px';
    this.resized.emit(this.elementRef.nativeElement.scrollHeight);
  }
}
