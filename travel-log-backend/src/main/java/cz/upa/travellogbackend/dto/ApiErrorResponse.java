package cz.upa.travellogbackend.dto;

import java.time.LocalDateTime;

public class ApiErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private Object message; // Může to být String, nebo List detailních chyb (např. z validace)

    public ApiErrorResponse(int status, String error, Object message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
    }

    // Gettery
    public LocalDateTime getTimestamp() { return timestamp; }
    public int getStatus() { return status; }
    public String getError() { return error; }
    public Object getMessage() { return message; }
}