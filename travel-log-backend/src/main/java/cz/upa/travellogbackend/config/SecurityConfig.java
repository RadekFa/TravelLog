package cz.upa.travellogbackend.config;

import cz.upa.travellogbackend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // OPRAVA 1: Propuštění průzkumných požadavků od prohlížeče (pre-flight OPTIONS)
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                        // OPRAVA 2: Přidáno "/error" pro odmaskování chyb
                        // 1. Veřejné endpointy + Actuator Monitoring
                        .requestMatchers("/api/users/login", "/api/users/register", "/api/test", "/error").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/**").permitAll()

                        // Povolit přihlášeným uživatelům přístup k jejich vlastním nastavením / profilu,
                        // pokud takové endpointy existují pod /api/users/me nebo /api/users/profile
                        .requestMatchers("/api/users/me", "/api/users/profile").authenticated()

                        // 2. Správa OSTATNÍCH uživatelů (např. výpis všech, mazání) vyžaduje ADMINA
                        .requestMatchers("/api/users/**").hasRole("ADMIN")

                        // 3. Ostatní API vyžadují pouze to, aby byl uživatel přihlášen (USER i ADMIN)
                        .requestMatchers("/api/achievements/**", "/api/countries/**", "/api/visits/**", "/api/settings/**").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:4173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Přidány hlavičky s velkými písmeny, aby neodmítal standardní browser requests
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization", "Content-Type", "X-Auth-Token",
                "authorization", "content-type", "x-auth-token"
        ));
        configuration.setExposedHeaders(Arrays.asList("X-Auth-Token", "x-auth-token"));
        configuration.setAllowCredentials(true); // Důležité pro posílání cookies/auth hlaviček cross-origin

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}