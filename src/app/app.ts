import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('loc-mns');
  authService = inject(Auth);

  drawerOpen = false;

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }
}
