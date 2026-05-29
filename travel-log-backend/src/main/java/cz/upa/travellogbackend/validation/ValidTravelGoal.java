package cz.upa.travellogbackend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TravelGoalValidator.class)
@Documented
public @interface ValidTravelGoal {
    // Správná syntaxe: String message() default "...";
    String message() default "Travel goal must be between 1 and 195";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {}; // Pozor, zde má být 'payload', ne 'throws'
}