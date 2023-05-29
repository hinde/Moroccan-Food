package com.receta.Receta.utils;

import com.receta.Receta.entity.Ingrediente;
import com.receta.Receta.entity.Paso;
import com.receta.Receta.entity.Receta;
import com.receta.Receta.entity.User;
import com.receta.Receta.enums.Rol;
import com.receta.Receta.enums.Sexo;
import com.receta.Receta.enums.TipoComida;
import com.receta.Receta.repository.RecetaRepository;
import com.receta.Receta.repository.UserRepository;
import com.receta.Receta.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private RecetaService recetaService;
    @Autowired
    private IngredienteService ingredienteService;
    @Autowired
    private PasoService pasoService;
    @Autowired
    private UserService userService;
    @Autowired
    private RecetaRepository recetaRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if(recetaRepository.count() > 0 || userRepository.count() > 0) return;

        String defaultUsersPassword = "1234567890";
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String encodedPassword = passwordEncoder.encode(defaultUsersPassword);

        // Default users
        User user1 = User
                .builder()
                .Nombre("Hind")
                .Apellidos("Essabri")
                .Sexo(Sexo.MUJER)
                .email("hind.essabri@mail.com")
                .enabled(true)
                .Contrasena(encodedPassword)
                .role(Rol.ROLE_ADMIN)
                .build();

        User user2 = User
                .builder()
                .Nombre("Lina")
                .Apellidos("Essabri")
                .Sexo(Sexo.MUJER)
                .email("lina.essabri@mail.com")
                .enabled(true)
                .Contrasena(encodedPassword)
                .role(Rol.ROLE_USER)
                .build();

        userService.save(user1);
        userService.save(user2);

        // Default recetas
        crearDesayunos();
        crearComidas();
        crearCenas();
    }

    private void crearDesayunos(){
        Receta desayuno1 = new Receta();
        desayuno1.setNombre("Pan marroquí");
        desayuno1.setTipo(TipoComida.DESAYUNO);
        Integer idDesayuno1 = recetaService.save(desayuno1);

        Ingrediente ingrediente1 = new Ingrediente();
        ingrediente1.setNombre("Harina");
        ingrediente1.setCantidad("250gr");
        Ingrediente ingrediente2 = new Ingrediente();
        ingrediente2.setNombre("Levadura");
        ingrediente2.setCantidad("4gr");
        ingredienteService.saveAll(List.of(ingrediente1, ingrediente2), idDesayuno1);

        Paso paso1 = new Paso();
        paso1.setDescripcion("Mezclar todo");
        paso1.setOrden(1);
        Paso paso2 = new Paso();
        paso2.setDescripcion("Agregar agua");
        paso2.setOrden(2);
        pasoService.saveAll(List.of(paso1, paso2), idDesayuno1);

        Receta desayuno2 = new Receta();
        desayuno2.setNombre("Galletas");
        desayuno2.setTipo(TipoComida.DESAYUNO);
        Integer idDesayuno2 = recetaService.save(desayuno2);

        Ingrediente ingrediente3 = new Ingrediente();
        ingrediente3.setNombre("Harina");
        ingrediente3.setCantidad("200g");
        Ingrediente ingrediente4 = new Ingrediente();
        ingrediente4.setNombre("chocolate");
        ingrediente4.setCantidad("100g");
        ingredienteService.saveAll(List.of(ingrediente3, ingrediente4), idDesayuno2);

        Paso paso3 = new Paso();
        paso3.setDescripcion("Meter harina");
        paso3.setOrden(1);
        Paso paso4 = new Paso();
        paso4.setDescripcion("Agregar chocolate");
        paso4.setOrden(2);
        pasoService.saveAll(List.of(paso3, paso4), idDesayuno2);
    }

    private void crearComidas(){
        Receta comida1 = new Receta();
        comida1.setNombre("Harira");
        comida1.setTipo(TipoComida.COMIDA);
        Integer idComida1 = recetaService.save(comida1);

        Ingrediente ingrediente1 = new Ingrediente();
        ingrediente1.setNombre("Garbanzos");
        ingrediente1.setCantidad("100g");
        Ingrediente ingrediente2 = new Ingrediente();
        ingrediente2.setNombre("Agua");
        ingrediente2.setCantidad("300ml");
        ingredienteService.saveAll(List.of(ingrediente1, ingrediente2), idComida1);

        Paso paso1 = new Paso();
        paso1.setDescripcion("meter los garbanzos");
        paso1.setOrden(1);
        Paso paso2 = new Paso();
        paso2.setDescripcion("Agregar agua");
        paso2.setOrden(2);
        pasoService.saveAll(List.of(paso1, paso2), idComida1);

        Receta comida2 = new Receta();
        comida2.setNombre("Tacos");
        comida2.setTipo(TipoComida.COMIDA);
        Integer idComida2 = recetaService.save(comida2);

        Ingrediente ingrediente3 = new Ingrediente();
        ingrediente3.setNombre("Pan arabe");
        ingrediente3.setCantidad("6");
        Ingrediente ingrediente4 = new Ingrediente();
        ingrediente4.setNombre("Queso");
        ingrediente4.setCantidad("100g");
        Ingrediente ingrediente5 = new Ingrediente();
        ingrediente5.setNombre("Carne picada");
        ingrediente5.setCantidad("150g");
        ingredienteService.saveAll(List.of(ingrediente3, ingrediente4, ingrediente5), idComida2);

        Paso paso3 = new Paso();
        paso3.setDescripcion("Tostar pan arabe");
        paso3.setOrden(1);
        Paso paso4 = new Paso();
        paso4.setDescripcion("Agregar carne y queso");
        paso4.setOrden(2);
        pasoService.saveAll(List.of(paso3, paso4), idComida2);
    }

    private void crearCenas(){
        Receta cena1 = new Receta();
        cena1.setNombre("Pan con tomate");
        cena1.setTipo(TipoComida.CENA);
        Integer idCena1 = recetaService.save(cena1);

        Ingrediente ingrediente1 = new Ingrediente();
        ingrediente1.setNombre("Pan");
        ingrediente1.setCantidad("2");
        Ingrediente ingrediente2 = new Ingrediente();
        ingrediente2.setNombre("Tomate");
        ingrediente2.setCantidad("4");
        ingredienteService.saveAll(List.of(ingrediente1, ingrediente2), idCena1);

        Paso paso1 = new Paso();
        paso1.setDescripcion("Tostar pan");
        paso1.setOrden(1);
        Paso paso2 = new Paso();
        paso2.setDescripcion("Agregar tomate");
        paso2.setOrden(2);
        pasoService.saveAll(List.of(paso1, paso2), idCena1);

        Receta cena2 = new Receta();
        cena2.setNombre("Guiso de garbanzos");
        cena2.setTipo(TipoComida.CENA);
        Integer idCena2 = recetaService.save(cena2);

        Ingrediente ingrediente3 = new Ingrediente();
        ingrediente3.setNombre("Garbanzos");
        ingrediente3.setCantidad("500g");
        Ingrediente ingrediente4 = new Ingrediente();
        ingrediente4.setNombre("Verduras");
        ingrediente4.setCantidad("100g");
        ingredienteService.saveAll(List.of(ingrediente3, ingrediente4), idCena2);

        Paso paso3 = new Paso();
        paso3.setDescripcion("Cocinar garbanzos");
        paso3.setOrden(1);
        Paso paso4 = new Paso();
        paso4.setDescripcion("Agregar verduras y cocinar.");
        paso4.setOrden(2);
        pasoService.saveAll(List.of(paso3, paso4), idCena2);
    }
}
