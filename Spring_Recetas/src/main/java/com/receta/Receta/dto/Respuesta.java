/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.dto;


public class Respuesta {
    
    public String resultado;
    public String mensajeError;
    public Object data;
    
    public Respuesta(String resultado, String mensajeError, Object data){
        this.resultado = resultado;
        this.mensajeError = mensajeError;
        this.data = data;
    }
}
