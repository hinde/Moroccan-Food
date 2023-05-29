
package com.receta.Receta.controller;

import com.receta.Receta.dto.MenuDTO;
import com.receta.Receta.dto.MenuSemanalDTO;
import com.receta.Receta.dto.Respuesta;
import com.receta.Receta.entity.*;
import com.receta.Receta.enums.*;
import com.receta.Receta.service.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
public class MenuController {

    private RecetaService recetaService;
    private MenuService menuService;
    private MenuDiarioService menuDiarioService;
    private ModelMapper modelMapper;
    
    @RequestMapping("/generarMenuSemanal")
    public ResponseEntity<?> GenerarMenuSemanal(){

        Respuesta respuesta ;
        List<Receta> recetas = recetaService.obtenerTodasRecetas();
        
        List<Receta> desayunos = recetas.stream().filter(receta -> receta.getTipo() == TipoComida.DESAYUNO).collect(Collectors.toList());
        List<Receta> comidas = recetas.stream().filter(receta -> receta.getTipo() == TipoComida.COMIDA).collect(Collectors.toList());
        List<Receta> cenas = recetas.stream().filter(receta -> receta.getTipo() == TipoComida.CENA).collect(Collectors.toList());
        
        if (desayunos.size() < 2 || comidas.size() < 2 || cenas.size() < 2){
                respuesta = new Respuesta("error", "Para generar el menú semanal se necesita mínimo 2 recetas de cada tipo de comidas  ", null);
                return new ResponseEntity(respuesta, HttpStatus.OK);            
        }
        
        List<MenuDTO> menuSemanal = new ArrayList<>();
        Random rand = new Random();
        for (int i = 1; i <= 5; i++){
            
            if (i > 1 && (i % 2 == 1)){
                desayunos = recetas.stream().filter(receta -> receta.getTipo() == TipoComida.DESAYUNO).collect(Collectors.toList());
                comidas = recetas.stream().filter(receta -> receta.getTipo() == TipoComida.COMIDA).collect(Collectors.toList());
                cenas = recetas.stream().filter(receta -> receta.getTipo() == TipoComida.CENA).collect(Collectors.toList());                
            }
            
            int randomIndexDesayuno = rand.nextInt(desayunos.size());
            int randomIndexComida = rand.nextInt(comidas.size());
            int randomIndexCena = rand.nextInt(cenas.size());
            
            MenuDTO menu = new MenuDTO();
            menu.setDesayuno(desayunos.get(randomIndexDesayuno));
            menu.setComida(comidas.get(randomIndexComida));
            menu.setCena(cenas.get(randomIndexCena));
            menu.setDia(Dias.values()[i-1]);
            
            menuSemanal.add(menu);
            
            desayunos.remove(randomIndexDesayuno);
            comidas.remove(randomIndexComida);
            cenas.remove(randomIndexCena);
        }
        
        Date fechaCreacion = new Date(System.currentTimeMillis());
        Date fechaLunes =  menuService.ObtenerFechaInicioSemana(fechaCreacion);
        Date fechaDomingo = menuService.ObtenerFechaFinSemana(fechaCreacion);
        
        MenuSemanalDTO menuSemal1 = new MenuSemanalDTO();
        menuSemal1.setFechaFin(fechaDomingo);
        menuSemal1.setFechaInicio(fechaLunes);
        menuSemal1.setMenus(menuSemanal);
        respuesta = new Respuesta("ok", "", menuSemal1);
        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    @PostMapping("/guardarMenuSemanal")
    public ResponseEntity<?> GuardarMenuSemanal(@RequestBody MenuSemanalDTO menuSemanalDTO) {
    
        Respuesta respuesta;
        try{
           
            MenuSemanal menuSemanalBBDD = menuService.ObtenerMenuSemanal(menuSemanalDTO.getId_usuario());
            if (menuSemanalBBDD != null){
                menuService.EliminarMenuSemanalById(menuSemanalBBDD.getId());
                menuDiarioService.EliminarMenuDiarioByIdSemanal(menuSemanalBBDD.getId());
            }
            
            MenuSemanal menuSemanal = modelMapper.map(menuSemanalDTO, MenuSemanal.class); 
            menuSemanal.setId(0);
            menuService.save(menuSemanal);
            
            for( MenuDTO menuDiarioDTO : menuSemanalDTO.getMenus()){
                menuDiarioService.save(menuDiarioDTO, menuDiarioDTO.getDesayuno(), menuSemanal);                
                menuDiarioService.save(menuDiarioDTO, menuDiarioDTO.getComida(), menuSemanal);
                menuDiarioService.save(menuDiarioDTO, menuDiarioDTO.getCena(), menuSemanal);
            }
                     
            respuesta = new Respuesta("ok", "", null);

            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);             
        }
        catch(Exception oex){
            respuesta = new Respuesta("error", "Se ha producido un error al crear la receta", null);
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);             
        }
  
    }    
    
    @RequestMapping("/obtenerMenuSemanal")
    public ResponseEntity<?> ObtenerMenuSemanal(Integer idUsuario) throws ParseException{
        Respuesta respuesta;
        MenuSemanal menuSemanal = menuService.ObtenerMenuSemanal(idUsuario);
        if (menuSemanal == null){
            respuesta = new Respuesta("ok", "", null);
            return new ResponseEntity(respuesta, HttpStatus.OK);
        }
        List<MenuDiario> menusDiarios = menuDiarioService.ObtenerMenusDiarioBySemanal(menuSemanal.getId());
        
        List<MenuDTO> menusSemanalDTO = new ArrayList<>();
        for(Dias dia : Dias.values()){
            List<MenuDiario> menuDiaSeleccionado = menusDiarios.stream().filter(menuDiario -> menuDiario.getDia().equals(dia)).collect(Collectors.toList());
            
            MenuDTO menuDTO = new MenuDTO();
            for(MenuDiario menuDiario: menuDiaSeleccionado){
                
                if (menuDiario.getTipo() == TipoComida.DESAYUNO){                    
                    menuDTO.setDesayuno(recetaService.obtenerRecetaById(menuDiario.getId_receta()));
                }
                if (menuDiario.getTipo() == TipoComida.COMIDA){                    
                    menuDTO.setComida(recetaService.obtenerRecetaById(menuDiario.getId_receta()));
                }                
                
                if (menuDiario.getTipo() == TipoComida.CENA){                    
                    menuDTO.setCena(recetaService.obtenerRecetaById(menuDiario.getId_receta()));
                }                                
            }
            menuDTO.setDia(dia);
            menusSemanalDTO.add(menuDTO);            
        }
        MenuSemanalDTO menuSemanalDTO = modelMapper.map(menuSemanal, MenuSemanalDTO.class);
        menuSemanalDTO.setMenus(menusSemanalDTO);
        
        respuesta = new Respuesta("ok", "", menuSemanalDTO);
        return new ResponseEntity(respuesta, HttpStatus.OK);
    }
    
    @RequestMapping("/obtenerMenuDiario")
    public ResponseEntity<?> ObtenerMenuDiarioByFecha(String fechaString, Integer idUsuario){
        Respuesta respuesta;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date fecha = formatter.parse(fechaString);
            MenuSemanal menuSemanal = menuService.ObtenerMenuSemanal(idUsuario);
            
            if (menuSemanal == null){
                respuesta = new Respuesta("ok", "", null);
                return new ResponseEntity(respuesta, HttpStatus.OK);                  
            }
            Calendar hoy = Calendar.getInstance();
            hoy.setTime(fecha);
            int diaHoy = hoy.get(Calendar.DAY_OF_WEEK)-2;   
            
            if (!(diaHoy >= 0 && diaHoy <= 5)){
                respuesta = new Respuesta("ok", "", null);
                return new ResponseEntity(respuesta, HttpStatus.OK);  
            }              
            Dias valor = Dias.values()[diaHoy];
            
            List<MenuDiario> menusDiario = menuDiarioService.ObtenerMenuDiarioByUserDay(menuSemanal.getId(), idUsuario, valor);
            
            MenuDTO menuDTO = new MenuDTO();
            menuDTO.setDia(valor);
            for(MenuDiario menuDiario : menusDiario){
                if (menuDiario.getTipo() == TipoComida.DESAYUNO){                    
                    menuDTO.setDesayuno(recetaService.obtenerRecetaById(menuDiario.getId_receta()));
                }
                if (menuDiario.getTipo() == TipoComida.COMIDA){                    
                    menuDTO.setComida(recetaService.obtenerRecetaById(menuDiario.getId_receta()));
                }                
                
                if (menuDiario.getTipo() == TipoComida.CENA){                    
                    menuDTO.setCena(recetaService.obtenerRecetaById(menuDiario.getId_receta()));
                } 
            }
            
            
            respuesta = new Respuesta("ok", "", menuDTO);
            return new ResponseEntity(respuesta, HttpStatus.OK);                 
                            
        } catch (ParseException ex) {
            Logger.getLogger(MenuController.class.getName()).log(Level.SEVERE, null, ex);
                respuesta = new Respuesta("error", "Se ha producido un error al obtener el menú diario", null);
                return new ResponseEntity(respuesta, HttpStatus.OK);              
        }
    }
}
