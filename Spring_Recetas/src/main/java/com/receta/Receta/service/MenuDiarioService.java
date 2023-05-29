/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.service;

import com.receta.Receta.dto.MenuDTO;
import com.receta.Receta.entity.MenuDiario;
import com.receta.Receta.entity.MenuSemanal;
import com.receta.Receta.entity.Receta;
import com.receta.Receta.enums.Dias;
import com.receta.Receta.repository.MenuDiarioRepository;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MenuDiarioService {
    
    @Autowired
    MenuDiarioRepository menuDiarioRepository;
        
    public void saveAll(List<MenuDiario> menusDiarios){
        
        for(MenuDiario menuDuario : menusDiarios){            
            menuDiarioRepository.save(menuDuario);
        }        
    }
    
    public void save(MenuDTO menuDiarioDTO, Receta recetaMenu, MenuSemanal menuSemanal){
        MenuDiario menuDiario = new MenuDiario();
        menuDiario.setDia(menuDiarioDTO.getDia());
        menuDiario.setId_receta(recetaMenu.getId());
        menuDiario.setTipo(recetaMenu.getTipo());
        menuDiario.setId_usuario(menuSemanal.getId_usuario());
        menuDiario.setId_menusemanal(menuSemanal.getId());

        menuDiarioRepository.save(menuDiario);
    }
    
    public List<MenuDiario> ObtenerMenusDiarioBySemanal(Integer idMenuSemanal){
        
        List<MenuDiario> menusDiarios = menuDiarioRepository.getByIdSemanalPrueba(idMenuSemanal);
        
        return menusDiarios;
    }
    
    public List<MenuDiario> ObtenerMenuDiarioByUserDay(Integer idMenuSemanal, Integer idUsuario, Dias dia){
        
        List<MenuDiario> menusDiario = menuDiarioRepository.getByIdSemanalIdUsuarioDia(idMenuSemanal, idUsuario, dia);
        if (menusDiario.size() == 0){
            return null;
        }
        return menusDiario;
        
    }
    
    public void EliminarMenuDiarioByIdSemanal(Integer idMenuSemanal){
        menuDiarioRepository.deleteMenuDiarioPorSemanal(idMenuSemanal);
    }
}
