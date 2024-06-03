import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BubbleComponent } from '../bubble/bubble.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIcon } from '@ng-icons/core';
import { BackendService } from '../../../src/services/backend.service';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { AutosizeModule } from 'ngx-autosize';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const Model: Record<string, string> = {
  '1': 'auto',
  '2': 'gpt-4o',
  '3': 'gemini-1.5-pro-latest',
  '4': 'gemini-1.5-flash-latest',
};

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
    RouterModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private activatedRoute = inject(ActivatedRoute);
  private backendService = inject(BackendService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private chatId = this.activatedRoute.snapshot.params['id'];

  existId = this.chatId ? true : false;
  origin: string | undefined;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.origin = window.location.origin.replace(/\//g,"%2F").replace(/:/g,'%3A');
    }
  }


  newMessages: any[] = [];
  showQuestions = 2;

  textInput = '';
  modelSelected = '4';

  isAvailable = false;
  removeRounder = false;
  viewSidebar = false;

  async chatting() {
    const message = this.textInput.trim();

    if (message === '' && Model[this.modelSelected] !== undefined) {
      console.log('Input field is empty');
      return;
    }

    this.isAvailable = true;

    if (this.existId) {
      try {
        const response = await firstValueFrom(
          this.backendService.chatting(
            this.textInput,
            this.chatId,
            Model[this.modelSelected]
          )
        );

        const bubbles = {
          user: { text: this.textInput, questions: [] },
          model: response.result,
        };

        this.newMessages = [...this.newMessages, bubbles];
        this.isAvailable = false;
        this.textInput = '';
        this.showQuestions += 2;
      } catch (err) {
        console.error(err);
        this.isAvailable = false;
      }
      return;
    }

    try {
      const data = await firstValueFrom(
        this.backendService.initialiazeChat(
          this.textInput,
          Model[this.modelSelected]
        )
      );
      const x: any = data;

      this.isAvailable = false;

      this.router.navigate([`/chat/${x.chatId}`]);
    } catch (error) {
      // TODO: make a toast
      console.error('Error:', error);
      this.isAvailable = false;
    }
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

  // --
  toogleNavbar() {
    this.viewSidebar = !this.viewSidebar;
  }

  newLine() {
    if (!this.isTouchScren()) this.textInput += '';
  }

  onResized(e: any) {
    if (e >= 70) this.removeRounder = true;
    else this.removeRounder = false;
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
}
