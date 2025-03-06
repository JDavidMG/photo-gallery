import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DataSnapshot, getDatabase, onValue, ref, set } from "firebase/database";
import { UserService } from '../services/user.service';

const db = getDatabase();

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: false,
})
export class EditPage implements OnInit {
  name: string = 'Usuario'; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto
  infoForm = this.formBuilder.group({
    info_title: [null, Validators.required],
    info_description: [null, Validators.required]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  
  async ngOnInit() {
    // Cargar los datos del usuario
    await this.loadUser();
    this.getInfo();
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
  getInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const infoRef = ref(db, 'infos/' + id);
      onValue(infoRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = this.snapshotToObject(snapshot);
          this.infoForm.patchValue({
            info_title: data.info_title,
            info_description: data.info_description
          });
        }
      });
    }
  }

  snapshotToObject(snapshot: DataSnapshot) {
    let item = snapshot.val();
    return { ...item, key: snapshot.key };
  }

  updateInfo() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      set(ref(db, 'infos/' + id), this.infoForm.value)
        .then(() => {
          this.router.navigate(['/detail', id]);
        })
        .catch((error) => {
          console.error("Error al actualizar la información:", error);
        });
    }
  }
}
