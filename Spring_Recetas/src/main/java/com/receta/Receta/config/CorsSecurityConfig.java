package com.receta.Receta.config;

import lombok.AllArgsConstructor;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@EnableWebSecurity
@AllArgsConstructor
@Configuration
public class CorsSecurityConfig  extends WebSecurityConfigurerAdapter {

	private JWTAuthorizationFilter jwtAuthorizationFilter;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors(t -> t.configurationSource(corsConfigurationSource()))
		//http.cors(t -> t.disable())
		//http.cors();
			.csrf().disable()
			.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			.and()
			.httpBasic().disable()
			.formLogin().disable()
			.addFilterAfter(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
			.authorizeRequests()
                        .antMatchers(HttpMethod.GET, "/users").permitAll()
                        .antMatchers(HttpMethod.POST, "/registerUser").permitAll()
                        .antMatchers(HttpMethod.POST, "/login").permitAll()                                
                        .antMatchers(HttpMethod.GET, "/recetas").permitAll()
                        .antMatchers(HttpMethod.GET, "/buscarReceta").permitAll()
                        .antMatchers(HttpMethod.GET, "/receta").permitAll()     
                        .antMatchers(HttpMethod.GET, "/ingredientes").permitAll()     
                        .antMatchers(HttpMethod.GET, "/pasos").permitAll()
                        .antMatchers(HttpMethod.GET, "/usuarios").permitAll()
                        .antMatchers(HttpMethod.PUT,"/actualizar").permitAll()/* Quitarlo de aqui */
                        .antMatchers(HttpMethod.DELETE,"/borrarReceta").permitAll()/* Tambien agregar la seguridad */
						.antMatchers(HttpMethod.GET,"/confirm/**").permitAll()
				.anyRequest().authenticated()
		;

	}
	
	/*@Bean
	CorsConfigurationSource corsConfigurer() {
		CorsConfiguration cors = new CorsConfiguration();
		cors.setAllowedHeaders(Arrays.asList("Origin.accept", 
				"X-Requested-With", "Content-Type", "Access-Control-Request-Method", 
				"Access-Control-Request-Headers", "Authorization",
				"Access-Control-Allow-Origin"));
		cors.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
		cors.setAllowedMethods(Arrays.asList("GET", "POST"));
		//cors.addAllowedOrigin("*");
		cors.setMaxAge(Duration.ZERO);
		cors.setAllowCredentials(Boolean.TRUE);
		UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
		src.registerCorsConfiguration("/**", cors);
		return src;
	}*/
	
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration configuration = new CorsConfiguration();
	    configuration.setAllowedOrigins(Collections.singletonList("http://localhost:4200/**"));
	    configuration.addAllowedOrigin("*");
	    configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
	    configuration.setExposedHeaders(Arrays.asList("Authorization", "content-type"));
	    configuration.setAllowedHeaders(Arrays.asList("Authorization", "content-type"));
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", configuration);
	    return source;
	}
	
	
}
