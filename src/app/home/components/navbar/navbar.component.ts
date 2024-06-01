import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIcon],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() hidden: boolean = false;
  @Output() toggle = new EventEmitter<()=>void>();

  toggleSidebar() {
    console.log('Toggling sidebar');
    this.toggle.emit();
  }
}
