/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.repository;

import com.receta.Receta.entity.MenuDiario;
import com.receta.Receta.enums.Dias;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface MenuDiarioRepository  extends JpaRepository<MenuDiario, Integer>{
	//consultas SQL bastante complejas, crear Query
	//@Query(value="sentencia SQL " )
    @Query(value = "from menudiario a where  id_menusemanal = :idMenu")//hace con :
    List<MenuDiario> getByIdSemanalPrueba(@Param("idMenu")Integer idMenuSemanal);
    //parametros ->@Param("nombre-parametro")
    
    @Query(value = 
    		"from menudiario a where  id_menusemanal = :idMenu and id_usuario = :idUsuario and dia = :dia")
    List<MenuDiario> getByIdSemanalIdUsuarioDia(
    		@Param("idMenu")Integer idMenuSemanal,
    		@Param("idUsuario")Integer idUsuario, 
    		@Param("dia")Dias dia);    
    
    @Modifying
    @Query(value = "delete from menudiario b where id_menusemanal=:idMenu")
    void deleteMenuDiarioPorSemanal(@Param("idMenu") Integer id_menusemanal);    
}
