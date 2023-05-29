import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { Ingrediente } from 'src/app/model/Ingrediente';
import { Paso } from 'src/app/model/Paso';
import { ItemReceta } from 'src/app/model/ItemReceta';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';
import { Receta } from 'src/app/model/Receta';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  items: MenuItem[];
  responsiveOptions;
  buscar: string;
  showAppRecetas: boolean;
  carruselVisible: boolean;
  showInfo:boolean = true;
  showHome:boolean = true;
  user: User;
  private recetaBuscar: string;

  recetaItem: ItemReceta;
  recetas: ItemReceta[] = [];
  showRecetas: boolean;

  ingreItem: Ingrediente;
  ingredientes: Ingrediente[] = [];
  showIngredientes: boolean;

  pasoItem: Paso;
  pasos: Paso[] = [];
  showPasos: boolean;
  receta: Receta;
  url: string;
  showVideo: boolean;

  validaEliminar: boolean = false;

  //menuSemanal: MenuSemanal;

  constructor(private fb:FormBuilder, private pasoDatos: PasoDatosService, 
    private userService: UserService, private routerprd:Router,
    private messageService: MessageService) {
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
        //routerLink: ['principal/home']
        command: (event) => {
          this.mostrarHome();
        }
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
    this.recetas.splice(0);
    this.user = this.pasoDatos.user;

    this.home();
  }

  public home(){
    let resultado: string;
    let mensajeErrorWS: string;
    let respuestaWS: Observable<Respuesta>;
    this.recetas.splice(0);
    respuestaWS = this.userService.obtenerRecetas();
    respuestaWS.subscribe(response => {
      resultado = response.resultado;
      mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        this.recetaItem = new ItemReceta();
        this.recetaItem.nombre = element.nombre;
        this.recetaItem.id = element.id;
        this.recetas.push(this.recetaItem);
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener recetas, ' + error.message});
    });

    if (this.recetas.length > 0) {
      this.showRecetas = true;
    } else {
      this.showRecetas = false;
    }
  }

  public buscarReceta(){
    let resultado: string;
    let mensajeErrorWS: string;
    let respuestaWS: Observable<Respuesta>;
    if (this.buscar == "") {
      this.messageService.add({severity:'info', summary:'', detail:'No se ha introducido un patron de busqueda'});
      return;
    }

    this.recetas.splice(0);
    respuestaWS = this.userService.buscarReceta(this.buscar.replace('\\s', '+'));

    respuestaWS.subscribe(response => {
      resultado = response.resultado;
      mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        this.recetaItem = new ItemReceta();
        this.recetaItem.nombre = element.nombre;
        this.recetaItem.id = element.id;
        this.recetas.push(this.recetaItem);
      }

      this.showRecetas = false;

      if (this.recetas.length > 0) {
        this.showRecetas = true;
      } else {
        this.messageService.add({severity:'info', summary:'', detail:'No hay recetas con el patron de busqueda'});
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al buscar receta, ' + error.message});
    });
  }

  public infoReceta(id: number) {
    //this.carruselVisible = true;
    //this.verIngredientes(id);
    //this.verPasos(id);
    //this.verVideo(id);
    this.pasoDatos.idReceta = id;
    this.pasoDatos.router = 'principal/home'
    this.routerprd.navigate(['principal/receta']);
  }

  public verIngredientes(id: number){
    let resultado: string;
    let mensajeErrorWS: string;
    let respuestaWS: Observable<Respuesta>;

    this.ingredientes.splice(0);
    respuestaWS = this.userService.obtenerIngredientesByReceta(id);

    respuestaWS.subscribe(response => {
      resultado = response.resultado;
      mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        this.ingreItem = new Ingrediente();
        this.ingreItem.nombre = element.nombre;
        this.ingreItem.cantidad = element.cantidad;
        this.ingredientes.push(this.ingreItem);
      }

      if (this.ingredientes.length > 0) {
        this.showIngredientes = true;
      } else {
        this.showIngredientes = false;
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener ingredientes, ' + error.message});
    });
  }

  public verPasos(id: number){
    let resultado: string;
    let mensajeErrorWS: string;
    let respuestaWS: Observable<Respuesta>;
    this.pasos.splice(0);
    respuestaWS = this.userService.obtenerPasosByReceta(id);

    respuestaWS.subscribe(response => {
      resultado = response.resultado;
      mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        this.pasoItem = new Paso();
        this.pasoItem.orden = element.orden;
        this.pasoItem.descripcion = element.descripcion;
        this.pasos.push(this.pasoItem);
      }

      if (this.pasos.length > 0) {
        this.showPasos = true;
      } else {
        this.showPasos = false;
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener pasos, ' + error.message});
    });
  }

  public verVideo(id: number){
    let resultado: string;
    let mensajeErrorWS: string;
    let respuestaWS: Observable<Respuesta>;
    this.url = "";
    respuestaWS = this.userService.obtenerRecetaById(id);

    respuestaWS.subscribe(response => {
      resultado = response.resultado;
      mensajeErrorWS = response.mensajeError;

      this.receta = new Receta();
      if (response.data.url != null) {
        this.url = response.data.url;
        this.showVideo = true;
        this.mostrarReproductor(response.data.url)
      } else {
        this.showVideo = false;
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener receta, ' + error.message});
    });
  }

  eliminarReceta(id: number){
    /*
    Esta funcion no funciona a la primera solo a la segunda vez, revisar
    
    */
    let resultado: string = "";
    let respuestaWS: Observable<Respuesta>;
    /* Obtener menu semanal, si el id del menu esta aqui, validar, si no borrar por Rest */

    this.obtenerMenuSemanal(id);

    if (this.validaEliminar) {
      this.messageService.add({severity:'info', summary:'', 
        detail:'La receta esta asignada a un menu semanal, no se puede eliminar'});
    } else {
      respuestaWS = this.userService.eliminarReceta(id);
      respuestaWS.subscribe(response => {
        resultado = response.resultado;
        console.log("Resu: " + resultado)

        if (resultado === 'ok') {
          this.messageService.add({severity:'info', summary:'', 
            detail:'La receta ha sido eliminada'});
    
          this.recetas.forEach((value,index)=>{
              if(value.id==id) this.recetas.splice(index,1);
          });
        }

      });
    }

    


  }

  obtenerMenuSemanal(id: number){
    let valida: boolean;
    valida = false;

    let respuestaWS: Observable<Respuesta>;
    respuestaWS = this.userService.obtenerMenuSemanal(this.user);
    console.log("ID: " + id);
    respuestaWS.subscribe(response => {
      console.log(response);
      if (response.data == null) {
        valida = false;
        this.validaEliminar = false;
        return;
      }

      for (let index = 0; index < response.data.menus.length; index++) {
        const element = response.data.menus[index];

        if (Number(element.desayuno.id) === id) {
          valida = true;
          this.validaEliminar = true;
          break;
        }
        
        if (Number(element.comida.id) === id) {
          valida = true;
          this.validaEliminar = true;
          break;
        }
        
        if (Number(element.cena.id) === id) {
          valida = true;
          this.validaEliminar = true;
          break;
        }
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener menu semanal, ' + error.message});
    });
  }

  mostrarHome(){
    this.buscar = '';
    this.home();
    this.routerprd.navigate(['principal/home']);
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

  private mostrarReproductor(url: string){
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
