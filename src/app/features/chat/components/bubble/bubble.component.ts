import { CommonModule } from '@angular/common';
import {
  OnInit,
  Component,
  Input,
  inject,
  Output,
  EventEmitter,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { MarkdownPipe, MarkdownService, MermaidAPI } from 'ngx-markdown';

type bubleChat = {
  text: string;
  questions: string[];
};

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [CommonModule, NgIcon, MarkdownPipe],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.css',
})
export class BubbleComponent implements OnInit {
  markdownService = inject(MarkdownService);
  private platformId = inject(PLATFORM_ID);
  @Input() message: bubleChat = { text: '', questions: [] };
  @Input() author!: 'model' | 'humman';
  @Input() timestamp = new Date();
  @Input() showQuestion!: boolean;

  @Output() questionClick = new EventEmitter<string>();

  mermaidTheme = this.isDark()
    ? MermaidAPI.Theme.Dark
    : MermaidAPI.Theme.Default;

  ngOnInit() {
    this.markdownService.renderer.table = (header, body) => {
      return (
        '<div class="md-table"><div><div><table>' +
        '<thead>' +
        header +
        '</thead><tbody>' +
        body +
        '</tbody></table></div></div></div>'
      );
    };

    this.markdownService.renderer.tablecell = (content, flags) => {
      const { align, header } = flags;

      let alignClass = '';
      if (align === 'center') alignClass = "class='center'";
      if (align === 'right') alignClass = "class='right'";

      if (header)
        return '<th scope="col"><div><span>' + content + '</span></div></th>';

      return '<td><div ' + alignClass + '>' + content + '</div></td>';
    };
  }

  onQuestionClick(index: number) {
    this.questionClick.emit(this.message.questions[index]);
  }

  isDark() {
    if (isPlatformBrowser(this.platformId) && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true;
    }
    return false;
  }
}
