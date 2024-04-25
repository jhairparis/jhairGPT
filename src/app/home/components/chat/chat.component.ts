import { Component, inject } from '@angular/core';
import { BubbleComponent } from '../bubble/bubble.component';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIcon } from '@ng-icons/core';
import { BackendService } from '../../../src/services/backend.service';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { AutosizeModule } from 'ngx-autosize';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    BubbleComponent,
    NavbarComponent,
    NgIcon,
    FormsModule,
    MessageComponent,
    AutosizeModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private activatedRoute = inject(ActivatedRoute);
  private backendService = inject(BackendService);
  private chatId = this.activatedRoute.snapshot.params['id'];

  time = new Date();
  textInput = '';
  isLoading = false;
  newMessages: any[] = [];
  counter = 0;
  showQuestions = 2;

  viewNavbar = false;

  toogleNavbar() {
    this.viewNavbar = !this.viewNavbar;
  }

  chatting() {
    const message = this.textInput.trim();

    if (message === '') {
      console.log('Input field is empty');
      return;
    }
    this.isLoading = true;

    this.backendService
      .chatting(this.textInput, this.chatId, 'gemini-1.5-pro-latest')
      .subscribe({
        next: ({ result }) => {
          const bubbles = {
            user: { text: this.textInput, questions: [] },
            model: result,
          };

          this.newMessages = [...this.newMessages, bubbles];
          this.isLoading = false;
          this.textInput = '';
          this.showQuestions += 2;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
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
}
