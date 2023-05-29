import { EventEmitter, Injectable, Output } from '@angular/core';
import { ItemReceta } from '../model/ItemReceta';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class PasoDatosService {
  user: User = new User();
  idReceta: number;
  listaAmigos: User[] = [];
  listaUsuarios: User[] = [];
  router: string;
  fecha: string;
  dia: string;
  indicador: string;

  constructor() { }
}
