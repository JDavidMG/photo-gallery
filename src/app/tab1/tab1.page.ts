import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importar HttpClient
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
  prediction: string | null = null; // Predicción del tipo de gato

  constructor(
    private userService: UserService, // Inyectar UserService
    private http: HttpClient // Inyectar HttpClient
  ) {}

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

  // Método para manejar la selección de archivos
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      // Enviar la imagen a la API Flask
      this.http.post('http://localhost:5000/predict', formData)
        .subscribe(
          (response: any) => {
            this.prediction = `Clase: ${response.class_id}`; // Mostrar la predicción
          },
          (error) => {
            console.error('Error al enviar la imagen:', error);
            this.prediction = 'Error al predecir el tipo de gato';
          }
        );
    }
  }
}