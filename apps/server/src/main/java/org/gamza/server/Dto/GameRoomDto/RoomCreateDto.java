package org.gamza.server.Dto.GameRoomDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomCreateDto {
  private String roomName;
  private String password;
  private int roomSize;
}
