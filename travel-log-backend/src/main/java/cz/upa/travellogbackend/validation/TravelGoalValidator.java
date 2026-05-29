package cz.upa.travellogbackend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class TravelGoalValidator implements ConstraintValidator<ValidTravelGoal, Integer> {
    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {
        // Pokud je hodnota null, validace neprojde (nebo ji ošetří @NotNull)
        if (value == null) return false;
        // Kontrola rozsahu zemí na světě
        return value >= 1 && value <= 195;
    }
}