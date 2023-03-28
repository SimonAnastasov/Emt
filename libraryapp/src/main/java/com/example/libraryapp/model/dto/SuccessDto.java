package com.example.libraryapp.model.dto;

import lombok.Data;

@Data
public class SuccessDto {
    private String successMessage;

    public SuccessDto(String successMessage) {
        this.successMessage = successMessage;
    }
}
