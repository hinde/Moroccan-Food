package com.receta.Receta.service;

import com.receta.Receta.entity.*;
import com.receta.Receta.repository.PasoRepository;
import java.util.List;
import javax.transaction.Transactional;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Transactional
public class PasoService {

    PasoRepository pasoRepository;
    
    public void saveAll(List<Paso> pasos, int idReceta){
        for(Paso paso : pasos){
            paso.setIdReceta(idReceta);
            pasoRepository.save(paso);
        }        
    }    
    
    public void save(Paso paso){
        pasoRepository.save(paso);
    }
    
    public List<Paso> obtenerPasosByIdReceta(Integer idReceta) {
        List<Paso> pasos = pasoRepository.findByIdReceta(idReceta);
        return pasos;
    }    
    
   
    public void deleteByIdReceta(int idReceta){
    	pasoRepository.deleteByIdReceta(idReceta);
    }
}
