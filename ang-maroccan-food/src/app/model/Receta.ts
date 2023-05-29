import { Ingrediente } from "./Ingrediente";
import { Paso } from "./Paso";

export class Receta{
    fechaCreacion: string;
    id: number;
    ingredientes: Ingrediente[];
    nombre: string;
    pasos: Paso[];
    tipo: string;
    url: string;
    pathVideo: string;
}