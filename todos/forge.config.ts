import { MakerDMG } from '@electron-forge/maker-dmg'
import { MakerZIP } from '@electron-forge/maker-zip'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: 'engineering.pi.todos',
    asar: true,
    icon: 'images/MyIcon.icns',
    extraResource: ['images'],
  },
  rebuildConfig: {},
  makers: [
    // new MakerSquirrel({}),
    // new MakerZIP({}, ['darwin']),
    // new MakerRpm({}),
    // new MakerDeb({}),
    new MakerDMG({}, ['darwin']),
    new MakerZIP({}, ['darwin']),
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
          name: 'widget_window',
          config: 'vite.widgetWindow.config.ts',
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
