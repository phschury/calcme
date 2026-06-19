const fs = require('fs');
const path = require('path');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

const keep = new Set([
  'package.json',
  'main.js',
  'preload.js',
  'index.html',
  'index.css',
  'render.js',
  'searchWorker.js',
  'manual.html',
  'nubase_4.mas20.txt',
  'periodic.data',
  'assets',
  'images',

  // root-level image assets
  'Mirror.png',
  'wnsc_logo.png',
  'icon.jpeg',
  'icon.png',
  'icon.ico',
  'icon.icns',

  // needed for Windows Squirrel startup handling
  'node_modules',
]);

const keepNodeModules = new Set([
  'electron-squirrel-startup',
]);

function cleanCopiedApp(buildPath) {
  for (const item of fs.readdirSync(buildPath)) {
    const fullPath = path.join(buildPath, item);

    if (!keep.has(item)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      continue;
    }

    if (item === 'node_modules') {
      for (const mod of fs.readdirSync(fullPath)) {
        if (!keepNodeModules.has(mod)) {
          fs.rmSync(path.join(fullPath, mod), { recursive: true, force: true });
        }
      }
    }
  }
}

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon',

    afterCopy: [
      (buildPath, electronVersion, platform, arch, callback) => {
        cleanCopiedApp(buildPath);
        callback();
      },
    ],
  },

  rebuildConfig: {},

  makers: [
    { name: '@electron-forge/maker-squirrel', config: {} },
    { name: '@electron-forge/maker-zip', platforms: ['darwin'] },
    { name: '@electron-forge/maker-dmg', config: {} },
    { name: '@electron-forge/maker-deb', config: {} },
    { name: '@electron-forge/maker-rpm', config: {} },
  ],

  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },

    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};