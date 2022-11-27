package org.gamza.server.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.gamza.server.Enum.RoomStatus;
import org.gamza.server.Enum.RoomType;

import javax.persistence.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static javax.persistence.GenerationType.IDENTITY;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Table(name = "GameRooms")
public class GameRoom extends BaseTimeEntity {

  @Id
  @GeneratedValue(strategy = IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String roomName;

  @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  private Map<Integer, User> players;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RoomStatus roomStatus;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private RoomType roomType;

  @Column
  private int roomSize;

  @Column
  private String password;

  public void addPlayer(int idx, User user) {
    this.players.put(idx, user);
  }

  public void removePlayer(int idx) {
    this.players.remove(idx);
  }
}
