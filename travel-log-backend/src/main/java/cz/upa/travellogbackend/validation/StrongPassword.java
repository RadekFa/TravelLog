package cz.upa.travellogbackend.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = StrongPasswordValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {
    String message() default "Passwords must contain at least 8 characters, including a number and an uppercase letter.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}