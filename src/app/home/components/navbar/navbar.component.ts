import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIcon, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() hidden: boolean = false;
  @Output() toggle = new EventEmitter<() => void>();

  toggleSidebar() {
    this.toggle.emit();
  }
}
