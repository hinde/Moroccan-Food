/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.controller;

import com.receta.Receta.dto.*;
import com.receta.Receta.entity.Amigo;
import com.receta.Receta.entity.User;
import com.receta.Receta.service.AmigoService;
import com.receta.Receta.service.UserService;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@AllArgsConstructor
public class AmigoController {

    private UserService userService;
    private AmigoService amigoService;

    @RequestMapping("/usuarios")
    public ResponseEntity<?> ObtenerUsuarios(Integer idUsuario) {

        Respuesta respuesta;
        List<User> usuarios = userService.listUser();
        
        List<Amigo> amigosUsuario1 = amigoService.ObtenerAmigos(idUsuario);        
        List<Integer> idsUsuariosAmigos = amigosUsuario1.stream().map(Amigo::getIdUsuarioSegundo).collect(Collectors.toList());
        idsUsuariosAmigos.add(idUsuario);
        
        usuarios = usuarios.stream().filter(user -> !idsUsuariosAmigos.contains(user.getId())).collect(Collectors.toList());
        
        respuesta = new Respuesta("ok", "", usuarios);

        return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
    }
    
    @PostMapping("/aniadirAmigo")
    public ResponseEntity<?> AniadirAmigo(@RequestBody AmigoPOSTDTO amigoPOSTDTO) {

        Respuesta respuesta;
        try {

            Amigo amigo = new Amigo();
            amigo.setIdUsuarioPrimero(amigoPOSTDTO.getIdUsuario1());
            amigo.setIdUsuarioSegundo(amigoPOSTDTO.getIdUsuario2());
            amigoService.save(amigo);

            respuesta = new Respuesta("ok", "", null);
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        } catch (Exception oex) {
            respuesta = new Respuesta("error", "Se ha producido un error al crear la receta", null);
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }
    }    
    
    @RequestMapping("/amigos")
    public ResponseEntity<?> ObtenerAmigosByUsuario(Integer idUsuario) {

        Respuesta respuesta;
        List<Amigo> amigosUsuario1 = amigoService.ObtenerAmigos(idUsuario);        
        List<Integer> idsUsuarios = amigosUsuario1.stream().map(Amigo::getIdUsuarioSegundo).collect(Collectors.toList());
        
        
        List<User> usuarios = userService.obtenerUsuariosByIds(idsUsuarios);
        
        respuesta = new Respuesta("ok", "", usuarios);

        return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
    }    
}
