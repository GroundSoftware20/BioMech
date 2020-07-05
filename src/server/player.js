const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const { pick } = require('lodash');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.score = 0;
    this.mDirection = 0;
    this.pmDirection = -10;
    this.dpDirection = this.direction;
    this.shoot = false;
    this.reload = false;

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
    this.turnRate = Constants.PLAYER_TURN_RATE;
    this.firingArc = Constants.PLAYER_FIRE_ARC;
    this.mode = Constants.PLAYER_MODE;
    this.sideFan = Constants.PLAYER_SIDE_FAN;
    this.backFan = Constants.PLAYER_BACK_FAN;
    this.sideFanCost = Constants.PLAYER_SIDE_FAN_COST;
    this.backFanCost = Constants.PLAYER_BACK_FAN_COST;

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
    
    if(this.mode == 0) {
      
      this.standardMovement(dt);
    }

    else if(this.mode == 1 || this.mode == 2 || this.mode == 3){

      this.hoverMovement(dt);
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

  standardMovement(dt) {    
    
    if(this.pmDirection != this.mDirection && this.pmDirection != -10) {


      var diff = this.pmDirection - this.mDirection;
      
      if(diff > Math.PI) {

        diff = -2 * Math.PI + diff;
      }
      
      else if(diff <= -Math.PI) {

        diff = 2 * Math.PI + diff;
      }


      if(Math.abs(diff) < Math.PI * this.turnRate) {

        this.mDirection = this.pmDirection;
      }

      else if(diff > 0){

        this.mDirection += Math.PI * this.turnRate;

        if(this.mDirection > Math.PI) {

          diff = -2 * Math.PI + this.mDirection;
        }
      }

      else {

        this.mDirection -= Math.PI * this.turnRate;

        if(this.mDirection <= -Math.PI) {

          this.mDirection = 2 * Math.PI + this.mDirection;
        }
      }

    }

    if(this.pmDirection != -10) {

      this.setDirection(this.dpDirection)
      this.energy -= this.speedCost;
      this.x += dt * this.speed * Math.sin(this.mDirection);
      this.y -= dt * this.speed * Math.cos(this.mDirection);
    }
  }

  hoverMovement(dt) {

    var moveCost = 0;
    
    if(this.mode == 1) {
      switch(this.pmDirection) {
        //up-111
        case 0:
          this.hoverSpeed = 2 * this.sideFan + this.backFan;
          moveCost = this.backFanCost + 2 * this.sideFanCost;
          break;
        //down-010
        case Math.PI:
          this.hoverSpeed = this.backFan;
          moveCost = this.backFanCost;
          break;
        //left-100
        case -Math.PI / 2:
          this.hoverSpeed = this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost;
          break;
        //right-001
        case Math.PI / 2:
          this.hoverSpeed = this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost;
          break;
        //downleft-110
        case -3 * Math.PI / 4:
        //upleft-110
        case -Math.PI / 4:
          this.hoverSpeed = this.backFan + this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;
          break;
        //downright-011
        case 3 * Math.PI / 4:
        //upright-011
        case Math.PI / 4:
          this.hoverSpeed = this.backFan + this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;
          break;
        case -10:
        default:
          return;
      }
    }

    else if(this.mode == 2) {
      switch(this.pmDirection) {
        //up-111
        case 0:
          this.hoverSpeed = 2 * this.sideFan + this.backFan;
          moveCost = this.backFanCost + 2 * this.sideFanCost;
          break;
        //down-999
        case Math.PI:
          this.hoverSpeed = -2 * this.sideFan - this.backFan;
          moveCost = this.backFanCost + 2 * this.sideFanCost;
          break;
        //left-900
        case -Math.PI / 2:
          this.hoverSpeed = -this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost;
          break;
        //right-009
        case Math.PI / 2:
          this.hoverSpeed = -this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost;
          break;
        //upleft-910
        case -Math.PI / 4:
          this.hoverSpeed = this.backFan - this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;
          break;
        //upright-019
        case Math.PI / 4:
          this.hoverSpeed = this.backFan - this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;
          break;
        //downleft-110
        case -3 * Math.PI / 4:
          this.hoverSpeed = -this.backFan + this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;          
          break;
        //downright-011
        case 3 * Math.PI / 4:
          this.hoverSpeed = -this.backFan + this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;          
          break;
        case -10:
        default:
          return;
      }

    } 

    else if(this.mode == 3) {

      switch(this.pmDirection) {
        //up-111
        case 0:
          this.hoverSpeed = 2 * this.sideFan + this.backFan;
          moveCost = this.backFanCost + 2 * this.sideFanCost;
          break;
        //down-999
        case Math.PI:
          this.hoverSpeed = -2 * this.sideFan - this.backFan;
          moveCost = this.backFanCost + 2 * this.sideFanCost;
          break;
        //left-901
        case -Math.PI / 2:
          this.hoverSpeed = this.sideFan;
          this.mDirection -= 2 * Math.PI * this.turnRate;
          moveCost = this.sideFanCost;
          break;
        //right-109
        case Math.PI / 2:
          this.hoverSpeed = this.sideFan;
          this.mDirection += 2 * Math.PI * this.turnRate;
          moveCost = this.sideFanCost;
          break;
        //upleft-110
        case -Math.PI / 4:
          this.hoverSpeed = this.backFan + this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;
          break;
        //upright-011
        case Math.PI / 4:
          this.hoverSpeed = this.backFan + this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;
          break;
        //downleft-990
        case -3 * Math.PI / 4:
          this.hoverSpeed = -this.backFan - this.sideFan;
          this.mDirection += Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;          
          break;
        //downright-099
        case 3 * Math.PI / 4:
          this.hoverSpeed = -this.backFan - this.sideFan;
          this.mDirection -= Math.PI * this.turnRate;
          moveCost = this.sideFanCost + this.backFanCost;          
          break;
        case -10:
        default:
          return;
      }
    }

    else console.log("hover problem");
    
    if(this.mDirection > Math.PI) {

      this.mDirection -= 2 * Math.PI;
    }

    else if(this.mDirection <= -Math.PI) {

      this.mDirection += 2 * Math.PI;
    }

    this.setDirection(this.dpDirection);

    this.energy -= moveCost;
    this.x += dt * this.hoverSpeed * Math.sin(this.mDirection);
    this.y -= dt * this.hoverSpeed * Math.cos(this.mDirection);
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

  setDirection(dir) {

    this.dpDirection = dir;
    var diff = dir - this.mDirection;

    if(diff > Math.PI) {

      diff -= 2 * Math.PI;
    }

    if(diff <= -Math.PI) {

      diff += 2 * Math.PI;
    }


    if(Math.abs(diff) < this.firingArc * Math.PI) {
    
      this.direction = dir;
    }

    else if(diff < 0) {
      
      this.direction = this.mDirection - this.firingArc * Math.PI;

      if(this.direction <= -Math.PI) {

        this.direction += 2 * Math.PI;
      }
    }

    else {
      
      this.direction = this.mDirection + this.firingArc * Math.PI;

      if(this.direction > Math.PI) {

        this.direction -= 2 * Math.PI;
      }
    }
  }

  setMoveDirection(mDir) {

    this.pmDirection = mDir;
  }

  changeStats(values) {
    
    if(this.hp == this.maxHealth) {

      this.maxHealth = values[0];
      this.hp = values[0]
    }

    if(this.energy == this.maxEnergy) {

      this.maxEnergy = values[3];
      this.energy = values[3];
    }

    this.maxHealth = values[0];
    this.tankSize = values[1];
    this.speed = values[2];
    this.maxEnergy = values[3];
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
    this.turnRate = values[17];
    this.firingArc = values[18];
    this.mode = values[19];
    this.sideFan = values[20];
    this.backFan = values[21];
    this.sideFanCost = values[22];
    this.backFanCost = values[23];
  }

  reload(){

    this.reload = this.clip < this.clipSize || this.reload;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      mDirection: this.mDirection,
      hp: this.hp,
      energy: this.energy,
      maxHealth: this.maxHealth,
      maxEnergy: this.maxEnergy,
      tankSize: this.tankSize,
      visionRange: this.visionRange,
      clip: this.clip,
      username: this.username,
      mode: this.mode,
    };
  }
}

module.exports = Player;
