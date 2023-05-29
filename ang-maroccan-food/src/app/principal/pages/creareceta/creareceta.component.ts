import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Observable } from 'rxjs';
import { Ingrediente } from 'src/app/model/Ingrediente';
import { Paso } from 'src/app/model/Paso';
import { Receta } from 'src/app/model/Receta';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-creareceta',
  templateUrl: './creareceta.component.html',
  styleUrls: ['./creareceta.component.css'],
  providers: [MessageService]
})
export class CrearecetaComponent implements OnInit {
  nombreReceta: string;
  tipo: string[];
  nombreIngrediente: string;
  filePath: string;
  tipoReceta: string;
  user: User;
  private respuestaWS: Observable<Respuesta>;
  //uploadedFiles: any[] = [];


  
  cantidad: number;
  paso: string;
  ingredientes: Ingrediente[] = [];
  pasos: Paso[] = [];

  url: string;

  items: MenuItem[];

  //cols: any[];

  

  constructor(private messageService: MessageService, private userService: UserService,
    private pasoDatos: PasoDatosService, private routerprd:Router) {
    this.tipo = [
      "DESAYUNO",
      "COMIDA",
      "CENA"
    ];
    this.filePath = "";
    this.user = new User();
    this.user = this.pasoDatos.user;
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
    
    

    /* Columnas para la tabla */
    //this.cols = [
      //{ field: 'descripcion', header: 'Paso' }
    //];
  }

  agregaIngredienteTabla(){
    if (this.nombreIngrediente == "" || this.cantidad <= 0) {
      this.messageService.add({severity:'info', summary:'', 
        detail:'Debe capturar el nombre y cantidad del ingrediente'});
      return;
    }
    let ingrediente: Ingrediente;
    ingrediente = new Ingrediente();
    ingrediente.nombre = this.nombreIngrediente;
    ingrediente.cantidad = this.cantidad;
    this.ingredientes.push(ingrediente);
    this.nombreIngrediente = "";
    this.cantidad = 0;
  }

  agregaPasoTabla(){
    if (this.ingredientes.length == 0) {
      this.messageService.add({severity:'error', summary:'', 
        detail:'Debe capturar los ingredientes, antes de los pasos'});
      return;
    }

    if (this.paso == "") {
      this.messageService.add({severity:'error', summary:'', 
        detail:'Debe capturar un paso'});
      return;
    }
    let paso: Paso;
    paso = new Paso();
    paso.descripcion = this.paso;
    this.pasos.push(paso);
    this.paso = "";
  }

  editarIngredienteInit(ingrediente: Ingrediente){
  }

  editarIngredienteSave(ingrediente: Ingrediente){}

  editarIngredienteCancel(ingrediente: Ingrediente, indice: number){

  }
  
  editarPasoInit(paso: Paso){}
  editarPasoSave(paso: Paso){}
  editarPasoCancel(paso: Paso, indice: number){}

  elegirArchivo(event: any) {
    for(let file of event.files) {
      console.log("file -> ");
      console.log(file);
      this.filePath = file.name;
    }
  }

  crearReceta(){
    let receta: Receta;
    receta = new Receta();
    if (this.nombreReceta == "") {
      this.messageService.add({severity:'error', summary:'', 
        detail:'Debe capturar un nombre para la receta'});
      return;
    }

    if (this.ingredientes.length == 0) {
      this.messageService.add({severity:'error', summary:'', 
        detail:'Debe capturar por lo menos un ingrediente'});
      return;
    }

    if (this.pasos.length == 0) {
      this.messageService.add({severity:'error', summary:'', 
        detail:'Debe capturar por lo menos un paso'});
      return;
    }

    for (let index = 0; index < this.pasos.length; index++) {
      const element = this.pasos[index];
      this.pasos[index].orden = index + 1;
    }

    receta.id = 0;
    receta.nombre = this.nombreReceta;
    receta.ingredientes = this.ingredientes;
    receta.pasos = this.pasos;
    receta.url = this.filePath;
    receta.tipo = this.tipoReceta;

    try {
      this.respuestaWS = this.userService.crearReceta(receta, this.user);
      this.respuestaWS.subscribe();
      this.messageService.add({severity:'info', summary:'', 
        detail:'La receta' + receta.nombre + ' se ha creado correctamente'});
      
      /* Limpiar el formulario */
      this.nombreReceta = "";
      this.nombreIngrediente = "";
      this.cantidad = 0;
      this.paso = "";
      this.ingredientes.splice(0);
      this.pasos.splice(0);


    } catch (error) {
      this.messageService.add({severity:'error', summary:'', 
        detail:'Error al crear la receta: ' + error});
    }
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


}
