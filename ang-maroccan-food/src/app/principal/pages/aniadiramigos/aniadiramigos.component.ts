import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { AmigoPost } from 'src/app/model/AmigoPost';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-aniadiramigos',
  templateUrl: './aniadiramigos.component.html',
  styleUrls: ['./aniadiramigos.component.css'],
  providers: [MessageService]
})
export class AniadiramigosComponent implements OnInit {
  responsiveOptions;
  private respuestaWS: Observable<Respuesta>;
  listaUsuarios: User[] = [];
  user: User;
  amigoPost: AmigoPost;

  public resultado: string;
  private mensajeErrorWS: string;

  items: MenuItem[];


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

    this.user = new User();
    this.user = this.pasoDatos.user;
    //this.listaUsuarios = this.pasoDatos.listaUsuarios;
    this.consultaUsuarios();
  }

  private consultaUsuarios(){
    let amigo: User;

    this.respuestaWS = this.userService.obtenerUsuarios(this.user);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        amigo = new User();
        amigo.nombre = element.nombre;
        amigo.apellidos = element.apellidos;
        amigo.id = element.id;
        this.listaUsuarios.push(amigo);
      }
      
      if (this.listaUsuarios.length <= 0) {
        this.messageService.add({severity:'info', summary:'Amigos', detail:'Aún no hay usuarios para añadir'});
        this.routerprd.navigate(['principal/home']);        
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener usuarios, ' + error.message});
    });
  }

  public aniadirAmigo(idUsuario: number){
    this.amigoPost = new AmigoPost();
    this.amigoPost.idUsuario1 = this.user.id;
    this.amigoPost.idUsuario2 = idUsuario;

    this.respuestaWS = this.userService.aniadirAmigo(this.amigoPost, this.user);

    this.respuestaWS.subscribe();

    /*
    Implementar este mensaje
    if (response.body == 403) {
      this.messageService.add({severity:'error', summary:'Amigos', detail:'Su sesión ha caducado. Vuelva a iniciar sesión'});
    } else {}*/

    this.messageService.add({severity:'info', summary:'Amigos', detail:'Se ha añadido correctamente'});

    this.quitarElementoArray(idUsuario);
  }

  public quitarElementoArray(id: number) {
    this.listaUsuarios.forEach((value,index)=>{
        if(value.id==id) this.listaUsuarios.splice(index,1);
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
