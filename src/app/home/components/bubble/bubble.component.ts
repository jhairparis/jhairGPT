import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.css',
})
export class BubbleComponent {
  @Input() message = 'You can ask questions like';
  @Input() author = '';
  @Input() timestamp = new Date();
}
