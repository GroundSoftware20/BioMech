const ASSET_NAMES = [
  'ship.png',
  'bullet.png',
  'backpanel.png',
  'hoverBase001.png',
  'hoverTurret001.png',
  //'Hovercraft_v1.0.1_P3D',
  //'Hovercraft_v1.0.2_allminusturret_P3D'
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];
