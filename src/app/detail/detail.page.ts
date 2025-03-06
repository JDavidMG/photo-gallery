import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataSnapshot, getDatabase, onValue, ref } from "firebase/database";
import { UserService } from '../services/user.service';

const db = getDatabase();

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  info: any = {};
  name: string = 'Usuario'; // Nombre del usuario
  image: string = 'assets/default-avatar.png'; // Imagen por defecto
  constructor(private route: ActivatedRoute, public router: Router,private userService: UserService) {}

  

  snapshotToObject(snapshot: DataSnapshot) {
    if (!snapshot.exists()) return {}; // Verifica que haya datos
    let item = snapshot.val();
    item.key = snapshot.key;
    return item;
  }
  async ngOnInit() {
    // Cargar los datos del usuario
    await this.loadUser();
    this.loadData();
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

  loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const infoRef = ref(db, 'infos/' + id);
      onValue(infoRef, (snapshot) => {
        this.info = this.snapshotToObject(snapshot);
      });
    }
  }
}

