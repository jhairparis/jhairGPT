import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { ChatService } from '../../services/chats/chats.service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIcon, RouterModule, JsonPipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private platformId = inject(PLATFORM_ID);
  private chatService = inject(ChatService);
  history: Array<{ title: string, owner: string, public: boolean, createdAt: string, id: string, updatedAt: string }> = [];

  @Input() hidden: boolean = false;
  @Output() toggle = new EventEmitter<() => void>();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.chatService.getChats().subscribe(data => {
        this.history = data.result;
      })
    }
  }

  toggleSidebar() {
    this.toggle.emit();
  }
}
