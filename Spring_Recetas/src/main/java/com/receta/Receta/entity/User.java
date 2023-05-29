/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.entity;

import com.receta.Receta.enums.*;
import com.sun.istack.NotNull;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.Set;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="Id")
    private int id;
    
    @NotNull
    private String Nombre;
    
    @NotNull
    private String Apellidos;

    @Column(columnDefinition = "ENUM('HOMBRE', 'MUJER')")
    @Enumerated(EnumType.STRING)
    private Sexo Sexo;

    @Email(message = "Formato de email invalido")
    @NotNull
    private String email;
    
    @NotNull
    private String Contrasena;

    @NotNull
    private Boolean enabled;

    @NotNull
    @Column(columnDefinition = "ENUM('ROLE_ADMIN', 'ROLE_USER')")
    @Enumerated(EnumType.STRING)
    private Rol role;

    @ManyToMany
    @JoinTable(
        name = "map_user_recetas",
        joinColumns = @JoinColumn(name="fk_id_user"),
        inverseJoinColumns = @JoinColumn(name = "fk_id_receta")
    )
    private Set<Receta> listaRecetas;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return Nombre;
    }

    public void setNombre(String nombre) {
        Nombre = nombre;
    }

    public String getApellidos() {
        return Apellidos;
    }

    public void setApellidos(String apellidos) {
        Apellidos = apellidos;
    }

    public com.receta.Receta.enums.Sexo getSexo() {
        return Sexo;
    }

    public void setSexo(com.receta.Receta.enums.Sexo sexo) {
        Sexo = sexo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContrasena() {
        return Contrasena;
    }

    public void setContrasena(String contrasena) {
        Contrasena = contrasena;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Rol getRole() {
        return role;
    }

    public void setRole(Rol role) {
        this.role = role;
    }

    public Set<Receta> getListaRecetas() {
        return listaRecetas;
    }

    public void setListaRecetas(Set<Receta> listaRecetas) {
        this.listaRecetas = listaRecetas;
    }
}
