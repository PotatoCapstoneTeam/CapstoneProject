package org.gamza.server.Service.User;

import lombok.RequiredArgsConstructor;
import org.gamza.server.Entity.CustomUserDetails;
import org.gamza.server.Entity.User;
import org.gamza.server.Repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User findUser = userRepository.findByEmail(email)
      .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    return new CustomUserDetails(findUser);
  }
}