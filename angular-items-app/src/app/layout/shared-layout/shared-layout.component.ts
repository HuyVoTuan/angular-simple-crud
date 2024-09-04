import { Component } from '@angular/core';

// Material UI
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shared-layout',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './shared-layout.component.html',
  styleUrl: './shared-layout.component.css',
})
export class SharedLayoutComponent {}
