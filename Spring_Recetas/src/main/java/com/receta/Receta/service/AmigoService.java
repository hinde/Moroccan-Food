/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.service;

import com.receta.Receta.entity.*;
import com.receta.Receta.repository.AmigoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AmigoService {
    
	@Autowired
    AmigoRepository amigoRepository;

    public void save(Amigo amigo){
        amigoRepository.save(amigo);
    }

    public List<Amigo> ObtenerAmigos(Integer idUsuario1){
        return amigoRepository.findByIdUsuarioPrimero(idUsuario1);
    }
}
