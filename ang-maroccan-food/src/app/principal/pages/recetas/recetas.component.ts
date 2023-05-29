import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService, PrimeIcons } from 'primeng/api';
import { Observable } from 'rxjs';
import { Ingrediente } from 'src/app/model/Ingrediente';
import { ItemReceta } from 'src/app/model/ItemReceta';
import { Paso } from 'src/app/model/Paso';
import { Receta } from 'src/app/model/Receta';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'],
  providers: [MessageService]
})
export class RecetasComponent implements OnInit {
  @Input() idReceta: number;

  items: MenuItem[];
  user: User;
  public resultado: string;
  private mensajeErrorWS: string;
  private respuestaWS: Observable<Respuesta>;

  ingrediente: Ingrediente;
  ingredientes: Ingrediente[] = [];
  showIngredientes: boolean;

  paso: Paso;
  pasos: Paso[] = [];
  showPasos: boolean;

  url: string;
  nombreReceta: string;
  muestraVideo: boolean;


  constructor(private messageService: MessageService, private pasoDatos: PasoDatosService, 
    private userService: UserService, private routerprd:Router) { }

  ngOnInit(): void {
    this.items = [
      {
        label:'Atras',
        icon:PrimeIcons.ANGLE_LEFT,
        //routerLink: ['principal/home']
        //routerLink: [this.pasoDatos.router]
        command: (event) => {
          this.atras();
        }
      }
    ];
    this.user = new User();
    this.user = this.pasoDatos.user;
    this.idReceta = this.pasoDatos.idReceta;
    this.infoReceta(this.idReceta);
  }

  public infoReceta(id: number) {
    this.verIngredientes(id);
    this.verPasos(id);
    this.verVideo(id);
  }

  public verIngredientes(id: number){
    this.ingredientes.splice(0);
    this.respuestaWS = this.userService.obtenerIngredientesByReceta(id);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        this.ingrediente = new Ingrediente();
        this.ingrediente.nombre = element.nombre;
        this.ingrediente.cantidad = element.cantidad;
        this.ingredientes.push(this.ingrediente);
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
    this.pasos.splice(0);
    this.respuestaWS = this.userService.obtenerPasosByReceta(id);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        this.paso = new Paso();
        this.paso.orden = element.orden;
        this.paso.descripcion = element.descripcion;
        this.pasos.push(this.paso);
      }

      if (this.pasos.length > 0) {
        this.showPasos = true;
      } else {
        this.showPasos = false;
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener pasoss, ' + error.message});
    });
  }

  public verVideo(id: number){
    this.url = "";
    this.respuestaWS = this.userService.obtenerRecetaById(id);
    //let cadVacia = '';

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;
      this.nombreReceta = response.data.nombre;

      console.log("URL Video: " + response.data.url);
      if (response.data.url != null) {
        this.url = response.data.url;
        //this.mostrarReproductor(response.data.url)
        this.muestraVideo = true;
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al obtener receta, ' + error.message});
    });
  }

  actualizar(){
    let receta: Receta;
    receta = new Receta();

    receta.id = this.idReceta;
    receta.ingredientes = this.ingredientes;
    receta.pasos = this.pasos;

    this.respuestaWS = this.userService.actualizarReceta(receta);
      this.respuestaWS.subscribe();
      this.messageService.add({severity:'info', summary:'', 
        detail:'La receta se ha actualizado correctamente'});
  }

  atras(){
    this.routerprd.navigate([this.pasoDatos.router]);
  }


  
}
