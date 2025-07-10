import 'dotenv/config'

import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerZIP } from '@electron-forge/maker-zip'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'
import path from 'path'

const IS_RELEASE = !!process.env.IS_RELEASE
const IS_DEV = !!process.env.IS_DEV

// Only way I found to detect if we're running `electron-forge make`
const IS_MAKE = !!process.env.IS_MAKE

const packagerConfig: ForgeConfig['packagerConfig'] = {
  name: 'Nudge' + (IS_DEV ? '(dev)' : ''),
  appBundleId: 'engineering.pi.nudge' + (IS_DEV ? '-dev' : ''),
  asar: true,
  icon:
    IS_RELEASE || IS_MAKE
      ? 'images/Production.icns'
      : 'images/Development.icns',
  extraResource: ['images'],
  // Code signing configuration
  osxSign: {
    identity: process.env.CSC_IDENTITY || process.env.APPLE_IDENTITY,
  },
}

if (IS_RELEASE) {
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

type Falsy = false | 0 | '' | null | undefined
export const isTruthy = <T>(x: T | Falsy): x is T => !!x

const config: ForgeConfig = {
  packagerConfig,
  rebuildConfig: {},
  makers: [
    // new MakerSquirrel({}),
    new MakerZIP({}, ['darwin']),
    IS_RELEASE
      ? new MakerDMG(
          (arch) => ({
            // https://github.com/electron/forge/issues/3517#issuecomment-2480861387
            name: `Nudge Installer (${arch})`,
            icon: path.join(process.cwd(), 'images', 'Production.icns'),
            // format: 'ULFO',
          }),
          ['darwin']
        )
      : null,
    // new MakerRpm({}),
    // new MakerDeb({}),
  ].filter(isTruthy),
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'felipap',
          name: 'nudge',
        },
        prerelease: false,
      },
    },
  ],
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
