package com.example.demo.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class SexeConverter implements AttributeConverter<Sexe, String> {

    @Override
    public String convertToDatabaseColumn(Sexe sexe) {
        if (sexe == null) {
            return null;
        }
        return sexe.name();
    }

    @Override
    public Sexe convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return Sexe.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}