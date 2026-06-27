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
  'fonts',

  'Mirror.png',
  'wnsc_logo.png',
  'icon.jpeg',
  'icon.png',
  'icon.ico',
  'icon.icns',

  'node_modules',
]);

const keepNodeModules = new Set([
  'electron-squirrel-startup',
  '@fontsource',
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
    osxSign: process.env.CSC_NAME
      ? {
          identity: process.env.CSC_NAME
        }
      : undefined,

    osxNotarize: process.env.NOTARY_KEYCHAIN_PROFILE
      ? {
          tool: "notarytool",
          keychainProfile: process.env.NOTARY_KEYCHAIN_PROFILE
        }
      : undefined,

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
/*
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {},
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'calcme',
        icon: './assets/icon.icns',
        overwrite: true
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
  ],
*/
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {},
    },

    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        name: 'calcme',
        icon: './assets/icon.icns',
        overwrite: true
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },

    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: {
        options: {
          name: 'calcme',
          productName: 'UFO Finder',
          genericName: 'MRTOF mass calculator',
          maintainer: 'P. Schury',
          homepage: 'https://github.com/phschury/calcme',
          icon: './assets/icon.png',
          categories: ['Science', 'Education'],
        },
      },
    },

    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: {
        options: {
          name: 'calcme',
          productName: 'UFO Finder',
          genericName: 'MRTOF mass calculator',
          maintainer: 'P. Schury',
          homepage: 'https://github.com/phschury/calcme',
          icon: './assets/icon.png',
          categories: ['Science', 'Education'],
        },
      },
    },

    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
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