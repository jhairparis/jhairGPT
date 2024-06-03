import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private token = this.activatedRoute.snapshot.params['token'];
  private router = inject(Router);

  ngOnInit(): void {
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiresString = date.toUTCString();

    document.cookie = `me=${this.token}; expires=${expiresString}; path=/`;

    this.router.navigate(['/'], {
      replaceUrl: true,
    });
  }
}
