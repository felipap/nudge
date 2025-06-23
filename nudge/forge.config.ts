import 'dotenv/config'

import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerZIP } from '@electron-forge/maker-zip'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'

const IS_GITHUB_ACTIONS = process.env.GITHUB_ACTIONS === 'true'

const packagerConfig: ForgeConfig['packagerConfig'] = {
  appBundleId:
    'engineering.pi.nudge' +
    (process.env.NODE_ENV === 'production' ? '' : '-dev'),
  asar: true,
  icon: IS_GITHUB_ACTIONS
    ? 'images/Production.icns'
    : 'images/Development.icns',
  extraResource: ['images'],
  // Code signing configuration
  osxSign: {
    identity: process.env.CSC_IDENTITY || process.env.APPLE_IDENTITY,
  },
}

if (IS_GITHUB_ACTIONS) {
  console.log('process.env.APPLE_TEAM_ID', process.env.APPLE_TEAM_ID)

  if (!process.env.APPLE_ID) {
    throw new Error('APPLE_ID is not set')
  }
  if (!process.env.APPLE_ID_PASSWORD) {
    throw new Error('APPLE_ID_PASSWORD is not set')
  }
  if (!process.env.APPLE_TEAM_ID) {
    throw new Error('APPLE_TEAM_ID is not set')
  }

  packagerConfig.osxNotarize = {
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  }
}

const config: ForgeConfig = {
  packagerConfig,
  rebuildConfig: {},
  makers: [
    // new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    IS_GITHUB_ACTIONS ? new MakerDMG({}, ['darwin']) : null,
    // new MakerRpm({}),
    // new MakerDeb({}),
  ].filter(Boolean),
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process,
      // Preload scripts, Worker process, etc. If you are familiar with Vite
      // configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'windows/shared/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.mainWindow.config.ts',
        },
        {
          name: 'pref_window',
          config: 'vite.prefWindow.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application

    // https://github.com/electron/forge/issues/3896 – this is preventing Notifications from showing :/
    // new FusesPlugin({
    //   version: FuseVersion.V1,
    //   [FuseV1Options.RunAsNode]: false,
    //   [FuseV1Options.EnableCookieEncryption]: true,
    //   [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    //   [FuseV1Options.EnableNodeCliInspectArguments]: false,
    //   [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    //   [FuseV1Options.OnlyLoadAppFromAsar]: true,
    // }),
  ],
}

export default config
