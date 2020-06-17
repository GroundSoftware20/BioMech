const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir, speed, siz, damag, rang) {
    super(shortid(), x, y, dir, speed);
    this.parentID = parentID;
    this.startX = x;
    this.startY = y;
    this.size = siz;
    this.damage = damag;
    this.range = rang;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {

    super.update(dt);
    return Math.pow(this.range, 2) < Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2) || 
           this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
    size: this.size,
    };
  }
}

module.exports = Bullet;
