import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalogue',
  imports: [RouterModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  drawerOpen = false;

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
  }
}
