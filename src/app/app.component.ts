import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastTestComponent } from './components/toast-test/toast-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'prime-ng-experiments';
}
