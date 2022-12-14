package org.gamza.server.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.gamza.server.Dto.GameDto.StageDataDto;
import org.gamza.server.Dto.GameDto.StageRequestDto;
import org.gamza.server.Dto.MessageDto.MessageRequestDto;
import org.gamza.server.Dto.UserDto.AddUserDto;
import org.gamza.server.Entity.GameRoom;
import org.gamza.server.Entity.Message;
import org.gamza.server.Entity.User;
import org.gamza.server.Entity.UserInfo;
import org.gamza.server.Enum.ReadyStatus;
import org.gamza.server.Enum.RoomType;
import org.gamza.server.Enum.TeamStatus;
import org.gamza.server.Enum.UserStatus;
import org.gamza.server.Error.ErrorCode;
import org.gamza.server.Error.Exception.RoomException;
import org.gamza.server.Repository.RoomRepository;
import org.gamza.server.Service.RoomService;
import org.gamza.server.Service.User.UserService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageController {

  @Value("${secretKey}")
  private String secretKey;
  @Value("${selfUrl}")
  private String selfUrl;
  @Value("${stageUrl}")
  private String stageUrl;
  private final RoomService roomService;
  private final UserService userService;
  private final RoomRepository roomRepository;
  private final SimpMessageSendingOperations operations;
  private Map<Long, String> userMap = new HashMap<>();

  @MessageMapping("/message")
  public void sendMessage(Principal principal, @Payload MessageRequestDto messageDto, SimpMessageHeaderAccessor headerAccessor) {
    User user = userService.findByNickname(messageDto.getNickname());
    GameRoom room = roomService.findRoom(messageDto.getRoomId());

    // players userDto ????????? ?????????
    List<AddUserDto> players = roomService.getRoomUsers(room.getId());

    UserInfo userInfo = UserInfo.builder()
      .user(user)
      .userStatus(UserStatus.ROLE_USER)
      .build();

    UserInfo system = UserInfo.builder()
      .system("system")
      .build();

    Message message = Message.builder()
      .userInfo(system)
      .type(messageDto.getType())
      .gameRoom(room)
      .build();

    if (room.getRoomType() == RoomType.LOBBY_ROOM) {
      throw new RoomException(ErrorCode.BAD_REQUEST, "Room Type ??? ???????????????.");
    }

    switch (messageDto.getType()) { // ????????? ?????? ??????
      case JOIN:
        // ?????? 8??? ?????? ?????? ?????? ???????????? ????????? ??????
        for (int i = 0; i < room.getRoomSize(); i++) {
          if (players.isEmpty()) { // ?????? ?????? ??????????????? ??? ?????? ?????? ??????
            userInfo.setUserStatus(UserStatus.ROLE_MANAGER);
            userInfo.getUser().updateReadyStatus(ReadyStatus.NOT_READY);
            userInfo.getUser().updateTeamStatus(TeamStatus.RED_TEAM);
            room.getPlayers().put(i, user);
            userInfo.setPlayerNumber(0);
            headerAccessor.getSessionAttributes().put("userInfo", userInfo);
            headerAccessor.getSessionAttributes().put("roomId", room.getId());
            message.setMessage(userInfo.getUser().getNickname() + "?????? ?????????????????????.");

            roomRepository.save(room);
            break;
          }
          if (!room.getPlayers().containsKey(i)) {
            userInfo.getUser().updateTeamStatus(i % 2 == 0 ? TeamStatus.RED_TEAM : TeamStatus.BLUE_TEAM);
            userInfo.getUser().updateReadyStatus(ReadyStatus.NOT_READY);
            room.getPlayers().put(i, user);
            userInfo.setPlayerNumber(i);
            headerAccessor.getSessionAttributes().put("userInfo", userInfo);
            headerAccessor.getSessionAttributes().put("roomId", room.getId());
            message.setMessage(userInfo.getUser().getNickname() + "?????? ?????????????????????.");

            roomRepository.save(room);
            break;
          }
        }

        userMap.put(user.getId(), principal.getName());
        break;

      case START: // ??? ???
        boolean isNotReady = false;

        if (players.size() % 2 == 1) {
          message.setMessage("?????? ?????? ?????? ?????? ????????? ??? ????????????.");
          break;
        }

        for (AddUserDto player : players) {
          if (player.getReadyStatus() == ReadyStatus.NOT_READY) {
            message.setMessage("????????? READY ???????????? ????????? ??? ????????????.");
            isNotReady = true;
            break;
          }
        }

        if(isNotReady) break;

        message.setMessage("??? ????????? ???????????????.");

        RestTemplate restTemplate = new RestTemplate(); // ?????? ?????? ?????? ??????

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" +
          " AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36");

        String url = stageUrl + "/api";

        JSONObject jsonObject = new JSONObject();

        jsonObject.put("callback", selfUrl + "/game/result/save");
        jsonObject.put("secret", secretKey);

        JSONArray usersJsonArray = new JSONArray();

        for (AddUserDto player : players) {
          JSONObject userJsonObject = new JSONObject();

          userJsonObject.put("id", player.getId());
          userJsonObject.put("nickname", player.getNickname());
          userJsonObject.put("team", player.getTeamStatus().toString());

          usersJsonArray.add(userJsonObject);
        }

        jsonObject.put("users", usersJsonArray);
        HttpEntity<String> request = new HttpEntity<>(jsonObject.toString(), httpHeaders);

        ResponseEntity<StageRequestDto> response = restTemplate.postForEntity(url, request, StageRequestDto.class);

        for (StageDataDto stageDataDto : response.getBody().getUsers()) {
          message.setToken(stageDataDto.getToken());
          operations.convertAndSendToUser(userMap.get(stageDataDto.getId()), "/sub/room/" + messageDto.getRoomId(), message);
        }
        return;

      case CHANGE:
        userService.updateTeamStatus(messageDto.getNickname());
        message.setGameRoom(roomService.findRoom(room.getId()));
        break;

      case READY:
        userService.updateReadyStatus(messageDto.getNickname());
        message.setGameRoom(roomService.findRoom(room.getId()));
        break;
    }
    operations.convertAndSend("/sub/room/" + messageDto.getRoomId(), message);
  }
}
