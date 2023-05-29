/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.service;

import com.receta.Receta.entity.Receta;
import com.receta.Receta.entity.User;
import com.receta.Receta.repository.RecetaRepository;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RecetaService {
    @Autowired
    RecetaRepository recetaRepository;
    
    public List<Receta> obtenerTodasRecetas(){
        return recetaRepository.findAll();
    }
    /*
    public void save(Receta receta){
        recetaRepository.save(receta);
    }    */
    /*  cambiar el metodo */
    public Integer save(Receta receta){
    	receta = recetaRepository.saveAndFlush(receta);
        return receta.getId();
    }    

    public List<Receta> obtenerRecetaByPalabra(String palabra) {
        return recetaRepository.findByNombreContains(palabra);
    }

    public List<Receta> obtenerRecetasByIds(List<Integer> idsReceta) {
        return recetaRepository.findByIdIn(idsReceta);
    }
    
    public Receta obtenerRecetaById(Integer idReceta){
        Optional<Receta> recetas = recetaRepository.findById(idReceta);
        
        return recetas.get();
    }
    
    public void deleteByIdReceta(Integer idReceta) {
    	recetaRepository.deleteById(idReceta);
    }
}
