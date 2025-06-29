# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.7 (2025-06-29)


### Features

* add linting workflow ([779a3fb](https://github.com/felipap/nudge/commit/779a3fb0e96f4adc4f1d87fb548cfcfd50448f1b))
* add Sentry ([533c401](https://github.com/felipap/nudge/commit/533c4019dbf422c713547b104190f5d92ac66057))
* added (bad) icons ([9361696](https://github.com/felipap/nudge/commit/936169622730123a744d63d132ba8680ffbfc40e))
* api errors showing in front end ([542aa6a](https://github.com/felipap/nudge/commit/542aa6a4a52a924477b3fdc1af8d1437e47f4d2c))
* autoupdater ([3312e58](https://github.com/felipap/nudge/commit/3312e58e8e798d5cd6b452895b0062f521f24e7e))
* development icon ([3934235](https://github.com/felipap/nudge/commit/3934235a951666416fa6bf6e3a0e3fdbe5bed856))
* emit x64 too ([91a168d](https://github.com/felipap/nudge/commit/91a168de62c354a904a017964e7956d707f5d7eb))
* nudge: new icon ([86635d3](https://github.com/felipap/nudge/commit/86635d34d1089eb3b632a1b29e2da9c8fe12b0a6))
* restart session on restart ([68df946](https://github.com/felipap/nudge/commit/68df9462cae4185a23e06342cf8b7753a9373b4a))
* settings shortcut ([db48287](https://github.com/felipap/nudge/commit/db48287cfdeece21494606c7dc741c3ffd5aed74))


### Bug Fixes

* auto launch not working ([e896644](https://github.com/felipap/nudge/commit/e89664443156913f5df9d58e1188d5f8e96defbf))
* couple changes ([add242b](https://github.com/felipap/nudge/commit/add242b08f20710c1907527374a5c6676420e38d))
* isCapturing state left from quit app ([636cbd3](https://github.com/felipap/nudge/commit/636cbd305c8d9c3d2fd52d6d9617d2a6c842511c))
* lint by ignoring mcp import issue ([e5d61c7](https://github.com/felipap/nudge/commit/e5d61c7ab6ff403bc7e6e55520c672da8b6b63ba))
* made linting stricter ([3b46abd](https://github.com/felipap/nudge/commit/3b46abde98145cc57b49932ca59194932bb54a26))
* made linting stricter ([e38d0c6](https://github.com/felipap/nudge/commit/e38d0c653b7f2dff3081813607e189944293d2db))
* some cleanups ([f92e47d](https://github.com/felipap/nudge/commit/f92e47d9dc578e283735434ed468fc344a85d3fb))
* testing fix to CI ([f7353e5](https://github.com/felipap/nudge/commit/f7353e5154fbef77f4ae91e453f9328f1992b100))
* todos: build ([36b0b54](https://github.com/felipap/nudge/commit/36b0b547f19e6dff0b728f60f70a02fdf1c6911b))

# Nudge v0 TODOs

- [ ] Onboarding: Ask for OpenAI key.
- [ ] Onboarding: Ask for screen permissions.
- [ ] Offer users a way to contact for feedback.
- [ ] Fix: lack of OpenAI key breaks everything.
- [ ] Notify when API key stops working.
- [x] Set up auto updater.
- [x] Add type checking to CI.
- [x] Add Sentry.
- [x] Feat: open settings with cmd+comma.
- [x] Add download analytics if GitHub doesn't already provide it.
- [x] Feat: Show notification when session ends.
- [x] Fix: DMG is for M1 or Intel silicon? Publish both.
- [x] When app has been closed for a long time, restart session.
- [x] Notify users when the time is up.
- [x] Fix: custom instructions not used.
- [x] Fix: auto launch is not working.
- [x] Add an FAQ about data sharing (ie. zero right now).
- [x] Find top open source apps and see how they do their README.
- [x] Fix: Notarization is broken.
- [x] Fix: capturing still shows when no session.
- [x] Make static image for the README.
- [x] Fix: "Captured (stuck?)" error.
- [x] Allow users to modify screenshot frequency.
- [x] Write the README.
- [x] Make a GIF for the README.
- [x] Fix placeholder text sucks.
- [x] Hide empty tabs of Settings window in production build.
- [x] macOS signature.
- [x] Show how long goal has been active for.
- [x] Issue: can't close the window.
- [x] Use natural language to set goal duration.
- [x] Dark mode.

## Launch

- [x] Improve README.
- [x] Write Bookface post.
- [x] Record Loom for Bookface?
- [x] Post on Bookface.
- [ ] Write Hacker News post.
- [ ] Post on Hacker News.
- [ ] Post on Instagram stories.
- [ ] Tell Kimia — can she be a beta tester?
- [ ] Make a list of friends to alpha test.
- [ ] Product Hunt?
- [ ] Twitter ad.

### Later

- [ ] Way to give feedback in the app.
- [ ] Buy domain.
- [ ] Landing page.
- [ ] Activate notifications for GitHub issues.
- [ ] Allow hide app icon from Dock.
- [ ] Fix: main window is still resizable.
- [ ] Switch to electron builder? (https://www.reddit.com/r/electronjs/comments/1lcykyp)
- [ ] MCP.
- [ ] Show duration left in the indicator menu.
- [ ] Fix broken CI for x64.
- [ ] Put the tip INSIDE the submit button instead.
- [ ] Walk user through giving screen recording permissions.
- [ ] Fix framer-motion causing 504 issues with Vite.
- [ ] Investigate possibility of non-native Notifications (problem: fullscreen?).
- [ ] Let users introspect captures and understand what's wrong.
- [ ] After restart past session goal, ask user what they want to do.
- [ ] iPhone app.

### Launch progression

- Bookface asking for feedback.
- Twitter asking for feedback.
- Ship last v0 things.
- Bookface v0 launch.
- Reddit asking for feedback.
- Launch MCP.

### People to send to

Kimia
Michelle
Juliana
Pedro
Pedro Guimarães
Kevin
Rafael
Bernardo
Julia Wu
Clients: Overjoy people

### Good READMEs

https://github.com/calcom/cal.com
https://github.com/ghostty-org/ghostty
https://github.com/resend/react-email
https://github.com/dracula/dracula-theme
https://github.com/MrKai77/Loop

Maybe good:
https://github.com/anthropics/claude-code
https://github.com/nbonamy/witsy
https://github.com/kortix-ai/suna

https://github.com/trending?since=monthly
