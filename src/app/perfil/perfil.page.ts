import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class PerfilPage implements OnInit {
  name: string = ''; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {
    const user = await this.userService.getUser();
    if (user) {
      this.name = user.name;
      this.image = user.image ? user.image : 'assets/default-avatar.png'; // Imagen por defecto si no hay
    }
  }

  selectImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result as string; // Actualizar la imagen
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    await this.userService.setUser({ name: this.name, image: this.image });
  }
}