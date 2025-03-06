import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { UserService } from '../services/user.service';

const db = getDatabase();
const dbRef = ref(db, 'infos/');

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  infos: any[] = [];
  name: string = 'Usuario'; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
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

    // Cargar la lista de información desde Firebase
    this.loadInfos();
  }

  async loadUser() {
    const user = await this.userService.getUser();
    if (user) {
      this.name = user.name;
      this.image = user.image ? user.image : 'assets/default-avatar.png'; // Imagen por defecto si no hay
    }
  }

  loadInfos() {
    onValue(dbRef, (snapshot) => {
      this.infos = [];
      snapshot.forEach((childSnapshot) => {
        this.infos.push({
          id: childSnapshot.key,
          info_title: childSnapshot.val().info_title,
          info_description: childSnapshot.val().info_description
        });
      });
    }, {
      onlyOnce: false
    });
  }

  addInfo() {
    this.router.navigate(['/add-info']);
  }

  edit(id: string) {
    this.router.navigate(['/edit', { id: id }]);
  }

  async delete(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete this info?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            const deleteRef = ref(db, 'infos/' + id);
            remove(deleteRef);
          }
        }
      ]
    });

    await alert.present();
  }
}