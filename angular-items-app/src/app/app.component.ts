import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SharedLayoutComponent } from './layout/shared-layout/shared-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedLayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'angular-items-app';
}
