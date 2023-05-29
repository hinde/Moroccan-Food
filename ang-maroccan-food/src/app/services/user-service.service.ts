import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http'
import { User } from '../model/User';
import { Respuesta } from '../model/Respuesta';
import { Receta } from '../model/Receta';
import { AmigoPost } from '../model/AmigoPost';
import { catchError, retry } from 'rxjs';
import { MenuSemanal } from '../model/MenuSemanal';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private urlLogin: string = environment.urlLogin;
  private urlRegister: string = environment.urlRegister;
  private urlBuscarReceta: string = environment.urlBuscarReceta;
  private urlBuscarRecetaId: string = environment.urlBuscarRecetaId;
  private urlIngredientesByReceta: string = environment.urlIngredientesByReceta;
  private urlPasosByReceta: string = environment.urlPasosByReceta;
  private urlObtenerAmigos: string = environment.urlObtenerAmigos;
  private urlObtenerUsuarios: string = environment.urlObtenerUsuarios;
  private urlObtenerRecetas: string = environment.urlObtenerRecetas;
  private urlCrearReceta: string = environment.urlCrearReceta;
  private urlAniadirAmigos: string = environment.urlAniadirAmigos;
  private urlMenuSemanal: string = environment.urlMenuSemanal;
  private urlGenerarMenuSemanal: string = environment.urlGenerarMenuSemanal;
  private urlGuardarMenuSemanal: string = environment.urlGuardarMenuSemanal;
  private urlActualizarReceta: string = environment.urlActualizarReceta;
  private urlMenuDiario: string = environment.urlMenuDiario;
  private urlEliminarReceta: string = environment.urlEliminarReceta;

  constructor(private http: HttpClient) { }

  public login(user: User){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.post<Respuesta>(this.urlLogin, user, {headers:headers})
  }

  public register(user: User){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.post<Respuesta>(this.urlRegister, user, {headers:headers})
  }

  public buscarReceta(receta: string){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.get<Respuesta>(this.urlBuscarReceta.concat(receta), {headers:headers})
  }

  public obtenerRecetaById(id: number){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.get<Respuesta>(this.urlBuscarRecetaId.concat(String(id)), {headers:headers})
  }

  public obtenerIngredientesByReceta(id: number){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.get<Respuesta>(this.urlIngredientesByReceta.concat(String(id)), {headers:headers})
  }

  public obtenerPasosByReceta(id: number){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.get<Respuesta>(this.urlPasosByReceta.concat(String(id)), {headers:headers})
  }

  /* Menu */
  public obtenerAmigos(user: User){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.get<Respuesta>(this.urlObtenerAmigos.concat(String(user.id)), {headers:headers})
  }

  public obtenerUsuarios(user: User){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.get<Respuesta>(this.urlObtenerUsuarios.concat(String(user.id)), {headers:headers})
  }

  public aniadirAmigo(amigosPost: AmigoPost, user: User){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.post<Respuesta>(this.urlAniadirAmigos, amigosPost, {headers:headers})
  }

  public obtenerRecetas(){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json');
    return this.http.get<Respuesta>(this.urlObtenerRecetas, {headers:headers})
  }

  public crearReceta(receta: Receta, user: User){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.post<Respuesta>(this.urlCrearReceta, receta, {headers:headers})
  }

  public obtenerMenuSemanal(user: User){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.get<Respuesta>(this.urlMenuSemanal.concat(String(user.id)), {headers:headers})
  }

  public obtenerMenuDiario(user: User, fecha: string){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.get<Respuesta>(this.urlMenuDiario.replace("X", String(user.id)).replace("Y", fecha), {headers:headers})
  }

  public generarMenuSemanal(user: User){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.get<Respuesta>(this.urlGenerarMenuSemanal, {headers:headers})
  }

  public guardarMenuSemanal(menu: MenuSemanal, user: User){
    let autorizacion = 'Bearer '.concat(user.token);
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    .set('Authorization', autorizacion);
    return this.http.post<Respuesta>(this.urlGuardarMenuSemanal, menu, {headers:headers})
  }

  public actualizarReceta(receta: Receta){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    return this.http.put<Respuesta>(this.urlActualizarReceta.concat(String(receta.id)), receta, {headers:headers})
  }

  public eliminarReceta(id: number){
    const headers = new HttpHeaders()
    .set('Content-type', 'application/json')
    return this.http.delete<Respuesta>(this.urlEliminarReceta.concat(String(id)), {headers:headers})
  }
  
  
}
