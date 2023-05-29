/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.controller;

import com.receta.Receta.dto.ItemRecetaDTO;
import com.receta.Receta.dto.RecetaDTO;
import com.receta.Receta.dto.Respuesta;
import com.receta.Receta.entity.*;
import com.receta.Receta.service.*;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
public class RecetaController {

    private RecetaService recetaService;
    private IngredienteService ingredienteService;
    private PasoService pasoService;
    private ModelMapper modelMapper;

    @PostMapping("/crearReceta")
    public ResponseEntity<?> CrearReceta(@RequestBody RecetaDTO recetaDTO) {
    	System.out.println("Entro a crear la receta");

        Respuesta respuesta;
        try {
        	Receta receta = modelMapper.map(recetaDTO, Receta.class);
        	//recetaService.save(receta);
        	
        	if (receta.getUrl().equalsIgnoreCase("")) {
        		receta.setUrl(null);
			}
        	
            Integer id = recetaService.save(receta);

            List<Ingrediente> ingredientes = recetaDTO.getIngredientes().stream()
                    .map(ingrediente -> modelMapper.map(ingrediente, Ingrediente.class))
                    .collect(Collectors.toList());

            List<Paso> pasos = recetaDTO.getPasos().stream()
                .map(paso -> modelMapper.map(paso, Paso.class))
                .collect(Collectors.toList());

            if(ingredientes.size()==0 && pasos.size()!=0){
                respuesta = new Respuesta(
                    "error",
                    "No se puede crear pasos para la receta si los ingredientes no existen", 
                    null
                );
                return new ResponseEntity<Respuesta>(respuesta, HttpStatus.BAD_REQUEST);
            }
            
            //ingredienteService.saveAll(ingredientes, receta.getId());
            //pasoService.saveAll(pasos, receta.getId());
            ingredienteService.saveAll(ingredientes, id);
            pasoService.saveAll(pasos, id);

            respuesta = new Respuesta("ok", "", null);
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        } catch (Exception oex) {
        	oex.printStackTrace();
        	respuesta = new Respuesta("error", "Se ha producido un error al crear la receta", null);
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }
    }

    @GetMapping("/recetas")
    public ResponseEntity<?> Recetas() {

        List<Receta> recetas = recetaService.obtenerTodasRecetas();

        List<ItemRecetaDTO> recetasDTO = recetas.stream()
                .map(receta -> modelMapper.map(receta, ItemRecetaDTO.class))
                .collect(Collectors.toList());

        Respuesta respuesta = new Respuesta("ok", "", recetasDTO);

        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    @GetMapping("/buscarReceta")
    public ResponseEntity<?> BuscarReceta(String palabra) {
    	System.out.println("Entra a buscar");
        List<Receta> recetasEncontradas = recetaService.obtenerRecetaByPalabra(palabra);
        List<Ingrediente> ingredientesEncontrados = ingredienteService.obtenerIngredientesByPalabra(palabra);
        List<Integer> idsReceta = ingredientesEncontrados.stream().map(Ingrediente::getIdReceta).collect(Collectors.toList());;
        List<Receta> recetasEncontradasByIngrediente = recetaService.obtenerRecetasByIds(idsReceta);
        recetasEncontradas.addAll(recetasEncontradasByIngrediente);

        List<Receta> totalRecetasEncontradas = recetasEncontradas.stream()
                .distinct()
                .collect(Collectors.toList());

        Respuesta respuesta = new Respuesta("ok", "", totalRecetasEncontradas);
        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    @GetMapping("/receta")
    public ResponseEntity<?> ObtenerReceta(Integer id) {
        Receta receta = recetaService.obtenerRecetaById(id);
        Respuesta respuesta = new Respuesta("ok", "", receta);

        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    @GetMapping("/ingredientes")
    public ResponseEntity<?> ObtenerIngredientesByReceta(Integer idReceta) {
        List<Ingrediente> ingredientes = ingredienteService.obtenerIngredientesByIdReceta(idReceta);
        Respuesta respuesta = new Respuesta("ok", "", ingredientes);
        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    @GetMapping("/pasos")
    public ResponseEntity<?> ObtenerPasosByReceta(Integer idReceta) {
        List<Paso> pasos = pasoService.obtenerPasosByIdReceta(idReceta)
        		.stream().sorted(Comparator.comparingInt(Paso::getId))
        		.collect(Collectors.toList());
        Respuesta respuesta = new Respuesta("ok", "", pasos);
        return new ResponseEntity(respuesta, HttpStatus.OK);
    }

    @PutMapping("/actualizar")
    public ResponseEntity<?> actualizarReceta(
        @RequestBody RecetaDTO recetaDTO, @RequestParam("recetaId") String recetaId
    ){
    	System.out.println("Entro a actualizar la receta");
        Respuesta respuesta;
        Receta recetaAntigua = recetaService.obtenerRecetaById(Integer.valueOf(recetaId));

        if(recetaAntigua==null){
            respuesta = new Respuesta(
                "error",
                "Receta a actualizar no existe",
                null
            );
            return new ResponseEntity(respuesta, HttpStatus.BAD_REQUEST);
        }

        Receta receta = modelMapper.map(recetaDTO, Receta.class);
        receta.setId(recetaAntigua.getId());
        //recetaService.save(receta);

        List<Ingrediente> ingredientes = recetaDTO.getIngredientes().stream()
            .map(ingrediente -> modelMapper.map(ingrediente, Ingrediente.class))
            .collect(Collectors.toList());

        if(ingredientes.size()==0){
            respuesta = new Respuesta(
                "error",
                "Receta sin ingredientes",
                null
            );
            return new ResponseEntity(respuesta, HttpStatus.BAD_REQUEST);
        }
        
        ingredienteService.deleteByIdReceta(receta.getId());

        ingredienteService.saveAll(ingredientes, receta.getId());
        List<Paso> pasos = recetaDTO.getPasos().stream()
            .map(paso -> modelMapper.map(paso, Paso.class))
            .collect(Collectors.toList());

        if(pasos.size()==0){
            respuesta = new Respuesta(
                "error",
                "Receta sin pasos",
                null
            );
            return new ResponseEntity(respuesta, HttpStatus.BAD_REQUEST);
        }

        pasoService.deleteByIdReceta(receta.getId());
        
        pasoService.saveAll(pasos, receta.getId());
        respuesta = new Respuesta("ok", "Receta actualizada", null);

        return new ResponseEntity(respuesta, HttpStatus.OK);


    }
    
    @DeleteMapping("/borrarReceta")
    public ResponseEntity<?> borrarReceta(@RequestParam("recetaId") String recetaId){
    	System.out.println("Entro a borrar la receta - " + recetaId);
        Respuesta respuesta;
        
        recetaService.deleteByIdReceta(Integer.valueOf(recetaId));

        respuesta = new Respuesta("ok", "Receta eliminada", null);

        return new ResponseEntity(respuesta, HttpStatus.OK);
    }
    
}
