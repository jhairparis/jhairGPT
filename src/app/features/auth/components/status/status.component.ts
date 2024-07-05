import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    NgIconComponent,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent {
  private apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  isAuth = false;
  url: string | undefined;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const fix = window.location.origin.replace(/\//g, "%2F").replace(/:/g, '%3A');
      this.url = `${this.apiUrl}/auth/signin?callbackUrl=${fix}`;
      this.signIn()
    }
  }

  async signIn() {
    this.authService.getSession().subscribe(data => {
      if (data.expires) {
        this.isAuth = true;
      }
    })
  }
}
