import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  name: string = 'Usuario';
  image: string = 'assets/default-avatar.png'; // Imagen por defecto

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.loadUser();

    // Suscribirse a los cambios en el servicio para actualizar la imagen y el nombre
    this.userService.user$.subscribe(user => {
      if (user) {
        this.name = user.name;
        this.image = user.image;
      }
    });
  }

  async loadUser() {
    setTimeout(async () => {
      const user = await this.userService.getUser();
      if (user) {
        this.name = user.name;
        this.image = user.image ? user.image : 'assets/default-avatar.png'; // Imagen por defecto si no hay
      }
    }, 500); // Espera medio segundo para asegurarse de que los datos se cargan bien
  }
}