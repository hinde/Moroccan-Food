/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.controller;

import com.receta.Receta.dto.*;
import com.receta.Receta.entity.User;
import com.receta.Receta.entity.ValidationToken;
import com.receta.Receta.service.TokenService;
import com.receta.Receta.service.UserService;

import java.time.LocalDateTime;
import java.util.*;

import com.receta.Receta.service.email.IEmailSender;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@AllArgsConstructor
public class UserController {

    private final String secretKey = "superhypersecret";
    private UserService userService;
    private TokenService tokenService;
    private IEmailSender emailSender;

    @PostMapping("/login")
    public ResponseEntity<?> login(
    		@RequestBody UserDto userDto
    ) {
        User userBBDD = userService.obtenerUsuarioByEmail(userDto.Email);
        
        Respuesta respuesta;
        if (userBBDD == null) {
            respuesta = new Respuesta(
                "error",
                "No existe el usuario o contraseña incorrecta",
                null
            );
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }

        BCryptPasswordEncoder b = new BCryptPasswordEncoder();
        Boolean resultado = b.matches(userDto.Contrasena, userBBDD.getContrasena());

        if (!resultado) {
            respuesta = new Respuesta(
                "error",
                "Contrasena incorrecta",
                null
            );
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }
        if(!userBBDD.getEnabled()){

            respuesta = new Respuesta(
                "Alert",
                "Usuario aun no ha confirmado su cuenta",
                null
            );
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }

        String token = getJWTToken(userDto.Email);
        UserDto user = new UserDto();

        user.setNombre(userBBDD.getNombre());
        user.setApellidos(userBBDD.getApellidos());
        user.setSexo(userBBDD.getSexo());
        user.setEmail(userDto.Email);
        user.setToken(token);
        user.setId(userBBDD.getId());
        user.setRol(userBBDD.getRole());

        respuesta = new Respuesta("ok", "", user);

        return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
    }

    @PostMapping("/registerUser")
    public ResponseEntity<?> Register(@RequestBody UserDto userDto) {
        Respuesta respuesta;

        User userBBDD = userService.obtenerUsuarioByEmail(userDto.Email);

        if (userBBDD != null) {
            respuesta = new Respuesta(
                "error",
                "El usuario con email " + userDto.Email + " ya existe.",
                null
            );
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }

        if(!userDto.getContrasena().equals(userDto.getSegundaContrasena())){
            respuesta = new Respuesta(
                "error",
                "Las contrasenas no coinciden",
                null
            );
            return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
        }

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(userDto.getContrasena());

        User user = User
            .builder()
            .Nombre(userDto.getNombre())
            .Apellidos(userDto.getApellidos())
            .Sexo(userDto.getSexo())
            .email(userDto.getEmail())
            .enabled(false)
            .Contrasena(encodedPassword)
            .role(userDto.getRol())
            .build();

        userService.save(user);
        String token = UUID.randomUUID().toString();
        ValidationToken validationToken = ValidationToken.builder()
            .token(token)
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .confirmedAt(null)
            .user(user)
            .build();

        tokenService.save(validationToken);

        emailSender.send(user.getEmail(),token);

        respuesta = new Respuesta("ok", "Usuario creado, activelo con el email de verificacion", null);
        return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
    }

    @GetMapping("/confirm")
    public ResponseEntity<?> getConfirmUser(@RequestParam("token") String token){
        Respuesta respuesta;
        
        System.out.println("Llego al metodo confirmn!!!");

        ValidationToken confirmationToken = tokenService.findByToken(token).orElseThrow(() ->
            new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        tokenService.confirmToken(token, LocalDateTime.now());

        userService.enableUserByEmail(confirmationToken.getUser().getEmail());

        respuesta = new Respuesta("Ok", "Usuario activado", null);
        return new ResponseEntity<Respuesta>(respuesta, HttpStatus.OK);
    }

    private String getJWTToken(String username) {
        List<GrantedAuthority> grantedAuthorities = AuthorityUtils
                .commaSeparatedStringToAuthorityList("ROLE_USER");

        String token = Jwts
                .builder()
                .setId("softtekJWT")
                .setSubject(username)
                .claim("authorities",
                        grantedAuthorities.stream()
                                .map(GrantedAuthority::getAuthority)
                                .collect(Collectors.toList()))
                .setIssuedAt(new Date(System.currentTimeMillis()))//emision
                //.setExpiration(new Date(System.currentTimeMillis() + 600000))/* 600 seg */
                .signWith(SignatureAlgorithm.HS512,
                        secretKey.getBytes()).compact();

        return "Bearer " + token;
    }


}
