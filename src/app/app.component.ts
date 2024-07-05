import {
  Component, OnInit,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { IStaticMethods } from 'preline/preline';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  ionLogIn,
  ionCloudUploadOutline,
  ionMicOutline,
  ionArrowUp,
  ionAttach,
  ionAdd,
  ionDownloadOutline,
  ionInformation,
  ionFlameOutline,
  ionPerson,
  ionHeart,
  ionHeartDislikeOutline,
  ionCopyOutline,
  ionReload,
  ionSparkles,
  ionChevronBack,
  ionChevronForward,
  ionCreateOutline,
  ionMenu,
  ionClose,
  ionLogInOutline,
  ionLogOutOutline,
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
      ionArrowUp,
      ionAttach,
      ionAdd,
      ionDownloadOutline,
      ionInformation,
      ionFlameOutline,
      ionPerson,
      ionHeart,
      ionHeartDislikeOutline,
      ionCopyOutline,
      ionReload,
      ionSparkles,
      ionChevronBack,
      ionChevronForward,
      ionCreateOutline,
      ionMenu,
      ionClose,
      ionLogInOutline,
      ionLogOutOutline,
    }),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'jhairGPT';
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    });
  }
}
