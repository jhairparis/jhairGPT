import { Component } from '@angular/core';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { IStaticMethods } from 'preline/preline';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  ionLogIn,
  ionCloudUploadOutline,
  ionMicOutline,
  ionSend,
  ionAttach,
  ionAdd,
  ionDownloadOutline,
  ionInformation,
  ionFlameOutline,
  ionPerson,
} from '@ng-icons/ionicons';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIconComponent],
  viewProviders: [
    provideIcons({
      ionMicOutline,
      ionLogIn,
      ionCloudUploadOutline,
      ionSend,
      ionAttach,
      ionAdd,
      ionDownloadOutline,
      ionInformation,
      ionFlameOutline,
      ionPerson,
    }),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'jhairGPT';
  constructor(private router: Router) {}

  afterNextRender() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }
}
