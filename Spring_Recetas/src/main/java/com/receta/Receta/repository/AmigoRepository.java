/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.repository;

import com.receta.Receta.entity.Amigo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

//Objectos se generan como Singletons -> genera un soilo objeto de cada clase
//Sea parte del contexto de spring -> @ bean, service, component, repository
//Anotaicion reposutorio para que Spring lo cargue en el contexto como Respositorio
@Repository
public interface AmigoRepository extends JpaRepository<Amigo,Integer>{
    
    List<Amigo> findByIdIn(List<Integer> idsAmigos);
    
    List<Amigo> findByIdUsuarioPrimero(int idUsuario1);

}
