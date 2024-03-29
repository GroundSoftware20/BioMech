module.exports = Object.freeze({

  MHP: 0, 
  PR: 1,
  SPD: 2,
  NRG: 3,
  NRGR: 4, 
  SPDC: 5,
  FC: 6,
  RC: 7,
  BD: 8, 
  BS: 9,
  BR: 10,
  FC: 11,
  CS: 12, 
  RT: 13,
  R: 14,
  V: 15,
  HR: 16,

  PLAYER_MAX_HP: 100,
  PLAYER_RADIUS: 20,
  PLAYER_SPEED: 400,
  PLAYER_ENERGY: 100,
  PLAYER_ENERGY_REGEN: 1,
  PLAYER_SPEED_COST: 0.5,
  PLAYER_FIRE_COST: 50,
  PLAYER_RELOAD_COST: 50,
  BULLET_DAMAGE: 20,
  BULLET_SPEED: 800,
  BULLET_RADIUS: 3,
  PLAYER_FIRE_COOLDOWN: 0.1,
  PLAYER_CLIP_SIZE: 1,
  PLAYER_RELOAD_TIME: 0.25,
  BULLET_RANGE: 800,
  PLAYER_VISION: 1,
  PLAYER_HEALTH_REGEN: 0,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
    MOVE: 'move',
    POINT: 'point',
    STAT: 'stat',
    RELOAD: 'reload',
  },
});
