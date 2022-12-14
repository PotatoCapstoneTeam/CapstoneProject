package org.gamza.server.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gamza.server.Config.JWT.JwtTokenProvider;
import org.gamza.server.Dto.TokenDto.ResponseMap;
import org.gamza.server.Dto.TokenDto.TokenApiResponse;
import org.gamza.server.Dto.TokenDto.TokenInfo;
import org.gamza.server.Dto.UserDto.UserJoinDto;
import org.gamza.server.Dto.UserDto.UserLoginDto;
import org.gamza.server.Entity.CustomUserDetails;
import org.gamza.server.Entity.User;
import org.gamza.server.Enum.Authority;
import org.gamza.server.Enum.ReadyStatus;
import org.gamza.server.Enum.TeamStatus;
import org.gamza.server.Error.ErrorCode;
import org.gamza.server.Error.Exception.DuplicateException;
import org.gamza.server.Error.Exception.LoginFailedException;
import org.gamza.server.Repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final JwtTokenProvider jwtTokenProvider;

  @Transactional
  public void join(UserJoinDto userJoinDto) {
    isDuplicateUser(userJoinDto);
    User joinUser = User.builder().email(userJoinDto.getEmail())
      .nickname(userJoinDto.getNickname())
      .password(passwordEncoder.encode(userJoinDto.getPassword()))
      .authority(Authority.ROLE_USER)
      .teamStatus(TeamStatus.NONE)
      .readyStatus(ReadyStatus.NONE)
      .build();
    userRepository.save(joinUser);
  }

  private void isDuplicateUser(UserJoinDto userJoinDto) {
    if (userRepository.findByEmail(userJoinDto.getEmail()) != null) {
      throw new DuplicateException(ErrorCode.DUPLICATE_EMAIL, ErrorCode.DUPLICATE_EMAIL.getMessage());
    }
    if (userRepository.existsByNickname(userJoinDto.getNickname())) {
      throw new DuplicateException(ErrorCode.DUPLICATE_NICKNAME, ErrorCode.DUPLICATE_NICKNAME.getMessage());
    }
  }

  @Transactional
  public TokenApiResponse login(UserLoginDto userLoginDto) {
    // 0. ?????? ??????
    validateUser(userLoginDto);

    // 1. ???????????? ?????? ??????
    UsernamePasswordAuthenticationToken authenticationToken =
      new UsernamePasswordAuthenticationToken(userLoginDto.getEmail(), userLoginDto.getPassword());

    // 2. authentication ?????? ???????????? authentication ?????? ??????
    Authentication authentication = authenticationManagerBuilder.getObject()
      .authenticate(authenticationToken);

    // 3. ?????? ?????? ???????????? ?????? ?????? ??????
    TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

    // 4. user ??? refresh ?????? ?????? ????????????
    User findUser = userRepository.findByEmail(userLoginDto.getEmail());
    findUser.updateToken(tokenInfo.getRefreshToken());

    ResponseMap response = new ResponseMap();
    response.setResponseData("accessToken", tokenInfo.getAccessToken());
    response.setResponseData("refreshToken", tokenInfo.getRefreshToken());

    return response;
  }

  @Transactional
  public void logout(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization");

    if(accessToken != null && jwtTokenProvider.validateToken(request, accessToken)) {
      String email = jwtTokenProvider.parseClaims(accessToken).getSubject();
      User findUser = userRepository.findByEmail(email);

      findUser.deleteToken();
    }
  }

  private void validateUser(UserLoginDto userLoginDto) {
    User findUser = userRepository.findByEmail(userLoginDto.getEmail());
    if (findUser == null) {
      throw new LoginFailedException(ErrorCode.INVALID_USER);
    }
    if (!passwordEncoder.matches(userLoginDto.getPassword(), findUser.getPassword())) {
      throw new LoginFailedException(ErrorCode.INVALID_USER);
    }
  }

  @Transactional
  public TokenApiResponse refresh(HttpServletRequest request) {
    // response ????????? ??? ?????? ??????
    ResponseMap response = new ResponseMap();
    String accessToken = request.getHeader("Authorization");
    String refreshToken = request.getHeader("RefreshToken");
    // refresh ?????? ????????? ??????
    if (refreshToken != null && jwtTokenProvider.validateToken(request, refreshToken)) {
      // access ???????????? email ???????????? ?????? ?????? ??????
      String email = jwtTokenProvider.parseClaims(accessToken).getSubject();
      User findUser = userRepository.findByEmail(email);

      // ?????? ????????? ?????? Access ?????? ?????????
      CustomUserDetails userDetail = new CustomUserDetails(findUser);
      String authorities = userDetail.getAuthorities()
        .stream().map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(","));
      String newAccessToken = jwtTokenProvider.recreateAccessToken(email, authorities);

      response.setResponseData("accessToken", newAccessToken);
      response.setResponseData("refreshToken", refreshToken);

      // Refresh ?????? ???????????? 1??? ????????? ??? refresh ?????? update ??? ??????
      if (jwtTokenProvider.reissueRefreshToken(refreshToken)) {
        String newRefreshToken = jwtTokenProvider.createRefreshToken(email);
        findUser.updateToken(newRefreshToken);
        response.setResponseData("refreshToken", newRefreshToken);
      }

      return response;
    }
    // refresh ?????? ????????? ?????? ?????? -> ????????? ?????? ??????????????? ???????????????
    response.setResponseData("code", ErrorCode.RE_LOGIN.getCode());
    response.setResponseData("HttpStatus", ErrorCode.RE_LOGIN.getStatus());
    response.setResponseData("message", ErrorCode.RE_LOGIN.getMessage());

    return response;
  }

  @Transactional
  public Boolean validateToken(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization");
    if (accessToken != null && jwtTokenProvider.validateToken(request, accessToken)) {
      return true;
    }
    return false;
  }
}
