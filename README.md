
<img src="https://github.com/user-attachments/assets/1634d175-c6e7-41f7-89d9-ef0a979f0464" width="128" alt="Logo" />

# Nudge

The AI companion that nudges you into flow.

<p align="left">
  <a href="#about">About</a>
  ·
  <a href="#download">Download</a>
  ·
  <a href="#faq">FAQ</a>
</p>
</p>

## About

Nudge is an app for macOS that watches your screen and helps you stay in flow. Describe an activity and a duration ("I want to vibe code for an hour") and Nudge will notify you when it looks like you're doing something else. You will need an **OpenAI API key** to use Nudge today.

See Nudge in action:

https://github.com/user-attachments/assets/5d93bc18-efcc-44ca-a4dd-a859efee6d21

## Download

See the [releases page](https://github.com/felipap/nudge/releases/latest) to find the latest DMGs.

## FAQ

<details>
  <summary>
    How does it work?
  </summary>
  <p>
    Nudge takes a picture of your screen every few seconds, then asks GPT-4o if it looks like you're engaged in the activity you chose for yourself. If not, Nudge sends you a notification.
    The default frequency of capture is one minute, but you can modify this in the app settings.</p>
</details>
<details>
  <summary>
    What data does Nudge collect?
  </summary>
  <p>
    Nudge has no external servers today. All the screenshots are exchanged directly between your computer and OpenAI's servers. Nudge does not retain screenshots inside of your computer either. The data sent to 4o may be accessible by the owner of the API key you enter.
  </p>
</details>
<details>
  <summary>
    Can I use a different model instead?
  </summary>
  <p>
    Not today but I will ship this if enough users ask for it. [File an issue.](https://github.com/felipap/nudge/issues/new)
  </p>
</details>

## Development

[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/felipap/compass/build-nudge.yml)](https://github.com/felipap/compass/actions)

## License

Apache 2.0

<!-- Intelligent tools for productivity. -->

<!--
## todos

A simple to-do app with MCP support. 📝
-->

<!-- ## nudge

An AI that watches your computer and prevents distractions. 👉 -->
