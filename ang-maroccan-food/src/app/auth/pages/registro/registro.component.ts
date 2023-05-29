import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Respuesta } from 'src/app/model/Respuesta';
import { User } from 'src/app/model/User';
import { UserService } from 'src/app/services/user-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [MessageService]
})
export class RegistroComponent implements OnInit {
  public myFormRegistro!:FormGroup;
  private user: User;
  private mensajeValida: string;
  private respuestaWS: Observable<Respuesta>;
  public resultado: string;
  private mensajeErrorWS: string;

  constructor(private fb:FormBuilder, private userService: UserService,
    private routerprd:Router, private messageService: MessageService) { }

  ngOnInit(): void {
    
    this.myFormRegistro = this.createMyForm();
    this.user = new User();
  }

  private createMyForm():FormGroup{
    return this.fb.group({
      nombre:['',[Validators.required]],
      apellidos:['',Validators.required],
      sexo:['',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
      passwordRepeat:['',Validators.required]
      //passwordAdministrador:['',Validators.required]
    });
  }

  public submitFormulario(){
    this.user.nombre = this.myFormRegistro.value.nombre;
    this.user.apellidos = this.myFormRegistro.value.apellidos;
    this.user.sexo = this.myFormRegistro.value.sexo;
    this.user.email = this.myFormRegistro.value.email;
    this.user.contrasena = this.myFormRegistro.value.password;
    this.user.segundaContrasena = this.myFormRegistro.value.passwordRepeat;
    this.user.id = 0;

    /* Se validara el administrador con el login */
    this.user.rol = "ROLE_USER";

    /*if (this.myFormRegistro.value.passwordAdministrador != "") {
      if (this.myFormRegistro.value.passwordAdministrador == environment.passprhrase) {
        this.user.rol = "ROLE_ADMIN";
      } else {
        this.messageService
          .add({severity:'error', summary:'', detail:'La clave para el usuario administrador, no es correcta.'});
        return;
      }
    } else {
      this.user.rol = "ROLE_USER";
    }*/

    this.mensajeValida = this.validarDatosRegistrar(this.user);

    if (this.mensajeValida != "") {
      this.messageService
        .add({severity:'error', summary:'Error en el registro', detail:this.mensajeValida});
      return;
    }

    this.respuestaWS = this.userService.register(this.user);

    this.respuestaWS.subscribe(response => {
      this.resultado = response.resultado;
      this.mensajeErrorWS = response.mensajeError;

      if (this.resultado == "ok") {
        this.messageService
          .add({severity:'info', summary:'Registro Exitoso', detail:this.mensajeErrorWS});
      } else {
        this.messageService
          .add({severity:'error', summary:'Error en el registro', detail:this.mensajeErrorWS});
      }
    }, error =>{
      this.messageService
          .add({severity:'error', summary:'', detail:'Error interno del servidor al registrar, ' + error.message});
    });


  }

  redirectLogin(){
    if (this.resultado == "ok") {
      this.routerprd.navigate(['food/login']);
    }
  }

  private validarDatosRegistrar(user:User):string {
    let mensajeError = "";
    let regexpEmail = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
    if (!regexpEmail.test(user.email)) {
      mensajeError = "El campo email introducido no tiene un formato correcto";
    } else if (user.nombre == "") {
      mensajeError = "El campo Nombre es obligatorio";
    } else if (user.apellidos == "") {
      mensajeError = "El campo Apellidos es obligatorio";
    } else if (user.contrasena == "") {
      mensajeError = "El campo contraseña es obligatorio";
    } 
    return mensajeError;
  }
  
  public get f():any{
    return this.myFormRegistro.controls;
  }

}
