import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../services/photo.service';
import { UserService } from '../services/user.service'; // Importar UserService

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  name: string = 'Usuario'; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto

  constructor(
    public photoService: PhotoService,
    private userService: UserService // Inyectar UserService
  ) {}

  async ngOnInit() {
    // Cargar las fotos guardadas
    await this.photoService.loadSaved();

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

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  deletePhoto(photo: UserPhoto) {
    this.photoService.deletePhoto(photo);
  }
}