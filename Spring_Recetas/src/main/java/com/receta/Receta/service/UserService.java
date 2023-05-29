/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.receta.Receta.service;

import com.receta.Receta.entity.User;
import com.receta.Receta.repository.UserRepository;
import java.util.List;
import javax.transaction.Transactional;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
@Transactional
public class UserService {

    UserRepository userRepository;
    
    public List<User> listUser(){
        return userRepository.findAll();
    }
    
    public User obtenerUsuarioByEmail(String email){
        List<User> user = userRepository.findByEmail(email);
        if (user == null || user.size() <= 0){
            return null;
        }
        return user.get(0);
    }
    
    public List<User> obtenerUsuariosByIds(List<Integer> ids){
        return userRepository.findByIdIn(ids);
    }
    
    public void save(User user){
        userRepository.save(user);
    }

    public int enableUserByEmail(String email){
        return userRepository.enableAppUser(email);
    }

}
