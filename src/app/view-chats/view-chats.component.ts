import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-chats',
  templateUrl: './view-chats.component.html',
  styleUrls: ['./view-chats.component.less'],
})
export class ViewChatsComponent implements OnInit {
  async getChats() {
    try {
      const options = { method: 'GET' };
      const res = await fetch('https://jhairparis.com/api/projects', options);
      const data = await res.json();
      this.previousChats = data.map((e: any, i: number) => {
        id: i;
        name: e.name;
        link: e.preview;
      });
    } catch (error: any) {
      console.log('error', error.message);
    }
  }

  previousChats = [
    {
      id: 1,
      name: 'Good morning',
      link: '/chat',
    },
    {
      id: 2,
      name: 'Good bye',
      link: '/',
    },
    {
      id: 3,
      name: 'Text',
      link: '/chat',
    },
  ];

  ngOnInit(): void {
    this.getChats();
  }
}
