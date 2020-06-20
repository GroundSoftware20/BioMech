// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#4-client-networking
import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = throttle(20, (eType) => {
  socket.emit(Constants.MSG_TYPES.INPUT, eType);
});

export const updateMoveDir = throttle(20, mDir => {
  socket.emit(Constants.MSG_TYPES.MOVE, mDir);
});

export const updatePDirection = throttle(20, dir => {
  socket.emit(Constants.MSG_TYPES.POINT, dir);
});

export const updateStats = throttle(20, stats => {
  socket.emit(Constants.MSG_TYPES.STAT, stats);
});

export const reload = throttle(20, () => {
  socket.emit(Constants.MSG_TYPES.RELOAD);
});