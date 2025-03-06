import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, set } from "firebase/database";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../services/user.service';

const db = getDatabase();

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: false,
})
export class CreatePage implements OnInit {
  name: string = 'Usuario'; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto
  infoForm = this.formBuilder.group({
    info_title: [null, Validators.required],
    info_description: [null, Validators.required]
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService // Inyectar UserService
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

  saveInfo() {
    if (this.infoForm.valid) {
      const id = uuidv4();
      set(ref(db, 'infos/' + id), this.infoForm?.value).then(() => {
        this.router.navigate(['/detail', { id: id }]);
      }).catch((error) => {
        console.error('Error al guardar la información:', error);
      });
    }
  }
}