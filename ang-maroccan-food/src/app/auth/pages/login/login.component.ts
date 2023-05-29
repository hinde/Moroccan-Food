import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { PasoDatosService } from 'src/app/services/paso-datos.service';
import { UserService } from 'src/app/services/user-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  administrador: string;

  public myFormLogin!:FormGroup;
  private mensajeValida: string;
  public resultado: string;
  private mensajeErrorWS: string;
  private user: User;
  private respuestaWS: Observable<Respuesta>;

  constructor(private fb:FormBuilder, private route: ActivatedRoute,
    private routerprd:Router, private userService: UserService,
    private pasoDatos: PasoDatosService, private messageService: MessageService) {
      this.administrador = "";
    }

  ngOnInit(): void {
    this.myFormLogin = this.createMyForm();
    this.user = new User();
  }

  private createMyForm():FormGroup{
    return this.fb.group({
      usuario:['',[Validators.required]],
      password:['',Validators.required]
    });
  }

  public login(){
    if(!this.validaDatos()){
      return;
    }

    this.user.email = this.username;
    this.user.contrasena = this.password;

    this.respuestaWS = this.userService.login(this.user);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      if (this.resultado == "ok") {
        this.user.nombre = response.data.nombre;
        this.user.apellidos = response.data.apellidos;
        this.user.sexo = response.data.sexo;
        this.user.email = response.data.email;
        this.user.contrasena = response.data.contrasena;
        this.user.segundaContrasena = response.data.segundaContrasena;
        this.user.id = response.data.id;
        this.user.token = response.data.token;
        this.user.rol = response.data.rol;

        this.enviarDatosPrincipal(this.user);
      } else {
        this.messageService
        .add({severity:'error', summary:'Service Message', detail:this.mensajeErrorWS});
      }

    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al hacer login, ' + error.message});
    });

    

  }

  public validaDatos(): boolean{
    let valida = true;
    let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    
    if (!regexpEmail.test(this.username)) {
      this.messageService
        .add({severity:'error', summary:'Service Message', detail:'El campo email introducido no tiene un formato correcto'});
        valida = false;
    } else if(this.password == "" || this.password == null){
      this.messageService
        .add({severity:'error', summary:'Service Message', detail:'El campo contraseña es obligatorio'});
        valida = false;
    }

    return valida;
  }

  public submitFormulario(){
    this.user.email = this.myFormLogin.value.usuario;
    this.user.contrasena = this.myFormLogin.value.password;

    if(this.myFormLogin.invalid){
        Object.values(this.myFormLogin.controls).forEach(control=>{
          control.markAllAsTouched();
        });
        return;
    }

    /* Mensajes del validador de datos */
    this.mensajeValida = this.ValidarDatosLogin(this.user);

    if (this.mensajeValida != "") {
      this.messageService
        .add({severity:'error', summary:'', detail:this.mensajeValida});
      return;
    }

    this.respuestaWS = this.userService.login(this.user);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      if (this.resultado == "ok") {
        this.user.nombre = response.data.nombre;
        this.user.apellidos = response.data.apellidos;
        this.user.sexo = response.data.sexo;
        this.user.email = response.data.email;
        this.user.contrasena = response.data.contrasena;
        this.user.segundaContrasena = response.data.segundaContrasena;
        this.user.id = response.data.id;
        this.user.token = response.data.token;

        this.enviarDatosPrincipal(this.user);
      } else {
        this.messageService
        .add({severity:'error', summary:'', detail:this.mensajeErrorWS});
      }

    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al hacer login, ' + error.message});
    });
  }

  private enviarDatosPrincipal(user: User){
    this.pasoDatos.user = this.user;
    this.routerprd.navigate(['principal/home']);
  }

  private ValidarDatosLogin(user:User):string {
    let mensajeError = "";
    let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    
    if (!regexpEmail.test(user.email)) {
      mensajeError = "El campo email introducido no tiene un formato correcto";
    } else if(user.contrasena == ""){
      mensajeError = "El campo contraseña es obligatorio";
    }
    return mensajeError;
  }

  public get f():any{
    return this.myFormLogin.controls;
  }

  public pageRegistro(){
    this.routerprd.navigate(['food/registro']);
  }


}
