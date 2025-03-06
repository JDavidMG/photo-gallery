import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
  apiKey: 'AIzaSyBRGItwZ7GMZjd9CEOVv-SxAzhLqqmSaZk',
  databaseURL: 'https://galeria-d0959-default-rtdb.firebaseio.com',
};
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor() {
    initializeApp(firebaseConfig);
  }
}
