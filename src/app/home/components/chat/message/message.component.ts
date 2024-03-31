import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { BackendService } from '../../../../src/services/backend.service';
import { BubbleComponent } from '../../bubble/bubble.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, BubbleComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent implements OnInit {
  private backendService = inject(BackendService);
  private activatedRoute = inject(ActivatedRoute);
  private chatId = this.activatedRoute.snapshot.params['id'];

  time = new Date();
  oldChat$ = this.backendService.getChat(this.chatId);
  @Input() newMessages!: any[];

  ngOnInit(): void {}
}
