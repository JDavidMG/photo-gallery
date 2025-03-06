import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _storage: Storage | null = null;
  private userSubject = new BehaviorSubject<{ name: string; image: string }>({ name: '', image: 'assets/default-avatar.png' });
  user$ = this.userSubject.asObservable(); // Observable para suscribirse a los cambios

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    // Cargar el usuario desde el storage al iniciar
    const user = await this._storage.get('user');
    if (user) {
      this.userSubject.next(user);
    }
  }

  async setUser(user: { name: string; image: string }) {
    await this.init(); // Asegura que el storage está inicializado
    await this._storage?.set('user', user);
    this.userSubject.next(user); // Actualiza el BehaviorSubject
  }

  async getUser() {
    await this.init(); // Asegura que el storage está inicializado
    return await this._storage?.get('user');
  }
}