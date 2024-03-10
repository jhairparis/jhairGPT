import { Component } from '@angular/core';
import { BubbleComponent } from '../bubble/bubble.component';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [BubbleComponent, NavbarComponent, NgIcon],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  id?: number;
  paramsSub: any;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.paramsSub = this.activatedRoute.params.subscribe(
      (params) => (this.id = parseInt(params['id'], 10))
    );
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }

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
      message: 'Good morning',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 2,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Good Bye!',
      author: 'juan',
      timestamp: new Date(),
    },
  ];
}
