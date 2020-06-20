// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateMoveDir, updatePDirection, updateStats, reload} from './networking';
const Constants = require('../shared/constants');

var editMode = false;
//up, down, left, right
var log = [false,false,false,false];
var elements = ["health", "tankSize", "tankSpeed", "energyCap", "energyRegen", "speedCost", "fireCost", "reloadCost", "bulletDam", "bulletSpeed", "bulletSize", "firingRate", "clipSize", "reloadRate", "bulletRange", "vision", "regen"];
//remember to change both html and javascript
var values = [Constants.PLAYER_MAX_HP, 
              Constants.PLAYER_RADIUS, 
              Constants.PLAYER_SPEED, 
              Constants.PLAYER_ENERGY,  
              Constants.PLAYER_ENERGY_REGEN, 
              Constants.PLAYER_SPEED_COST, 
              Constants.PLAYER_FIRE_COST, 
              Constants.PLAYER_RELOAD_COST,
              Constants.BULLET_DAMAGE, 
              Constants.BULLET_SPEED, 
              Constants.BULLET_RADIUS, 
              Constants.PLAYER_FIRE_COOLDOWN, 
              Constants.PLAYER_CLIP_SIZE, 
              Constants.PLAYER_RELOAD_TIME, 
              Constants.BULLET_RANGE, 
              Constants.PLAYER_VISION, 
              Constants.PLAYER_HEALTH_REGEN];

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
     
  if(e.key == "w" || e.key == "W")
    log[0] = true;

  if(e.key == "s" || e.key == "S")
    log[1] = true;

  if(e.key == "a" || e.key == "A")
    log[2] = true;

  if(e.key == "d" || e.key == "D")
    log[3] = true;
  
  let moveDir = 0;
  
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

  else if(e.key == "Enter") {
    console.log(values);
    for(let i = 0; i < values.length; i++) 
      if(i != Constants.NRGR && i != Constants.HR && (!(Number(values[i]) === values[i]) || values[i] < 0)) {

        document.getElementById("dev").style.backgroundColor = "brown";
        document.getElementById("dev").style.opacity = 0.5;
        console.log(i + " should not be " + values[i]);
        return;
      }
    if(values[Constants.CS] < 1 || values[Constants.V] < 1 || values[Constants.CS] % 1 != 0 || values[Constants.V] % 1 != 0) {

      document.getElementById("dev").style.backgroundColor = "brown";
      document.getElementById("dev").style.opacity = 0.5;
      return;
    }

    updateStats(values);
    document.getElementById("dev").style.backgroundColor = "white";
    document.getElementById("dev").style.opacity = 0.5;
    return;
  }

  else if(e.key == "r" || e.key == "R")
    reload();
  
  else if(e.key == "f" || e.key == "F"){
      for(let i = 0; i < log.length; i++)
        log[i] = false;
    
      updateMoveDir(-10);
      return;
  }
  else {

    let moveDir = 0;

    if(e.key == "w" || e.key == "W") {

      log[0] = false;
    }
    if(e.key == "s" || e.key == "S") {

      log[1] = false;
    }
    
    if(e.key == "a" || e.key == "A") {

      log[2] = false;
    }
    
    if(e.key == "d" || e.key == "D") {
    
      log[3] = false;
    }

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
}

function onMouseInput(e) {
  
  if(editMode && e.clientX < document.getElementById("dev").offsetWidth 
    && e.clientY < document.getElementById("dev").offsetHeight)
    return;

    updateDirection(e.type);
}

function onPMouseInput(e) {
  
  handlePInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  
  handleInput(touch.clientX, touch.clientY, e.type);
}

function handlePInput(x, y) {
  
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updatePDirection(dir);
}

function addSliderFunc() {
  
  var iList = [];

  for(var i = 0; i < values.length; i++)
    iList.push(i);

  iList.forEach(i => {
    
    document.getElementById(elements[i] + "R").value = values[i];
    document.getElementById(elements[i] + "T").value = values[i];
  
    document.getElementById(elements[i] + "T").oninput = function() {
  
      document.getElementById(elements[i] + "R").value = Math.floor(this.value);
      values[i] = parseFloat(this.value);
      document.getElementById("dev").style.backgroundColor = "red";
      document.getElementById("dev").style.opacity = 0.5;
    }
  
    document.getElementById(elements[i] + "R").oninput = function() {
  
      document.getElementById(elements[i] + "T").value = this.value;
      values[i] = parseFloat(this.value);
      document.getElementById("dev").style.backgroundColor = "red";
      document.getElementById("dev").style.opacity = 0.5;
    }
  });

}

function onClickOff(e) {

  for(var i = 0; i < log.length; i++)
    log[i] = false;
  
  updateMoveDir(-10);
}

function onContext(e) {

    e.preventDefault(); 
}

export function startCapturingInput() {
  editMode = false;
  window.addEventListener('mousemove', onPMouseInput);
  window.addEventListener('mouseup', onMouseInput);
  window.addEventListener('mousedown', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  document.addEventListener('keydown', onKeyInput);
  document.addEventListener('keyup', onKeyLift);
  window.addEventListener('blur', onClickOff);
  window.addEventListener('contextmenu', onContext ,false);
  addSliderFunc();
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onPMouseInput);
  window.removeEventListener('mouseup', onMouseInput);
  window.removeEventListener('mousedown', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  document.removeEventListener('keydown', onKeyInput);
  document.removeEventListener('keyup', onKeyLift);
  window.removeEventListener('blur', onClickOff);
  window.removeEventListener('contextmenu', onContext ,false);
  window.removeEventListener('contextmenu', onContext ,false);
}
