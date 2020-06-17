// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateMoveDir, updatePDirection, updateStats, reload} from './networking';
const Constants = require('../shared/constants');

var editMode = false;
var moveDir = 0
//up, down, left, right
var log = [false,false,false,false];
var elements = ["health", "tankSize", "tankSpeed", "energyCap", "energyRegen", "speedCost", "fireCost", "reloadCost", "bulletDam", "bulletSpeed", "bulletSize", "firingRate", "clipSize", "reloadRate", "bulletRange", "vision", "regen"];
//remember to change both html and javascript
var values = [100 * Constants.PLAYER_MAX_HP, 
              100 * Constants.PLAYER_RADIUS, 
              100 * Constants.PLAYER_SPEED, 
              100 * Constants.PLAYER_ENERGY,  
              100 * Constants.PLAYER_ENERGY_REGEN, 
              100 * Constants.PLAYER_SPEED_COST, 
              100 * Constants.PLAYER_FIRE_COST, 
              100 * Constants.PLAYER_RELOAD_COST,
              100 * Constants.BULLET_DAMAGE, 
              100 * Constants.BULLET_SPEED, 
              100 * Constants.BULLET_RADIUS, 
              100 * Constants.PLAYER_FIRE_COOLDOWN, 
              100 * Constants.PLAYER_CLIP_SIZE, 
              100 * Constants.PLAYER_RELOAD_TIME, 
              100 * Constants.BULLET_RANGE, 
              100 * Constants.PLAYER_VISION, 
              100 * Constants.PLAYER_HEALTH_REGEN];
var lastInputTime = Date.now();
function onKeyInput(e) {

  /*   left  += -1 
    *   right +=  1
    *   up    +=  3
    *   down  += -3
    *   0: no movement
    *   1: move right
    *   2: move up and left
    *   3: move up
    *   4: move up and right
    *  -1: move left
    *  -2: move down and right
    *  -3: move down
    *  -4: move down and left
    */
  //if((Date.now() - lastInputTime) / 1000 > Constants.PLAYER_INPUT_COOLDOWN)
  //  for(let i = 0; i < log.length; i++)
  //   log[i] = false;
    

  lastInputTime = Date.now();

  if(e.key == "w" || e.key == "W")
    log[0] = true;

  if(e.key == "s" || e.key == "S")
    log[1] = true;

  if(e.key == "a" || e.key == "A")
    log[2] = true;

  if(e.key == "d" || e.key == "D")
    log[3] = true;
  
  moveDir = 0;
  
  if(log[0] == true) {

    moveDir += 3;
  }

  if(log[1] == true) {

    moveDir -= 3;
  }

  if(log[2] == true) {

    moveDir += 1;
  }

  if(log[3] == true) {

    moveDir -= 1;
  }


  switch(moveDir) {
    case 1:
      updateMoveDir(-1 * Math.PI/2);
      break;
    case 2:
      updateMoveDir(Math.PI/4);
      break;
    case 3:
      updateMoveDir(0);
      break;
    case 4:
      updateMoveDir(-1 * Math.PI / 4);
      break;
    case -1:
      updateMoveDir(Math.PI / 2);
      break;
    case -2:
      updateMoveDir(-3 * Math.PI / 4);
      break;
    case -3:
      updateMoveDir(-1 * Math.PI);
      break;
    case -4:
      updateMoveDir(3 * Math.PI / 4);
      break;
    default:
      updateMoveDir(-10);
      break;
  }

}

function onKeyLift(e) {

  if(e.key == "Escape" || e.key == "Esc") {
    
    editMode = !editMode;

    if(document.getElementById('dev').classList.contains('hidden'))
      document.getElementById('dev').classList.remove('hidden');
    
    else document.getElementById('dev').classList.add('hidden');
  }

  if(e.key == "Enter") {

    for(let i = 0; i < values.length; i++) 
      if(i != 4 && i != 16 && (!Number.isInteger(values[i]) || values[i] < 0)) {

        document.getElementById("dev").style.backgroundColor = "brown";
        document.getElementById("dev").style.opacity = 0.5;
        console.log(i + " should not be " + values[i]);
        return;
      }
    if(values[12] < 100 || values[15] < 100) {

      document.getElementById("dev").style.backgroundColor = "brown";
      document.getElementById("dev").style.opacity = 0.5;
      return;
    }
    
    var to_send = [values[0] / 100, values[1] / 100, values[2] / 100, values[3] / 100, values[4] / 100,
    values[5] / 100, values[6] / 100, values[7] / 100, values[8] / 100, values[9]  / 100, values[10] / 100,
    values[11] / 100, values[12] / 100, values[13] / 100, values[14] / 100, values[15] / 100, values[16] / 100];

    updateStats(to_send);
    document.getElementById("dev").style.backgroundColor = "white";
    document.getElementById("dev").style.opacity = 0.5;
    return;
  }

  if(e.key == "r" || e.key == "R")
    reload();
  
  if(e.key == "f" || e.key == "F"){

    if((Date.now() - lastInputTime) / 1000 > Constants.PLAYER_INPUT_COOLDOWN)
      for(let i = 0; i < log.length; i++)
        log[i] = false;
    
    updateMoveDir(-10);
    return;
  }

  if((Date.now() - lastInputTime) /1000 <= Constants.PLAYER_INPUT_COOLDOWN) {
    if(e.key == "w" || e.key == "W") {

      log[0] = false;
      moveDir -= 3;
    }

    if(e.key == "s" || e.key == "S") {

      log[1] = false;
      moveDir += 3;
    }
    
    if(e.key == "a" || e.key == "A") {
    
      log[2] = false;
      moveDir -= 1;
    }
    
    if(e.key == "d" || e.key == "D") {
    
      log[3] = false;
      moveDir += 1;
    }
  }

  else {
     moveDir = -10;
  }

  switch(moveDir) {
    case 1:
      updateMoveDir(-1 * Math.PI/2);
      break;
    case 2:
      updateMoveDir(Math.PI/4);
      break;
    case 3:
      updateMoveDir(0);
      break;
    case 4:
      updateMoveDir(-1 * Math.PI / 4);
      break;
    case -1:
      updateMoveDir(Math.PI / 2);
      break;
    case -2:
      updateMoveDir(-3 * Math.PI / 4);
      break;
    case -3:
      updateMoveDir(-1 * Math.PI);
      break;
    case -4:
      updateMoveDir(3 * Math.PI / 4);
      break;
    default:
      updateMoveDir(-10);
      break;
  }
}

function onMouseInput(e) {
  
  handleInput(e.clientX, e.clientY, e.type);
}

function onPMouseInput(e) {
  
  handlePInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  
  handleInput(touch.clientX, touch.clientY, e.type);
}

function handlePInput(x, y) {
  
  if(editMode)
    return;
  
    const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updatePDirection(dir);
}

function handleInput(x, y, type) {

  if(editMode)
    return;
  
    const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir, type);
}
function addSliderFunc() {

  for(var i = 0; i < values.length; i++) {
    console.log(values[i]);
    document.getElementById(elements[i] + "R").value = values[i];
  }
  document.getElementById(elements[0] + "T").value = document.getElementById(elements[0] + "R").value;
  
  document.getElementById(elements[0] + "T").oninput = function() {

    document.getElementById(elements[0] + "R").value = this.value;
    values[0] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[0] + "R").oninput = function() {

    document.getElementById(elements[0] + "T").value = this.value;
    values[0] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  document.getElementById(elements[1] + "T").value = document.getElementById(elements[1] + "R").value;
  
  document.getElementById(elements[1] + "T").oninput = function() {

    document.getElementById(elements[1] + "R").value = this.value;
    values[1] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[1] + "R").oninput = function() {

    document.getElementById(elements[1] + "T").value = this.value;
    values[1] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  document.getElementById(elements[2] + "T").value = document.getElementById(elements[2] + "R").value;
  
  document.getElementById(elements[2] + "T").oninput = function() {

    document.getElementById(elements[2] + "R").value = this.value;
    values[2] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[2] + "R").oninput = function() {

    document.getElementById(elements[2] + "T").value = this.value;
    values[2] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  document.getElementById(elements[3] + "T").value = document.getElementById(elements[3] + "R").value;
  
  document.getElementById(elements[3] + "T").oninput = function() {

    document.getElementById(elements[3] + "R").value = this.value;
    values[3] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[3] + "R").oninput = function() {

    document.getElementById(elements[3] + "T").value = this.value;
    values[3] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
  document.getElementById(elements[4] + "T").value = document.getElementById(elements[4] + "R").value;
  
  document.getElementById(elements[4] + "T").oninput = function() {

    document.getElementById(elements[4] + "R").value = this.value;
    values[4] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[4] + "R").oninput = function() {

    document.getElementById(elements[4] + "T").value = this.value;
    values[4] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
 
  document.getElementById(elements[5] + "T").value = document.getElementById(elements[5] + "R").value;
  
  document.getElementById(elements[5] + "T").oninput = function() {

    document.getElementById(elements[5] + "R").value = this.value;
    values[5] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[5] + "R").oninput = function() {

    document.getElementById(elements[5] + "T").value = this.value;
    values[5] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
  document.getElementById(elements[6] + "T").value = document.getElementById(elements[6] + "R").value;
  
  document.getElementById(elements[6] + "T").oninput = function() {

    document.getElementById(elements[6] + "R").value = this.value;
    values[6] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[6] + "R").oninput = function() {

    document.getElementById(elements[6] + "T").value = this.value;
    values[6] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
    document.getElementById(elements[7] + "T").value = document.getElementById(elements[7] + "R").value;
  
  document.getElementById(elements[7] + "T").oninput = function() {

    document.getElementById(elements[7] + "R").value = this.value;
    values[7] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[7] + "R").oninput = function() {

    document.getElementById(elements[7] + "T").value = this.value;
    values[7] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
  document.getElementById(elements[8] + "T").value = document.getElementById(elements[8] + "R").value;
  
  document.getElementById(elements[8] + "T").oninput = function() {

    document.getElementById(elements[8] + "R").value = this.value;
    values[8] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[8] + "R").oninput = function() {

    document.getElementById(elements[8] + "T").value = this.value;
    values[8] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  document.getElementById(elements[9] + "T").value = document.getElementById(elements[9] + "R").value;
  
  document.getElementById(elements[9] + "T").oninput = function() {

    document.getElementById(elements[9] + "R").value = this.value;
    values[9] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[9] + "R").oninput = function() {

    document.getElementById(elements[9] + "T").value = this.value;
    values[9] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
  document.getElementById(elements[10] + "T").value = document.getElementById(elements[10] + "R").value;
  
  document.getElementById(elements[10] + "T").oninput = function() {

    document.getElementById(elements[10] + "R").value = this.value;
    values[10] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[10] + "R").oninput = function() {

    document.getElementById(elements[10] + "T").value = this.value;
    values[10] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  document.getElementById(elements[11] + "T").value = Math.floor(100 * document.getElementById(elements[11] + "T").value);
  document.getElementById(elements[11] + "T").value = document.getElementById(elements[11] + "R").value;
  
  document.getElementById(elements[11] + "T").oninput = function() {

    document.getElementById(elements[11] + "R").value = this.value;
    values[11] = parseInt(this.value);
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[11] + "R").oninput = function() {

    document.getElementById(elements[11] + "T").value = this.value;
    values[11] = parseInt(this.value);
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
  document.getElementById(elements[12] + "T").value = document.getElementById(elements[12] + "R").value;
  
  document.getElementById(elements[12] + "T").oninput = function() {

    document.getElementById(elements[12] + "R").value = this.value;
    values[12] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[12] + "R").oninput = function() {

    document.getElementById(elements[12] + "T").value = this.value;
    values[12] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
	}
  
  
  document.getElementById(elements[13] + "T").value = document.getElementById(elements[13] + "R").value;
  
  document.getElementById(elements[13] + "T").oninput = function() {

    document.getElementById(elements[13] + "R").value = this.value;
    values[13] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[13] + "R").oninput = function() {

    document.getElementById(elements[13] + "T").value = this.value;   
    values[13] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  

  document.getElementById(elements[14] + "T").value = Math.floor(100 * document.getElementById(elements[14] + "R").value);
  
  document.getElementById(elements[14] + "T").oninput = function() {

    document.getElementById(elements[14] + "R").value = this.value;
    values[14] = parseInt(this.value);
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[14] + "R").oninput = function() {

    document.getElementById(elements[14] + "T").value = this.value;
    values[14] = parseInt(this.value);
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }


  document.getElementById(elements[15] + "T").value = document.getElementById(elements[15] + "R").value;
  
  document.getElementById(elements[15] + "T").oninput = function() {

    document.getElementById(elements[15] + "R").value = this.value;
    values[15] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[15] + "R").oninput = function() {

    document.getElementById(elements[15] + "T").value = this.value;
    values[15] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  

  document.getElementById(elements[16] + "T").value = document.getElementById(elements[16] + "R").value;
  
  document.getElementById(elements[16] + "T").oninput = function() {

    document.getElementById(elements[16] + "R").value = this.value;
    values[16] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
  
  document.getElementById(elements[16] + "R").oninput = function() {

    document.getElementById(elements[16] + "T").value = this.value;
    values[16] = parseInt(this.value);    
    document.getElementById("dev").style.backgroundColor = "red";
    document.getElementById("dev").style.opacity = 0.5;
  }
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onPMouseInput);
  window.addEventListener('mouseup', onMouseInput);
  window.addEventListener('mousedown', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  document.addEventListener('keydown', onKeyInput);
  document.addEventListener('keyup', onKeyLift);
  addSliderFunc();
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onPMouseInput);
  window.removeEventListener('mousedown', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  document.removeEventListener('keydown', onKeyInput);
  document.addEventListener('keyup', onKeyLift);
}
