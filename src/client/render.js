import { downloadAssets } from './assets';
// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const back = document.getElementById('background');
const backContext = back.getContext('2d');
var pat;


setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
  back.width = scaleRatio * window.innerWidth;
  back.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {

  const { me, others, bullets } = getCurrentState();
  if (!me) {
    return;
  }
  const scaleRatio = Math.max(1, Math.sqrt(me.visionRange) * 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
  back.width = scaleRatio * window.innerWidth;
  back.height = scaleRatio * window.innerHeight;


  // Draw background
  renderBackgroundA(me.x, me.y);
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

  updateHUD(me.clip)

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));
}

function updateHUD(clip) {

  document.getElementById("hud").innerHTML = clip;
}

function renderBackground(x, y) {

  createImageBitmap(getAsset('backpanel.png')).then(function(result) {

    pat  = backContext.createPattern(result, "repeat");
  }).catch(console.error);

  renderBackgroundA(x,y);

}

function renderBackgroundA(x, y) {

  const backgroundX = -x - back.width / 2;
  const backgroundY = -y - back.height / 2;

  backContext.fillStyle = pat;
  backContext.translate(backgroundX, backgroundY);

  backContext.fillRect(-backgroundX, -backgroundY, canvas.width, canvas.height);

  backContext.translate(-backgroundX, -backgroundY);

}


// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  
  const { x, y, direction} = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  var pic = "ship.png";
  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);

  if(player.mode == 0) {
    
    context.rotate(direction);
    pic = "ship.png"
  }

  else if(player.mode == 1 || player.mode == 2){

    context.rotate(player.mDirection);
  }
  
  context.drawImage(
    getAsset(pic),
    -player.tankSize,
    -player.tankSize,
    player.tankSize * 2,
    player.tankSize * 2,
  );
  context.restore();

  // Draw health bar
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - player.tankSize,
    canvasY + player.tankSize + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'black';
  context.fillRect(
    canvasX - player.tankSize + player.tankSize * 2 * player.hp / player.maxHealth,
    canvasY + player.tankSize + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / player.maxHealth),
    2,
  );

  // Draw energy bar
  context.fillStyle = 'blue';
  context.fillRect(
    canvasX - player.tankSize,
    canvasY + player.tankSize + 12,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - player.tankSize + player.tankSize * 2 * player.energy / player.maxEnergy,
    canvasY + player.tankSize + 12,
    PLAYER_RADIUS * 2 * (1 - player.energy / player.maxEnergy),
    2,
  );
  if(player != me && !document.getElementById("hideNames").checked) {
    context.fillStyle = "steelblue";
    context.font = "30px Ariel";
    context.fillText(player.username, canvasX - context.measureText(player.username).width / 2, 
                    canvasY + player.tankSize + 36);
  }
    
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.png'),
    canvas.width / 2 + x - me.x - bullet.size,
    canvas.height / 2 + y - me.y - bullet.size,
    bullet.size * 2,
    bullet.size * 2,
  );
}

function renderMainMenu() {
  downloadAssets().then(() =>{
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
  }).catch(console.error);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {

  clearInterval(renderInterval);
  
  renderInterval = setInterval(render, 1000 / 240);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {

  context.clearRect(0, 0, canvas.width, canvas.height);
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}
