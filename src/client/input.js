// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateMoveDir, updatePDirection, updateStats, reload } from './networking';
const Constants = require('../shared/constants');

var modeChange = false;
//up, down, left, right
var log = [["w", "s", "a", "d"], [false, false, false, false]];
var elements = ["health", "tankSize", "tankSpeed", "energyCap", "energyRegen", "speedCost", "fireCost", "reloadCost", "bulletDam", "bulletSpeed", "bulletSize", "firingRate", "clipSize", "reloadRate", "bulletRange", "vision", "regen", "turnRate", "firingArc", "mode", "sideFan", "backFan", "sideFanCost", "backFanCost"];
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
Constants.PLAYER_HEALTH_REGEN,
Constants.PLAYER_TURN_RATE,
Constants.PLAYER_FIRE_ARC,
Constants.PLAYER_MODE,
Constants.PLAYER_SIDE_FAN,
Constants.PLAYER_BACK_FAN,
Constants.PLAYER_SIDE_FAN_COST,
Constants.PLAYER_BACK_FAN_COST];

function standardMovement() {

  let moveDir = 0;

  if (log[1][0] == true) {

    moveDir += 3;
  }

  if (log[1][1] == true) {

    moveDir -= 3;
  }

  if (log[1][2] == true) {

    moveDir += 1;
  }

  if (log[1][3] == true) {

    moveDir -= 1;
  }


  switch (moveDir) {
    case 1:
      updateMoveDir(-Math.PI / 2);
      break;
    case 2:
      updateMoveDir(Math.PI / 4);
      break;
    case 3:
      updateMoveDir(0);
      break;
    case 4:
      updateMoveDir(-Math.PI / 4);
      break;
    case -1:
      updateMoveDir(Math.PI / 2);
      break;
    case -2:
      updateMoveDir(-3 * Math.PI / 4);
      break;
    case -3:
      updateMoveDir(Math.PI);
      break;
    case -4:
      updateMoveDir(3 * Math.PI / 4);
      break;
    default:
      updateMoveDir(-10);
      break;
  }
}

function hoverMovement() {

  let moveDir = 0;

  if (log[1][1] == true) {

    moveDir += 4;
  }

  if (log[1][2] == true) {

    moveDir += 1;
  }

  if (log[1][3] == true) {

    moveDir += 2;
  }

  if (log[1][0] == true) {

    if(moveDir == 1) {

      moveDir = 5;
    }

    else if(moveDir == 2) {

      moveDir = 6;
    }
    
    else if(moveDir == 3) {

      moveDir = 8;
    }
    else {

      moveDir = 7;
    }
  }
  console.log("Here!");
  updateMoveDir(10 * (moveDir + 1))

}

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
  for (let i = 0; i < log[0].length; i++) {

    if (e.key == log[0][i] || (log[0][i].match(/^[a-z]$/) && e.key == log[0][i].toUpperCase())) {

      console.log("here");
      log[1][i] = true;
    }
  }
  console.log(log[1]);
  if (values[Constants.M] == 0) {

    standardMovement();
  }

  else if (values[Constants.M] == 1) {

    hoverMovement();
  }

}

function onKeyLift(e) {

  if ((e.key == "Escape" || e.key == "Esc")) {

    if (!document.getElementById('dev').classList.contains('hidden')) {

      document.getElementById('dev').classList.add('hidden');
    }

    else if(document.getElementById('sett').classList.contains('hidden')) {

      document.getElementById('sett').classList.remove('hidden');
    }

    else document.getElementById('sett').classList.add('hidden');
  }

  else if (e.key == "Enter") {

    sendStats();
    return;
  }

  else if (e.key == "r" || e.key == "R") {

    reload();
  }

  else if (e.key == "L" && e.ctrlKey && document.getElementById('sett').classList.contains("hidden")) {

    if (document.getElementById('dev').classList.contains('hidden')) {

      document.getElementById('dev').classList.remove('hidden');
    }

    else document.getElementById('dev').classList.add('hidden');
  }

  else {

    for (let i = 0; i < log[0].length; i++)
      if (e.key == log[0][i] || (log[0][i].match(/^[a-z]$/) && e.key == log[0][i].toUpperCase())) {
        log[1][i] = false;

        if (values[Constants.M] == 0) {

          standardMovement();
        }

        else if (values[Constants.M] == 1) {

          hoverMovement();
        }
      }
  }
}
function sendStats() {

  console.log(values);
  for (let i = 0; i < values.length; i++) {

    if (i != Constants.NRGR && i != Constants.HR && (!(Number(values[i]) === values[i]) || values[i] < 0)) {

      document.getElementById("dev").style.backgroundColor = "brown";
      document.getElementById("dev").style.opacity = 0.5;
      console.log(i + " should not be " + values[i]);
      return;
    }
  }

  if (values[Constants.CS] < 1 || values[Constants.V] < 1 || values[Constants.CS] % 1 != 0 || values[Constants.V] % 1 != 0) {

    document.getElementById("dev").style.backgroundColor = "brown";
    document.getElementById("dev").style.opacity = 0.5;
    return;
  }
  if (modeChange) {

    if (values[Constants.M] == 0) {

      values[Constants.TR] = 1
      document.getElementById(elements[Constants.TR] + "R").value = 1
      document.getElementById(elements[Constants.TR] + "T").value = 1
    }

    else if (values[Constants.M] == 1) {

      values[Constants.TR] = 0.015;
      document.getElementById(elements[Constants.TR] + "R").value = 0.015;
      document.getElementById(elements[Constants.TR] + "T").value = 0.015;
    }

    else if (values[Constants.M] == 2) {

      values[Constants.TR] = 0.015;
      document.getElementById(elements[Constants.TR] + "R").value = 0.015;
      document.getElementById(elements[Constants.TR] + "T").value = 0.015;
    }
  }

  updateStats(values);

  document.getElementById("dev").style.backgroundColor = "white";
  document.getElementById("dev").style.opacity = 0.5;
}

function onMouseInput(e) {

  if (!document.getElementById("dev").classList.contains("hidden")
    && e.clientX < document.getElementById("dev").offsetWidth
    && e.clientY < document.getElementById("dev").offsetHeight && e.type != "mouseup") {

    return;
  }

  else if (!document.getElementById("sett").classList.contains("hidden") 
    && e.clientX < document.getElementById("sett").offsetWidth
    && e.clientY < document.getElementById("sett").offsetHeight && e.type != "mouseup") {
  
    return;
  }
  
  else {
  
    updateDirection(Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY), e.type);
  }
}

function onPMouseInput(e) {

  if (!document.getElementById("dev").classList.contains("hidden")
    && e.clientX < document.getElementById("dev").offsetWidth
    && e.clientY < document.getElementById("dev").offsetHeight && e.type != "mouseup") {

    return;
  }

  else if (!document.getElementById("sett").classList.contains("hidden") 
    && e.clientX < document.getElementById("sett").offsetWidth
    && e.clientY < document.getElementById("sett").offsetHeight && e.type != "mouseup") {
  
    return;
  }
  
  else {
  
    updatePDirection(Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY), e.type);
  }
}

function onTouchInput(e) {

  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY, e.type);
}

function addSliderFunc() {

  var iList = [];
  values[Constants.HR] = 0;
  sendStats();

  for (var i = 0; i < values.length; i++) {

    iList.push(i);
  }

  iList.forEach(i => {

    document.getElementById(elements[i] + "R").value = values[i];
    document.getElementById(elements[i] + "T").value = values[i];

    document.getElementById(elements[i] + "R").addEventListener('input', devInput);
    document.getElementById(elements[i] + "T").addEventListener('input', devInput);
  });

}

function removeSliderFunc() {

  var iList = [];

  for (var i = 0; i < values.length; i++) {

    iList.push(i);
  }

  iList.forEach(i => {

    document.getElementById(elements[i] + "R").removeEventListener('input', devInput);
    document.getElementById(elements[i] + "T").removeEventListener('input', devInput);
  });

}


function devInput(e) {

  var id = e.currentTarget.id.substring(0, e.currentTarget.id.length - 1);
  var end = e.currentTarget.id.substring(e.currentTarget.id.length - 1);

  if (id == elements[Constants.M]) {

    modeChange = true;
  }

  if (end == "R") {

    end = "T";
  }

  else if (end == "T") {

    end = "R";
  }

  else {

    console.log("We have a problem");
    return;
  }

  document.getElementById(id + end).value = this.value;
  values[elements.indexOf(id)] = parseFloat(this.value);
  document.getElementById("dev").style.backgroundColor = "red";
  document.getElementById("dev").style.opacity = 0.5;
}

function addSettFunc() {

  document.getElementById("invertHoverH").addEventListener('click', invertHover);
}

function removeSettFunc() {

  document.getElementById("invertHoverH").removeEventListener('click', invertHover);
}

function invertHover(e) {

  if(document.getElementById("invertHoverH").checked) {

    log[0][2] = "d";
    log[0][3] = "a";
  }

  else {

    log[0][2] = "a";
    log[0][3] = "d";    
  }
}

function onClickOff(e) {

  for (var i = 0; i < log[1].length; i++) {

    log[1][i] = false;
  }

  updateMoveDir(-10);
}

function onContext(e) {

  e.preventDefault();
}

export function startCapturingInput() {

  window.addEventListener('mousemove', onPMouseInput);
  window.addEventListener('mouseup', onMouseInput);
  window.addEventListener('mousedown', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  document.addEventListener('keydown', onKeyInput);
  document.addEventListener('keyup', onKeyLift);
  window.addEventListener('blur', onClickOff);
  window.addEventListener('contextmenu', onContext, false);
  addSliderFunc();
  addSettFunc();
}

export function stopCapturingInput() {

  for (var i = 0; i < log[1].length; i++) {

    log[1][i] = false;
  }

  window.removeEventListener('mousemove', onPMouseInput);
  window.removeEventListener('mouseup', onMouseInput);
  window.removeEventListener('mousedown', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  document.removeEventListener('keydown', onKeyInput);
  document.removeEventListener('keyup', onKeyLift);
  window.removeEventListener('blur', onClickOff);
  window.removeEventListener('contextmenu', onContext, false);
  window.removeEventListener('contextmenu', onContext, false);
  removeSliderFunc();
  removeSettFunc();
}
