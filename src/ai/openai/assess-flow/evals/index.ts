import { join } from 'path'

export interface TestCase {
  imageFilepath: string
  goal: string
  customInstructions: string | null
  expected: {
    isFollowingGoals: boolean
    screenSummary?: string
    messageToUser?: string
  }
}

export default [
  // CODE
  // {
  //   imageFilepath: join(__dirname, 'resized/code-iterm2-ghosttyname.png'),
  //   goal: 'I want to use my terminal for 20 minutes.',
  //   customInstructions: null,
  //   expected: {
  //     isFollowingGoals: true,
  //   },
  // },
  // {
  //   imageFilepath: join(__dirname, 'resized/bab.png'),
  //   goal: 'I want to code for 2 minutes.',
  //   customInstructions: null,
  //   expected: {
  //     isFollowingGoals: true,
  //   },
  // },
  // {
  //   imageFilepath: join(__dirname, 'resized/code-terminal-ghostty-2.png'),
  //   goal: 'I want to code for 2 minutes.',
  //   customInstructions: null,
  //   expected: {
  //     isFollowingGoals: true,
  //   },
  // },
  {
    imageFilepath: join(__dirname, 'resized/code-terminal-ghostty.png'),
    goal: 'I want to code for 2 minutes.',
    customInstructions: null,
    expected: {
      isFollowingGoals: true,
    },
  },
] as TestCase[]
