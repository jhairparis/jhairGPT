import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { BackendService } from '../../../src/services/backend.service';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgIconComponent,
    FormsModule,
    AutosizeModule,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  private backendService = inject(BackendService);
  private router = inject(Router);
  textInput = '';
  isAvailable = false;
  removeRounder = false;

  chatting() {
    const message = this.textInput.trim();

    if (message === '') {
      console.log('Input field is empty');
      return;
    }

    this.isAvailable = true;

    this.backendService.createNewChat(this.textInput).subscribe({
      next: ({ result }: any) => {
        this.backendService.initialiazeChat(result.chatId).subscribe({
          next: () => {
            this.isAvailable = false;
            this.router.navigate([`/chat/${result.chatId}`]);
          },
          error: (error) => {
            this.isAvailable = false;
            // TODO: make a toast
            console.log('Error:', error);
          },
        });
      },
      error: (error: any) => {
        this.isAvailable = false;
        // TODO: make a toast
        console.log('Error:', error);
      },
    });
  }

  isTouchScren() {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return true;
    }
    return false;
  }

  newLine() {
    if (!this.isTouchScren()) this.textInput += '';
  }

  onSubmit(e: Event) {
    if (!this.isTouchScren()) {
      e.preventDefault();
      this.chatting();
    }
  }

  onResized(e: any) {
    if (e >= 70) this.removeRounder = true;
    else this.removeRounder = false;
  }

  year = new Date().getFullYear();
}
