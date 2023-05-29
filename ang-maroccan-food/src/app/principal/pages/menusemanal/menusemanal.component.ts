import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { Menu } from 'src/app/model/Menu';
import { MenuSemanal } from 'src/app/model/MenuSemanal';
import { Receta } from 'src/app/model/Receta';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-menusemanal',
  templateUrl: './menusemanal.component.html',
  styleUrls: ['./menusemanal.component.css'],
  providers: [MessageService]
})
export class MenusemanalComponent implements OnInit {
  items: MenuItem[];

  user: User;
  private respuestaWS: Observable<Respuesta>;
  public resultado: string;
  private mensajeErrorWS: string;
  menuSemanal: MenuSemanal;

  menuLunes: string[] = [];
  menuMartes: string[] = [];
  menuMiercoles: string[] = [];
  menuJueves: string[] = [];
  menuViernes: string[] = [];

  constructor(private pasoDatos: PasoDatosService, private userService: UserService,
    private messageService: MessageService, private routerprd:Router) { }

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
    this.obtenerMenuSemanal();
  }

  obtenerMenuSemanal(){
    this.menuSemanal = new MenuSemanal();
    let menu: Menu;
    let receta: Receta;
    this.respuestaWS = this.userService.obtenerMenuSemanal(this.user);
    this.respuestaWS.subscribe(response => {
      if (response.data == null) {
        this.messageService.add({severity:'info', summary:'', detail:'No hay un menu generado para esta semana'});
      }
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      this.menuSemanal.fechaInicio = response.data.fechaInicio;
      this.menuSemanal.fechaFin = response.data.fechaFin;
      this.menuSemanal.id_usuario = response.data.id_usuario;

      for (let index = 0; index < response.data.menus.length; index++) {
        menu = new Menu();
        const element = response.data.menus[index];
        menu.dia = element.dia;

        receta = new Receta();
        receta.fechaCreacion = element.desayuno.fechaCreacion;
        receta.id = element.desayuno.id;
        receta.nombre = element.desayuno.nombre;
        receta.tipo = element.desayuno.tipo;
        receta.url = element.desayuno.url;
        menu.desayuno = receta;

        receta = new Receta();
        receta.fechaCreacion = element.comida.fechaCreacion;
        receta.id = element.comida.id;
        receta.nombre = element.comida.nombre;
        receta.tipo = element.comida.tipo;
        receta.url = element.comida.url;
        menu.comida = receta;

        receta = new Receta();
        receta.fechaCreacion = element.cena.fechaCreacion;
        receta.id = element.cena.id;
        receta.nombre = element.cena.nombre;
        receta.tipo = element.cena.tipo;
        receta.url = element.cena.url;
        menu.cena = receta;

        this.menuSemanal.menus.push(menu);
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener menu semanal, ' + error.message});
    });
  }

  generarMenuSemanal() {
    this.menuSemanal = new MenuSemanal();
    let menu: Menu;
    let receta: Receta;
    this.respuestaWS = this.userService.generarMenuSemanal(this.user);
    this.respuestaWS.subscribe(response => {
      console.log(response);
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      if (this.resultado === 'error') {
        this.messageService.add({severity:'info', summary:'', detail: this.mensajeErrorWS});
        return;
      }

      this.menuSemanal.fechaInicio = response.data.fechaInicio;
      this.menuSemanal.fechaFin = response.data.fechaFin;
      //this.menuSemanal.id_usuario = response.data.id_usuario;
      this.menuSemanal.id_usuario = this.user.id;
      for (let index = 0; index < response.data.menus.length; index++) {
        menu = new Menu();
        const element = response.data.menus[index];
        menu.dia = element.dia;

        receta = new Receta();
        receta.fechaCreacion = element.desayuno.fechaCreacion;
        receta.id = element.desayuno.id;
        receta.nombre = element.desayuno.nombre;
        receta.tipo = element.desayuno.tipo;
        receta.url = element.desayuno.url;
        menu.desayuno = receta;

        receta = new Receta();
        receta.fechaCreacion = element.comida.fechaCreacion;
        receta.id = element.comida.id;
        receta.nombre = element.comida.nombre;
        receta.tipo = element.comida.tipo;
        receta.url = element.comida.url;
        menu.comida = receta;

        receta = new Receta();
        receta.fechaCreacion = element.cena.fechaCreacion;
        receta.id = element.cena.id;
        receta.nombre = element.cena.nombre;
        receta.tipo = element.cena.tipo;
        receta.url = element.cena.url;
        menu.cena = receta;

        this.menuSemanal.menus.push(menu);
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al general menu semanal, ' + error.message});
    });
  }

  guardarMenuSemanal(){
    this.respuestaWS = this.userService.guardarMenuSemanal(this.menuSemanal, this.user);
    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al guardar menu semanal, ' + error.message});
    });

    this.messageService.add({severity:'info', summary:'', detail:'Se ha creado el menu semanal'});
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
    this.routerprd.navigate(['principal/menudiario']);
  }

  mostrarMenuSemanal(){
    this.routerprd.navigate(['principal/menusemanal']);
  }

  verMenu(dia: string){
    let control: number;

    let fecha: string;
    let hoy: Date = new Date(this.menuSemanal.fechaInicio);

    switch (dia) {
      case "MARTES":
        this.pasoDatos.dia = "Martes";
        control = 3;
        break;
      case "MIERCOLES":
        control = 4;
        this.pasoDatos.dia = "Miercoles";
        break;
      case "JUEVES":
        control = 5;
        this.pasoDatos.dia = "Jueves";
        break;
      case "VIERNES":
        control = 6;
        this.pasoDatos.dia = "Viernes";
        break;
      default:
        control = 2;
        this.pasoDatos.dia = "Lunes";
        break;
    }

    fecha = new String(hoy.getFullYear()) + "-" 
        + new String(hoy.getMonth()+1) + "-" 
        + new String(hoy.getDate()+control);
    
    this.pasoDatos.fecha = fecha;
    this.pasoDatos.indicador = "S";
    this.routerprd.navigate(['principal/menudiario']);
  }

}
