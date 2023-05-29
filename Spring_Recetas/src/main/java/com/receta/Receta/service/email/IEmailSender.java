package com.receta.Receta.service.email;

public interface IEmailSender {
    void send (String to, String token);
}
