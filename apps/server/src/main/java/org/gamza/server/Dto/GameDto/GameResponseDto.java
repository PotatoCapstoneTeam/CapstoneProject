package org.gamza.server.Dto.GameDto;

import lombok.Getter;
import org.gamza.server.Entity.RecordResult;

@Getter
public class GameResponseDto {
  private Long roomId;
  private int kill;
  private int death;
  private Long userId;

  public GameResponseDto(RecordResult recordResult) {
    this.roomId = recordResult.getGameRoom().getId();
    this.kill = recordResult.getKillPoint();
    this.death = recordResult.getDeathPoint();
    this.userId = recordResult.getUser().getId();
  }
}
