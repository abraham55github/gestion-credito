package com.gestion.credito.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String mensaje,
        List<String> errores
) {
}
