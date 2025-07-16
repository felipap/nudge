<img src="https://github.com/user-attachments/assets/1ae2fe14-c93f-4bfe-8d66-aa59046343ad" width="128" alt="Logo" />

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

[Ask a new question.](https://github.com/felipap/nudge/discussions/new/choose)

<details>
  <summary>
    <strong>How does Nudge work?</strong>
  </summary>
  <p>
    Nudge takes a picture of your screen every few seconds, then asks GPT-4o if it looks like you're engaged in the activity you chose for yourself. If not, Nudge sends you a notification.
    The default frequency of capture is one minute, but you can modify this in the app settings.</p>
</details>
<details>
  <summary>
    <strong>What is Nudge Cloud?</strong>
  </summary>
  <p>
    It's a way to use Nudge without an OpenAI API key. Instead of sending screenshots to OpenAI, Nudge sends them to a server that we run, which then sends them to OpenAI. We do this to make Nudge accessible to everyone, even non-technical users.
  </p>
  <p>
    Screenshots are very sensitive data. I don't retain them in any way, just pass them along to OpenAI and send back the result.
  </p>
  <p>
    Believe me, I would rather not host any servers, but it's the only way I found to make Nudge accessible to non-technical people. You can contact me at felipe@portalform.com with any questions or concerns.
  </p>
</details>
<details>
  <summary>
    <strong>What data does Nudge collect?</strong>
  </summary>
  <p>
    Nudge has two modes: local and cloud. Local means you run the app on your computer and talk to the OpenAI API directly, using a key you provide. In this mode, we don't see any of your data.
  </p>
  <p>
    Nudge "Cloud" is for people who don't have an OpenAI API Key.

    Cloud is currently free for up to 20 hours a month (we're eating the cost for the sake of this experiment).

    Nudge has no external servers today. All the screenshots are exchanged directly between your computer and OpenAI's servers. Nudge does not accumulate screenshots inside of your computer either. Once they're sent to OpenAI, they're discarded. The data sent to 4o may be accessible by the owner of the API key you enter.

  </p>
  <p>
    We use <a href="https://sentry.io" target="_blank">Sentry</a> for error tracking and telemetry but <a href="https://docs.sentry.io/platforms/javascript/configuration/options/#sendDefaultPii" target="_blank">we don't collect PII as far as I know</a>.
  </p>
</details>
<details>
  <summary>
    Can I use a model other than GPT-4o?
  </summary>
  <p>
    Not today but I will ship if enough users ask for it. <a href="https://github.com/felipap/nudge/discussions/new">Start a discussion.</a>
  </p>
</details>
<details>
  <summary>
    How much does Nudge cost in AI usage?
  </summary>
  <p>
    Depends on the model you use, the size of your screen, and the frequency of captures.
  </p>
  <p>
    During a test on July 2nd 2025, I found that each screenshot of my 1470x956 Mac translated into ~14k input tokens in GPT-4o-mini. In default settings (1 minute capture frequency), this means $0.002 USD per minute that Nudge is active, or 12 cents per hour.
  </p>
  <p>
    I'm interested in ways to make this cheaper. If you have ideas, <a href="https://github.com/felipap/nudge/discussions/new">start a discussion.</a>
  </p>
</details>

## Status

[![Downloads Badge](https://img.shields.io/github/downloads/felipap/nudge/total.svg?color=green)](https://tooomm.github.io/github-release-stats/?username=felipap&repository=nudge)
[![Build Status](https://img.shields.io/github/actions/workflow/status/felipap/nudge/test.yml)](https://github.com/felipap/nudge/actions)
[![Eval Status](https://img.shields.io/github/actions/workflow/status/felipap/nudge/evals.yml?color=orange&label=evals)](https://github.com/felipap/nudge/actions)

## License

GPL-3.0
