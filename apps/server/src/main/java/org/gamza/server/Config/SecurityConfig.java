package org.gamza.server.Config;

import lombok.RequiredArgsConstructor;
import org.gamza.server.Config.JWT.JwtAuthenticationFilter;
import org.gamza.server.Config.JWT.JwtTokenProvider;
import org.gamza.server.Error.SecurityErrorHandler.AuthenticationEntryPointHandler;
import org.gamza.server.Error.SecurityErrorHandler.WebAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtTokenProvider jwtTokenProvider;
  private final WebAccessDeniedHandler webAccessDeniedHandler;
  private final AuthenticationEntryPointHandler authenticationEntryPointHandler;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .httpBasic().disable()
      .csrf().disable()
      .cors().configurationSource(corsConfigurationSource())
      .and()
      .headers().frameOptions().disable()
      .and()
      .authorizeRequests().requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
      .and()

      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()

      .authorizeRequests()
      .antMatchers("/ws-stomp/**").permitAll()
      .antMatchers("/auth/login", "/auth/join", "/auth/reissue").permitAll()
      .antMatchers("/game/**").permitAll()
      .anyRequest().authenticated()
      .and()

      .exceptionHandling()
      .authenticationEntryPoint(authenticationEntryPointHandler)
      .accessDeniedHandler(webAccessDeniedHandler)
      .and()

      .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    configuration.addAllowedOrigin("http://localhost:4200");
    configuration.addAllowedOrigin("https://www.stellon.io");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }
}
