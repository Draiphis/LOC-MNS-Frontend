import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogue',
  imports: [],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  drawerOpen = false;

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }
}
