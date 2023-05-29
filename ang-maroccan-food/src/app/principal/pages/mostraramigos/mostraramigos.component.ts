import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-mostraramigos',
  templateUrl: './mostraramigos.component.html',
  styleUrls: ['./mostraramigos.component.css'],
  providers: [MessageService]
})
export class MostraramigosComponent implements OnInit {
  responsiveOptions;
  listaAmigos: User[] = [];

  items: MenuItem[];

  user: User;
  private respuestaWS: Observable<Respuesta>;
  public resultado: string;
  private mensajeErrorWS: string;

  constructor(private pasoDatos: PasoDatosService, private userService: UserService,
    private messageService: MessageService, private routerprd:Router) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

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
                  this.crearReceta();
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
    this.cargaInformacionAmigos();
  }

  cargaInformacionAmigos(){
    let amigo: User;

    this.user = this.pasoDatos.user;

    console.log(this.user);
    this.respuestaWS = this.userService.obtenerAmigos(this.user);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        amigo = new User();
        amigo.nombre = element.nombre;
        amigo.apellidos = element.apellidos;
        amigo.email = element.email;
        this.listaAmigos.push(amigo);
      }
      
      if (this.listaAmigos.length <= 0) {
        this.messageService.add({severity:'info', summary:'', detail:'Aún no tiene amigos en su perfil'});
        //this.routerprd.navigate(['principal/home']);
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener amigos, ' + error.message});
    });
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

  crearReceta(){
    this.routerprd.navigate(['principal/crearreceta']);
  }

  mostrarMenuDiario(){
    this.pasoDatos.indicador = "D";
    this.routerprd.navigate(['principal/menudiario']);
  }

  mostrarMenuSemanal(){
    this.routerprd.navigate(['principal/menusemanal']);
  }

}
