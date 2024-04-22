import { CommonModule } from '@angular/common';
import { OnInit, Component, Input, inject } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { MarkdownPipe, MarkdownService } from 'ngx-markdown';

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
  @Input() message: bubleChat = { text: '', questions: [] };
  @Input() author!: 'model' | 'humman';
  @Input() timestamp = new Date();
  @Input() showQuestion!: boolean;

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
}
