// ATTENTION very important that these images are never packaged into the app.

import { join } from 'path'

export interface TestCase {
  imageFilepath: string
  goal: string
  customInstructions: string | null
  expected: {
    isFollowingGoals: boolean
    screenSummary?: string
    notificationToUser?: string
  }
}

export default [
  // CODE
  // CODE
  // CODE
  // CODE
  // CODE
  {
    imageFilepath: join(__dirname, 'resized/code-cursor-full.png'),
    goal: 'I want to code for 20 minutes.',
    customInstructions: null,
    expected: {
      isFollowingGoals: true,
    },
  },
  {
    imageFilepath: join(__dirname, 'resized/code-ghostty-empty.png'),
    goal: 'I want to code for 2 minutes.',
    customInstructions: null,
    expected: {
      // Some fail modes:
      // "terminal is open but nothing typed in it" -- AI is being annoying
      isFollowingGoals: true,
    },
  },
  {
    imageFilepath: join(__dirname, 'resized/code-iterm2-empty.png'),
    goal: 'I want to code for 2 minutes.',
    customInstructions: null,
    expected: {
      // Some fail modes:
      // "terminal is open but nothing typed in it" -- AI is being annoying
      isFollowingGoals: true,
    },
  },
  {
    imageFilepath: join(__dirname, 'resized/code-ghostty-active-full.png'),
    goal: 'I want to code for 20 minutes.',
    customInstructions: null,
    expected: {
      // Fail modes:
      // "user is using terminal instead of coding" -- AI is being annoying
      isFollowingGoals: true,
    },
  },
  {
    imageFilepath: join(__dirname, 'resized/code-ghostty-BIASED.png'),
    goal: 'I want to code for 2 minutes.',
    customInstructions: null,
    expected: {
      // Fail modes:
      // "user is seeing July 2025 calendar " -- prompt engineering with string in the terminal
      isFollowingGoals: true,
    },
  },
] as TestCase[]
