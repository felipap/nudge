<img src="https://github.com/user-attachments/assets/1634d175-c6e7-41f7-89d9-ef0a979f0464" width="128" alt="Logo" />

<!-- <h1><code style="text-shadow: 0px 3px 10px rgba(8, 0, 6, 0.35); font-size: 3rem; font-family: ui-monospace, Menlo, monospace; font-weight: 800; background: transparent; color: #4d3e56; padding: 0.2rem 0.2rem; border-radius: 6px">Nudge</code></h1> -->

# Nudge

The AI that nudges you into flow.

<p align="left">
  <a href="#about">About</a>
  ·
  <a href="#download">Download</a>
  ·
  <a href="#demo">Demo</a>
  ·
  <a href="#faq">FAQ</a>
</p>
</p>

## About

Nudge is an app for macOS that watches your screen and helps you stay in flow. Describe an activity and a duration ("I want to vibe code for an hour") and Nudge will notify you when it looks like you're doing something else.

<p>
<img src="https://github.com/user-attachments/assets/ca091ed8-d4c7-4e53-9570-6db4f4b34f6a" width="500" />
</p>

You will need an **OpenAI API key** to use Nudge.

## Download

See the [releases page](https://github.com/felipap/nudge/releases/latest) to find the latest DMGs.

## Demo

https://github.com/user-attachments/assets/5d93bc18-efcc-44ca-a4dd-a859efee6d21

## FAQ

<details>
  <summary>
    How does Nudge work?
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
    Nudge has no external servers today. All the screenshots are exchanged directly between your computer and OpenAI's servers. Nudge does not accumulate screenshots inside of your computer either. Once they're sent to OpenAI, they're discarded. The data sent to 4o may be accessible by the owner of the API key you enter.
  </p>
</details>
<details>
  <summary>
    Can I use a model different from GPT-4o?
  </summary>
  <p>
    Not today but I will ship if enough users ask for it. <a href="https://github.com/felipap/nudge/issues/new">File an issue.</a>
  </p>
</details>
<!-- <details>
  <summary>
    How many tokens does Nudge use?
  </summary>
  <p>
  </p>
</details> -->

[Ask a new question.](https://github.com/felipap/nudge/discussions/new/choose)

## Status

[![Downloads Badge](https://img.shields.io/github/downloads/felipap/nudge/total.svg?color=green)](https://tooomm.github.io/github-release-stats/?username=felipap&repository=nudge)
[![Build Status](https://img.shields.io/github/actions/workflow/status/felipap/nudge/test.yml)](https://github.com/felipap/nudge/actions)

## License

GPL-3.0

<!-- Intelligent tools for productivity. -->

<!--
## todos

A simple to-do app with MCP support. 📝
-->

<!-- ## nudge

An AI that watches your computer and prevents distractions. 👉 -->
