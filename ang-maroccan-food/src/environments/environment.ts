// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlLogin: "http://localhost:8080/login",
  urlRegister: "http://localhost:8080/registerUser",
  urlBuscarReceta: "http://localhost:8080/buscarReceta?palabra=",
  urlBuscarRecetaId: "http://localhost:8080/receta?id=",
  urlIngredientesByReceta: "http://localhost:8080/ingredientes?idReceta=",
  urlPasosByReceta: "http://localhost:8080/pasos?idReceta=",
  urlObtenerAmigos: "http://localhost:8080/amigos?idUsuario=",
  urlObtenerUsuarios: "http://localhost:8080/usuarios?idUsuario=",
  urlObtenerRecetas: "http://localhost:8080/recetas",
  urlCrearReceta: "http://localhost:8080/crearReceta",
  urlAniadirAmigos: "http://localhost:8080/aniadirAmigo",
  urlMenuSemanal: "http://localhost:8080/obtenerMenuSemanal?idUsuario=",
  urlGenerarMenuSemanal: "http://localhost:8080/generarMenuSemanal",
  urlGuardarMenuSemanal: "http://localhost:8080/guardarMenuSemanal",
  urlActualizarReceta: "http://localhost:8080/actualizar?recetaId=",
  urlMenuDiario: "http://localhost:8080/obtenerMenuDiario?idUsuario=X&fechaString=Y",
  urlEliminarReceta: "http://localhost:8080/borrarReceta?recetaId=",

  passprhrase: "soyadministrador"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
