<img src="https://github.com/user-attachments/assets/1ae2fe14-c93f-4bfe-8d66-aa59046343ad" width="128" alt="Logo" />

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
    During a focus session, Nudge takes screenshots every minute and asks a multimodal AI (e.g., GPT-4o-mini) whether you're doing the activity you chose for that session. When it detects you're distracted, Nudge sends you a notification.
  </p>
  <p>
    You can read the detection code at <a href="https://github.com/felipap/nudge/blob/main/src/ai/openai/assess-capture/index.ts">/main/src/ai/openai/assess-capture/index.ts</a>.
  </p>
</details>
<details>
  <summary>
    <strong>What is Nudge Cloud?</strong>
  </summary>
  <p>
    By default, Nudge sends screenshots directly to OpenAI using your API key. If you don't have an OpenAI key, you can use "Nudge Cloud," which proxies requests through **nudge.fyi**.
  </p>
  <p>
    Screenshots may contain sensitive data, but I don't retain or observe them. I only host this server to make Nudge accessible to non-technical users.
  </p>
  <p>
    You can contact me at felipe AT portalform.com with any questions or concerns.
  </p>
</details>
<details>
  <summary>
    <strong>What data does Nudge collect?</strong>
  </summary>
  <p>
    <strong>With Nudge Cloud:</strong> Nudge Cloud acts as a proxy server and doesn't collect any screenshot or session activity data. We save request headers to prevent abuse, as the server is currently free up to 20 session-hours a month. (I'm eating the cost for the sake of this experiment.)
  </p>
  <p>
    <strong>Without Nudge Cloud:</strong> Data is exchanged directly with OpenAI. The data sent to GPT-4o may be accessible by the owner of the API key you enter.
  </p>
  <p>
    Error tracking: We use <a href="https://sentry.io" target="_blank">Sentry</a> for crashes and telemetry, but <a href="https://docs.sentry.io/platforms/javascript/configuration/options/#sendDefaultPii" target="_blank">we don't collect PII as far as I know</a>. I will consider making this optional in future versions.
  </p>
</details>
<details>
  <summary>
    <strong>Can I use other AI backends?</strong>
  </summary>
  <p>
    Not yet, but I'll add support if there's demand. <a href="https://github.com/felipap/nudge/discussions/new">Start a discussion to request specific providers.</a>
  </p>
</details>
<details>
  <summary>
    <strong>How much does Nudge cost in AI usage?</strong>
  </summary>
  <p>
    Costs depend on the model you use, your screen size, and capture frequency.
  </p>
  <p>
    During testing on July 2nd, 2025: a 1470x956 Mac screenshot used ~14k input tokens in GPT-4o-mini. At default settings (1-minute capture frequency), this works out to $0.002 per minute that Nudge is active, or about $0.12 per hour.
  </p>
  <p>
    I'm looking for ways to reduce these costs. If you have ideas, <a href="https://github.com/felipap/nudge/discussions/new">start a discussion.</a>
  </p>
</details>

## Status

[![Downloads Badge](https://img.shields.io/github/downloads/felipap/nudge/total.svg?color=green)](https://tooomm.github.io/github-release-stats/?username=felipap&repository=nudge)
[![Build Status](https://img.shields.io/github/actions/workflow/status/felipap/nudge/test.yml)](https://github.com/felipap/nudge/actions)
[![Eval Status](https://img.shields.io/github/actions/workflow/status/felipap/nudge/evals.yml?color=orange&label=evals)](https://github.com/felipap/nudge/actions)

## License

GPL-3.0
