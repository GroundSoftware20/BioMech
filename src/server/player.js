const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.score = 0;
    this.mDirection = -10;
    this.shoot = false;
    this.reload = false;
    this.keyCooldown = Constants.PLAYER_INPUT_COOLDOWN;

    this.maxHealth = Constants.PLAYER_MAX_HP;
    this.tankSize = Constants.PLAYER_RADIUS;
    this.speed = Constants.PLAYER_SPEED;
    this.maxEnergy = Constants.PLAYER_ENERGY;
    this.energyRegen = Constants.PLAYER_ENERGY_REGEN;
    this.speedCost = Constants.PLAYER_SPEED_COST;
    this.firingCost = Constants.PLAYER_FIRE_COST;
    this.reloadCost = Constants.PLAYER_RELOAD_COST;
    this.bulletDamage = Constants.BULLET_DAMAGE;
    this.bulletSpeed = Constants.BULLET_SPEED;
    this.bulletSize = Constants.BULLET_RADIUS;
    this.firingTime = Constants.PLAYER_FIRE_COOLDOWN;
    this.clipSize = Constants.PLAYER_CLIP_SIZE;
    this.reloadTime = Constants.PLAYER_RELOAD_TIME;
    this.bulletRange = Constants.BULLET_RANGE;
    this.visionRange = Constants.PLAYER_VISION;
    this.healthRegen = Constants.PLAYER_HEALTH_REGEN;

    this.firingCooldown = this.firingTime;
    this.reloadProgress = this.reloadTime;
    this.energy = Constants.PLAYER_ENERGY;
    this.hp = Constants.PLAYER_MAX_HP;
    this.clip = this.clipSize;
  }

  // Returns a newly created bullet, or null.
  update(dt) {

      // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;
    
    this.hp = Math.min(this.maxHealth, this.hp + this.healthRegen);
    this.energy = Math.min(this.maxEnergy, this.energy + this.energyRegen);

    if(this.keyCooldown > 0 && this.mDirection != -10) {

      //this.keyCooldown -= dt;
      this.energy -= this.speedCost;
      this.x += dt * this.speed * Math.sin(this.mDirection);
      this.y -= dt * this.speed * Math.cos(this.mDirection);
    }

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    this.firingCooldown -= dt;
    // Fire a bullet, if needed
    if (this.firingCooldown <= 0 && this.shoot && this.energy >= this.firingCost && this.clip > 0) {
      

      this.firingCooldown = this.firingTime;
      this.energy -= this.firingCost;
      this.clip -= 1;
      this.reload = false;
      return new Bullet(this.id, this.x, this.y, this.direction, this.bulletSpeed, this.bulletSize, this.bulletDamage, this.bulletRange);
    }

    if((this.reload || this.clip == 0) && this.clip < this.clipSize) {

      this.reloadProgress -= dt;
      if(this.reloadProgress <= 0) {

        this.clip = this.clipSize;
        this.reloadProgress = this.reloadTime;
      }
    }

    else {

      this.reloadProgress = this.reloadTime;
    }

    return null;
  }

  setShoot(s) {
    this.shoot = s;
  }

  takeBulletDamage(d) {
    this.hp -= d;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  setMoveDirection(mDir) {
    this.mDirection = mDir;
    this.keyCooldown = Constants.PLAYER_INPUT_COOLDOWN;
  }
  changeStats(values) {
    
    this.maxHealth = values[0];
    this.hp = values[0]
    this.tankSize = values[1];
    this.speed = values[2];
    this.maxEnergy = values[3];
    this.energy = values[3];
    this.energyRegen = values[4];
    this.speedCost = values[5];
    this.firingCost = values[6];
    this.reloadCost = values[7];
    this.bulletDamage = values[8];
    this.bulletSpeed = values[9];
    this.bulletSize = values[10];
    this.firingTime = values[11];
    this.clipSize = values[12];
    this.reloadTime = values[13];
    this.bulletRange = values[14];
    this.visionRange = values[15];
    this.healthRegen = values[16];
  }

  reload(){

    if(this.clip < this.clipSize && !this.reload)
      this.reload = true;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      hp: this.hp,
      energy: this.energy,
      maxHealth: this.maxHealth,
      maxEnergy: this.maxEnergy,
      tankSize: this.tankSize,
      visionRange: this.visionRange,
      clip: this.clip,
    };
  }
}

module.exports = Player;
