import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ChatService } from '../../services/chats/chats.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { ActivatedRoute } from '@angular/router';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, BubbleComponent, SkeletonComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  private chatService = inject(ChatService);
  private activatedRoute = inject(ActivatedRoute);
  private chatId = this.activatedRoute.snapshot.params['id'];

  time = new Date();
  oldChat$ = this.chatService.getChat(this.chatId);
  @Input() newMessages!: any[];
  @Input() question!: number;
  @Output() setText = new EventEmitter<string>();

  receiveQuestion(v: string) {
    this.setText.emit(v);
  }
}
