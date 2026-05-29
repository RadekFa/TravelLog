package cz.upa.travellogbackend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);
    private static final String SECRET_STRING = "moje_velmi_tajne_heslo_pro_semestralni_praci_123456";
    private static final SecretKey KEY = Keys.hmacShaKeyFor(SECRET_STRING.getBytes());
    private static final long EXPIRATION_TIME = 86400000;

    // generování tokenu s rolí uživatele
    public String generateToken(String email, String role) {
        logger.info("Generating JWT token for user: {} with role: {}", email, role);
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(KEY)
                .compact();
    }

    // získání emailu (subject) z tokenu
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // získání role z claims v tokenu
    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // validace integrity a platnosti tokenu
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(KEY).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            logger.warn("JWT token has expired");
        } catch (MalformedJwtException e) {
            logger.warn("Invalid JWT token format");
        } catch (SecurityException e) {
            logger.warn("Invalid JWT signature");
        } catch (Exception e) {
            logger.error("JWT validation failed: {}", e.getMessage());
        }
        return false;
    }
}