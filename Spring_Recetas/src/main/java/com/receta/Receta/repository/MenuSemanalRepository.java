/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.repository;

import com.receta.Receta.entity.MenuSemanal;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuSemanalRepository extends JpaRepository<MenuSemanal, Integer> {
    
    @Query(value = "from menusemanal t where fecha_inicio <= :startDate AND fecha_fin >= :startDate AND id_usuario = :idUsuario")
    List<MenuSemanal> getAllBetweenDate(@Param("startDate")Date startDate, @Param("idUsuario") Integer idUsuario );
}
