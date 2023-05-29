/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.repository;

import com.receta.Receta.entity.Ingrediente;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Integer>{

    List<Ingrediente> findByNombreContains(String palabra);
    List<Ingrediente> findByIdReceta(Integer IdReceta);
    void deleteByIdReceta(Integer IdReceta);
}
