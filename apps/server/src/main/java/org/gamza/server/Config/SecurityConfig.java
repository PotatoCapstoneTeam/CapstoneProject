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
      .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .authorizeRequests()
      .antMatchers("/**").permitAll()
      .antMatchers("/ws-stomp/**").permitAll()
      .antMatchers("/auth/**").permitAll()
      .antMatchers("/ws-chat/**").permitAll()
      .antMatchers("/test").authenticated()
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
}
