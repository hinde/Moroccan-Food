package com.receta.Receta.controller;

import com.receta.Receta.dto.Respuesta;
import com.receta.Receta.entity.Receta;
import com.receta.Receta.service.RecetaService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/videos/")
public class FilesController {

	private final String PATH = "/";
	private RecetaService recetaService;

	@PostMapping(path = "/nuevo")
	public ResponseEntity<?> addPhoto(
		@RequestBody byte[] barr,
		@RequestParam(name = "receta") String recetaId,
		@RequestParam(name = "fileName") String fileName
	) throws Exception {
		Respuesta respuesta;
		String pathVideo = PATH+fileName;
		try (OutputStream os = new FileOutputStream(new File(pathVideo))) {
			os.write(barr);
			respuesta = new Respuesta("Video Guardado","",null);
			Receta receta = recetaService.obtenerRecetaById(Integer.parseInt(recetaId));
			receta.setPathVideo(pathVideo);
			recetaService.save(receta);
		}catch(Exception e) {
			respuesta = new Respuesta("Error al guardar el video","",null);
			return new ResponseEntity<>(respuesta,HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(respuesta,HttpStatus.OK);
	}
	
	@GetMapping("/")
	public ResponseEntity<?> downloadVideo(
		@RequestParam("recetaId") String recetaId
	) throws IOException {
		Respuesta respuesta;
		Receta receta = recetaService.obtenerRecetaById(Integer.parseInt(recetaId));

		if(receta==null){
			respuesta = new Respuesta("Error","Receta Inexistente",null);
			return new ResponseEntity<>(respuesta,HttpStatus.BAD_REQUEST);
		}
		if(receta.getPathVideo()==null){
			respuesta = new Respuesta("Error","Receta no contiene video",null);
			return new ResponseEntity<>(respuesta,HttpStatus.BAD_REQUEST);
		}


		File file = new File(receta.getPathVideo());
		byte[] fileContent = Files.readAllBytes(file.toPath());

		return ResponseEntity.ok()
			.contentLength(file.length())
			.header("Content-Disposition"," attachment; filename='text.txt'")
			.contentType(MediaType.APPLICATION_OCTET_STREAM)
			.body(fileContent);
	}
}
