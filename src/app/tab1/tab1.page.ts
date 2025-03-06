import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; // Importar UserService

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  name: string = 'Usuario'; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto

  constructor(private userService: UserService) {} // Inyectar UserService

  async ngOnInit() {
    // Cargar los datos del usuario
    await this.loadUser();

    // Suscribirse a los cambios en el servicio para actualizar la imagen y el nombre
    this.userService.user$.subscribe((user: { name: string; image: string }) => {
      if (user) {
        this.name = user.name;
        this.image = user.image;
      }
    });
  }

  async loadUser() {
    const user = await this.userService.getUser();
    if (user) {
      this.name = user.name;
      this.image = user.image ? user.image : 'assets/default-avatar.png'; // Imagen por defecto si no hay
    }
  }
}