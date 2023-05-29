/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.dto;

import com.receta.Receta.entity.Receta;
import com.receta.Receta.enums.Dias;


public class MenuDTO {

    /**
     * @return the dia
     */
    public Dias getDia() {
        return dia;
    }

    /**
     * @param dia the dia to set
     */
    public void setDia(Dias dia) {
        this.dia = dia;
    }

    /**
     * @return the desayuno
     */
    public Receta getDesayuno() {
        return desayuno;
    }

    /**
     * @param desayuno the desayuno to set
     */
    public void setDesayuno(Receta desayuno) {
        this.desayuno = desayuno;
    }

    /**
     * @return the comida
     */
    public Receta getComida() {
        return comida;
    }

    /**
     * @param comida the comida to set
     */
    public void setComida(Receta comida) {
        this.comida = comida;
    }

    /**
     * @return the cena
     */
    public Receta getCena() {
        return cena;
    }

    /**
     * @param cena the cena to set
     */
    public void setCena(Receta cena) {
        this.cena = cena;
    }
    
    private Receta desayuno;
    private Receta comida;
    private Receta cena;
    private Dias dia;
    
    public MenuDTO(){
        
    }
}
