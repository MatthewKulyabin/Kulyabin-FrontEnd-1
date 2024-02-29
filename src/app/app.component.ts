import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  leftDate: number = new Date(2001, 0, 1).getTime();
  rightDate: number = new Date().getTime();
}
