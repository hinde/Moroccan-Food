/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.service;

import com.receta.Receta.entity.MenuSemanal;
import com.receta.Receta.repository.MenuSemanalRepository;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MenuService {

    @Autowired
    MenuSemanalRepository menuSemanalRepository;    
    
    
    public void save(MenuSemanal receta){
        menuSemanalRepository.save(receta);
    }
    
    
    public Date ObtenerFechaInicioSemana(Date fecha){
           Calendar hoy = Calendar.getInstance();
           Calendar lunes = Calendar.getInstance();       
           hoy.setTime(fecha); // Fijamos la fecha (Calendar utiliza los meses en base a 0 por eso le restamos 1)
           lunes.setTime(fecha);           
           
           int diaHoy = hoy.get(Calendar.DAY_OF_WEEK); // 
           if(diaHoy<hoy.getFirstDayOfWeek()) {
              diaHoy+=Calendar.SATURDAY;
           }
           
           lunes.add(Calendar.DATE,hoy.getFirstDayOfWeek() - diaHoy);
           
           return lunes.getTime();
    }
    
    public Date ObtenerFechaFinSemana(Date fecha){
           Calendar hoy = Calendar.getInstance();
           Calendar domingo = Calendar.getInstance();       
           hoy.setTime(fecha); // Fijamos la fecha (Calendar utiliza los meses en base a 0 por eso le restamos 1)
           domingo.setTime(fecha);           
           
           int diaHoy = hoy.get(Calendar.DAY_OF_WEEK); // 
           if(diaHoy<hoy.getFirstDayOfWeek()) {
              diaHoy+=Calendar.SATURDAY;
           }
           int ndias =  hoy.getFirstDayOfWeek() + Calendar.SATURDAY-diaHoy-1;  
           domingo.add(Calendar.DATE,ndias); // le sumamos ese dia  
           
           return domingo.getTime();
    }
    
    public MenuSemanal ObtenerMenuSemanal(Integer idUsuario) throws ParseException{
DateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");

Date today = new Date();

Date todayWithZeroTime = formatter.parse(formatter.format(today));
        
        List<MenuSemanal> menuSemanal = menuSemanalRepository.getAllBetweenDate(todayWithZeroTime, idUsuario);
        
        if (menuSemanal.size() == 0){
            return null;
        }
        
        return menuSemanal.get(0);
    }
    
    public void EliminarMenuSemanalById(Integer id){
        menuSemanalRepository.deleteById(id);
    }
}
