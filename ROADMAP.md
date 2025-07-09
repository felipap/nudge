# Nudge v0 Roadmap

## v0.1.x

- [ ] Hosted version.
- [ ] Where can users get stdout/stderr logs?
- [ ] Support multiple screens.
- [ ] Notify when fails to capture scren.
- [ ] Feat: option to show timer in the menu bar.
- [ ] Fix: warn when outside /Applications folder. Don't try to auto-update.
- [ ] Let users introspect captures and understand what's wrong.
- [ ] Feat: let user choose annoy rate.
- [ ] Can we check that the app is running from inside a Terminal?
- [ ] Notification: test access by asking users to click on the notification.
- [ ] Fix: permission errors still silent.
- [ ] Fix: "Rate limit exceeded" error for OpenAI keys without billing setup.
- [ ] Improve notification clarity - make it obvious when users should expect notifications.
- [ ] Fix: double-nudge prevention blocking initial notifications in first few minutes.
- [ ] Add session reset functionality - make it clear how to restart/reset sessions.
- [ ] Disable submit button when there are complaints about the current goal.
- [ ] When "capture now", definitely send notification.
- [ ] Somehow show notification skipped.
- [ ] Show bigger dialog when editing or creating goal.
- [ ] Enrich the AI prompt in the background for better context.
- [ ] Consider chat-based interaction: "you said you wanted to look at camping plans but you're buying pants" with ability to reply.
- [ ] Keep the "your goal is unclear" feedback - users liked this.
- [x] Buy domain (nudge.fyi).

### Later

- [ ] Landing page.
- [ ] Feat: how do you get Nudge to learn?
- [ ] Way to give feedback in the app.
- [ ] Activate notifications for GitHub issues.
- [ ] Fix: main window is still resizable.
- [ ] MCP.
- [ ] Show duration left in the indicator menu.
- [ ] Feat: post to calendar.
- [ ] Investigate possibility of non-native Notifications (problem: fullscreen?).
- [ ] iPhone app.

## v0.0.x

Finished Jul 8.

- [x] Walk user through giving screen recording permissions.
- [x] Change close button for minimize button.
- [x] Automatically check for updates.
- [x] Release for Intel Mac.
- [x] Put the tip INSIDE the submit button instead.
- [x] Fix framer-motion causing 504 issues with Vite.
- [x] Add DMG icon.
- [x] Merge tip with submit button.
- [x] Allow hide app icon from Dock.
- [x] Feat: first open telemetry event.
- [x] Notify when API key stops working.
- [x] Onboarding: Ask for OpenAI key.
- [x] Onboarding: Ask for screen permissions.
- [x] Offer users a way to contact for feedback.
- [x] Fix: lack of OpenAI key breaks everything.
- [x] Set up auto updater.
- [x] Add type checking to CI.
- [x] Add Sentry.
- [x] Feat: open settings with cmd+comma.
- [x] Add download analytics if GitHub doesn't already provide it.
- [x] Feat: Show notification when session ends.
- [x] Fix: DMG is for M1 or Intel silicon? Publish both.
- [x] When app has been closed for a long time, restart session.
- [x] Fix broken CI for x64.
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
- [x] ~Switch to electron builder? (https://www.reddit.com/r/electronjs/comments/1lcykyp)~
