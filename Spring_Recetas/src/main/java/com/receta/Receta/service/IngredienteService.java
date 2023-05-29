/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.service;

import com.receta.Receta.entity.Ingrediente;
import com.receta.Receta.repository.IngredienteRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class IngredienteService {
    
    @Autowired
    IngredienteRepository ingredienteRepository;
    
    public void saveAll(List<Ingrediente> ingredientes, int idReceta){
        for(Ingrediente ingrediente : ingredientes){
            ingrediente.setIdReceta(idReceta);
            ingredienteRepository.save(ingrediente);
        }        
    }
    
    public void save(Ingrediente ingrediente){
        ingredienteRepository.save(ingrediente);
    }

    public List<Ingrediente> obtenerIngredientesByPalabra(String palabra) {
        return ingredienteRepository.findByNombreContains(palabra);
    }
    
    public List<Ingrediente> obtenerIngredientesByIdReceta(Integer idReceta) {
        
        List<Ingrediente> ingredientes = ingredienteRepository.findByIdReceta(idReceta);
        return ingredientes;
    }
    
    
    public void deleteByIdReceta(int idReceta){
        ingredienteRepository.deleteByIdReceta(idReceta);
    }
}
