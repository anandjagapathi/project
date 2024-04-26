import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {  NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UIService } from './services/ui.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'driveease-rentals';
  spinnername = ''
  constructor(private spinner: NgxSpinnerService, private ui: UIService) { 

    this.ui.spinnerObserver.subscribe({
      next: (val) => {
        if(val) this.spinner.show()
        else this.spinner.hide();

      }
    })
  }
}
