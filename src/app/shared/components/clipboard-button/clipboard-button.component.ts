import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-clipboard-button',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './clipboard-button.component.html',
  styleUrl: './clipboard-button.component.css',
})
export class ClipboardButtonComponent {
  onClick() {
    console.log('Copied to clipboard');
  }
}
