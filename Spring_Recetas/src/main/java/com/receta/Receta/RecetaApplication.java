package com.receta.Receta;

import com.receta.Receta.entity.User;
import com.receta.Receta.service.RecetaService;
import com.receta.Receta.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@SpringBootApplication
public class RecetaApplication {

    //Punto de arranque de la aplicacion
	public static void main(String[] args) {
		SpringApplication.run(RecetaApplication.class, args);
	}

	//Configuraciones adicionales
	@Bean
    ModelMapper modelMapper() {
            return new ModelMapper();
    }
}
