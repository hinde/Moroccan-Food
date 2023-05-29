import { DATE_PIPE_DEFAULT_TIMEZONE, formatDate, getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-menudiario',
  templateUrl: './menudiario.component.html',
  styleUrls: ['./menudiario.component.css'],
  providers: [MessageService]
})
export class MenudiarioComponent implements OnInit {
  items: MenuItem[];
  dia: string;
  user: User;

  private respuestaWS: Observable<Respuesta>;
  public resultado: string;
  private mensajeErrorWS: string;

  nombreDesayuno: string;
  idDesayuno: number;
  nombreComida: string;
  idComida: number;
  nombreCena: string;
  idCena: number;

  constructor(private pasoDatos: PasoDatosService, private userService: UserService,
    private routerprd:Router) { }

  ngOnInit(): void {
    this.items = [
      {
        label:'Home',
        icon:PrimeIcons.HOME,
        routerLink: ['principal/home']
      },
      {
          label:'Opciones',
          icon:PrimeIcons.BARS,
          items:[
              {
                label:'Perfil',
                icon:PrimeIcons.USER,
                command: (event) => {
                  this.mostrarPerfil();
                }
              },
              {
                  label:'Mostrar amigos',
                  icon:PrimeIcons.EYE,
                  command: (event) => {
                    this.mostrarAmigos();
                  }
              },
              {
                  label:'Añadir amigos',
                  icon:PrimeIcons.USER_PLUS,
                  command: (event) => {
                    this.aniadirAmigos();
                  }
              },
              {
                label:'Crear recetas',
                icon:PrimeIcons.PLUS_CIRCLE,
                command: (event) => {
                  this.mostrarCrearReceta();
                }
              }
          ]
      },
      {
        label:'Menus',
        icon:PrimeIcons.EYE,
        items:[
          {
            label:'Menu diario',
            icon:PrimeIcons.HEART,
            command: (event) => {
              this.mostrarMenuDiario();
            }
          },
          {
            label:'Menu semanal',
            icon:PrimeIcons.HEART_FILL,
            command: (event) => {
              this.mostrarMenuSemanal();
            }
          },
        ]
      },
      {
          label:'Cerrar sesión',
          icon:PrimeIcons.POWER_OFF,
          routerLink: ['/login']
      }
    ];

    this.user = new User();
    this.user = this.pasoDatos.user;

    this.obtenerMenuDiario();
  }

  obtenerMenuDiario(){
    let fecha: string;
    if (this.pasoDatos.indicador == "S") {
      fecha = this.pasoDatos.fecha;
      this.dia = this.pasoDatos.dia;
    } else {
      switch (new Date().getDay()+1) {
        case 1:
          this.dia = "Domingo";
          break;
        case 2:
          this.dia = "Lunes";
          break;
        case 3:
          this.dia = "Martes";
          break;
        case 4:
          this.dia = "Miercoles";
          break;
        case 5:
          this.dia = "Jueves";
          break;
        case 6:
          this.dia = "Viernes";
          break;
        case 7:
          this.dia = "Sabado";
          break;
      }

      let hoy: Date = new Date();
      fecha = new String(hoy.getFullYear()) + "-" 
      + new String(hoy.getMonth()+1) + "-" 
      + new String(hoy.getDate());
    }

    this.respuestaWS = this.userService.obtenerMenuDiario(this.user, fecha);
    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      this.nombreDesayuno = response.data.desayuno.nombre;
      this.nombreComida = response.data.comida.nombre;
      this.nombreCena = response.data.cena.nombre;

      this.idDesayuno = response.data.desayuno.id;
      this.idComida = response.data.comida.id;
      this.idCena = response.data.cena.id;
    });
  }

  public verDesayuno() {
    this.pasoDatos.router = 'principal/menudiario'
    this.pasoDatos.idReceta = this.idDesayuno;
    this.routerprd.navigate(['principal/receta']);
  }

  public verComida() {
    this.pasoDatos.router = 'principal/menudiario'
    this.pasoDatos.idReceta = this.idComida;
    this.routerprd.navigate(['principal/receta']);
  }

  public verCena() {
    this.pasoDatos.router = 'principal/menudiario'
    this.pasoDatos.idReceta = this.idCena;
    this.routerprd.navigate(['principal/receta']);
  }

  mostrarPerfil(){
    this.routerprd.navigate(['principal/perfil']);
  }

  mostrarAmigos(){
    this.routerprd.navigate(['principal/mostraramigos']);
  }

  private aniadirAmigos(){
    this.routerprd.navigate(['principal/aniadiramigos']);
  }

  mostrarCrearReceta(){
    this.routerprd.navigate(['principal/crearreceta']);
  }

  mostrarMenuDiario(){
    this.pasoDatos.indicador = "D";
    this.obtenerMenuDiario();
    this.routerprd.navigate(['principal/menudiario']);
  }

  mostrarMenuSemanal(){
    this.routerprd.navigate(['principal/menusemanal']);
  }

}
