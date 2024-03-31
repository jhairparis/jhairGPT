import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { BackendService } from '../../../src/services/backend.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconComponent, FormsModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  backendService = inject(BackendService);
  router = inject(Router);
  textInput: string = '';
  isAvailable: boolean = false;

  onEnterKeyPressed() {
    this.textInput = this.textInput.trim();

    if (this.textInput === '') {
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

  year = new Date().getFullYear();
}
