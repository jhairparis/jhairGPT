import { Component } from '@angular/core';

type aboutInfo = {
  name: string;
  content: string[];
  icon?: any;
};

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
})
export class ChatComponent {
  about: aboutInfo[] = [
    {
      name: 'Examples',
      icon: 'ionSunnySharp',
      content: [
        `"Explain quantum computing in simple terms"`,
        `"Got any creative ideas for a 10 year old's birthday"`,
        `"How do I make an HTTP request in Javascript?"`,
      ],
    },
    {
      name: 'Capabilities',
      icon: 'ionAnalytics',
      content: [
        `"Explain quantum computing in simple terms"`,
        `"Got any creative ideas for a 10 year old's birthday"`,
        `"How do I make an HTTP request in Javascript?"`,
      ],
    },
    {
      name: 'Limitations',
      icon: 'ionWarningOutline',
      content: [
        `"Explain quantum computing in simple terms"`,
        `"Got any creative ideas for a 10 year old's birthday"`,
        `"How do I make an HTTP request in Javascript?"`,
      ],
    },
  ];
}
