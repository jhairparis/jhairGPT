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
import { Router } from '@angular/router';

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
  private router = inject(Router);

  private chatId = this.activatedRoute.snapshot.params['id'];

  existId = this.chatId ? true : false;

  newMessages: any[] = [];
  showQuestions = 2;

  textInput = '';
  isAvailable = false;
  removeRounder = false;
  viewSidebar = false;

  toogleNavbar() {
    console.log('hey Nav');
    this.viewSidebar = !this.viewSidebar;
  }

  chatting() {
    const message = this.textInput.trim();

    if (message === '') {
      console.log('Input field is empty');
      return;
    }

    this.isAvailable = true;

    if (this.existId) {
      this.backendService.chatting(this.textInput, this.chatId, '').subscribe({
        next: ({ result }) => {
          const bubbles = {
            user: { text: this.textInput, questions: [] },
            model: result,
          };

          this.newMessages = [...this.newMessages, bubbles];
          this.isAvailable= false;
          this.textInput = '';
          this.showQuestions += 2;
        },
        error: (err) => {
          console.error(err);
          this.isAvailable = false;
        },
      });
      return;
    }

    this.backendService.initialiazeChat(this.textInput).subscribe({
      next: (data) => {
        const x: any = data;
        this.isAvailable = false;
        this.router.navigate([`/chat/${x.chatId}`]);
      },
      error: (error) => {
        this.isAvailable = false;
        // TODO: make a toast
        console.log('Error:', error);
      },
    });
  }

  setText(question: string) {
    this.textInput = question;
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

  avalabelSend() {
    return this.textInput.length >= 5;
  }

  onResized(e: any) {
    if (e >= 70) this.removeRounder = true;
    else this.removeRounder = false;
  }

}
