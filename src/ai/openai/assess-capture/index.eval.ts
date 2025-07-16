/* eslint-disable no-console */

import chalk from 'chalk'
import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'
import { log, warn } from '../oai-logger'
import { Result } from '../utils'
import examples, { TestCase } from './evals'
import { assessFlowWithOpenAI, Output } from './index'

interface TestResult {
  testCase: TestCase
  result: Result<Output>
  passed: boolean
  error?: string
  metrics: {
    responseTime: number
    tokenCount?: number
  }
}

interface EvalSummary {
  totalTests: number
  passedTests: number
  failedTests: number
  successRate: number
  averageResponseTime: number
  errors: string[]
  detailedResults: TestResult[]
}

// It's OK to throw on unexpected errors.
export async function runSingleExample(
  client: OpenAI,
  testCase: TestCase
): Promise<TestResult> {
  const imageName = path.basename(testCase.imageFilepath)
  log(`[eval] Running test case: ${imageName}`)

  let imageBuffer: Buffer
  try {
    imageBuffer = fs.readFileSync(testCase.imageFilepath)
  } catch (e) {
    const errorMsg = `Failed to read file ${imageName}: ${e.message}`
    warn('[eval]', errorMsg)
    throw e
  }

  const base64Content = `data:image/png;base64,${imageBuffer.toString(
    'base64'
  )}`
  const startTime = Date.now()

  let result
  try {
    result = await assessFlowWithOpenAI(
      client,
      base64Content,
      testCase.goal,
      testCase.customInstructions,
      [] // previousCaptures
    )
  } catch (e) {
    const responseTime = Date.now() - startTime
    const errorMsg = `API call failed for ${path.basename(
      testCase.imageFilepath
    )}: ${e.message}`
    warn('[eval]', errorMsg)
    return {
      testCase,
      result: { error: 'unknown', message: e.message },
      passed: false,
      error: errorMsg,
      metrics: { responseTime },
    }
  }

  const responseTime = Date.now() - startTime

  // Check if the result matches expectations
  let passed = false
  let error: string | undefined

  if ('error' in result) {
    error = `API Error: ${result.error}${
      result.message ? ` - ${result.message}` : ''
    }`
  } else {
    const assessment = result.data

    // Check if isFollowingGoals matches expected
    if (assessment.isFollowingGoals === testCase.expected.isFollowingGoals) {
      passed = true
    } else {
      error = `Expected isFollowingGoals to be ${testCase.expected.isFollowingGoals}, but got ${assessment.isFollowingGoals}`
    }

    const coloring = passed ? chalk.green : chalk.red

    // Log the assessment details for debugging
    const status = passed ? '✅ PASS' : '❌ FAIL'

    console.log(coloring(`[eval] ${status} Assessment for ${imageName}:`))
    console.log(`- Input: ${testCase.goal}`)
    console.log(`- Screen summary: ${coloring(assessment.screenSummary)}`)
    console.log(`- Following goal?: ${assessment.isFollowingGoals}`)
    // log(`  Message to User: ${assessment.notificationToUser}`)
    // log(`  Response Time: ${responseTime}ms`)

    if (!passed) {
      console.log(
        `\x1b[31m❌ MISMATCH: Expected isFollowingGoals=${testCase.expected.isFollowingGoals}, got ${assessment.isFollowingGoals}\x1b[0m\n`
      )
    }
  }

  return {
    testCase,
    result,
    passed,
    error,
    metrics: {
      responseTime,
    },
  }
}

export async function runEval(client: OpenAI): Promise<EvalSummary> {
  log('[eval] Starting assessment flow evaluation...')

  const results: TestResult[] = []
  const errors: string[] = []
  let totalResponseTime = 0

  for (const testCase of examples) {
    const result = await runSingleExample(client, testCase)
    results.push(result)

    // Update tracking variables
    totalResponseTime += result.metrics.responseTime
    if (result.error) {
      errors.push(result.error)
    }
  }

  const passedTests = results.filter((r) => r.passed).length
  const failedTests = results.filter((r) => !r.passed).length
  const successRate = (passedTests / results.length) * 100
  const averageResponseTime = totalResponseTime / results.length

  const summary: EvalSummary = {
    totalTests: results.length,
    passedTests,
    failedTests,
    successRate,
    averageResponseTime,
    errors,
    detailedResults: results,
  }

  log('[eval] Evaluation complete!')
  log(`[eval] Summary:`)
  log(`  Total Tests: ${summary.totalTests}`)
  log(`  Passed: ${summary.passedTests}`)
  log(`  Failed: ${summary.failedTests}`)
  log(`  Success Rate: ${summary.successRate.toFixed(1)}%`)
  log(`  Average Response Time: ${summary.averageResponseTime.toFixed(0)}ms`)

  if (summary.errors.length > 0) {
    log(`[eval] Errors encountered:`)
    summary.errors.forEach((error) => warn(`  - ${error}`))
  }

  return summary
}

export async function runDetailedEval(client: OpenAI): Promise<void> {
  const summary = await runEval(client)

  console.log('\n=== DETAILED EVALUATION RESULTS ===\n')

  for (const [index, result] of summary.detailedResults.entries()) {
    const filename = path.basename(result.testCase.imageFilepath)
    const status = result.passed ? '✅ PASS' : '❌ FAIL'

    console.log(`${index + 1}. ${filename} - ${status}`)
    console.log(`   Goal: ${result.testCase.goal}`)
    console.log(
      `   Expected isFollowingGoals: ${result.testCase.expected.isFollowingGoals}`
    )

    if ('data' in result.result) {
      const actualValue = result.result.data.isFollowingGoals
      const expectedValue = result.testCase.expected.isFollowingGoals
      const isMismatch = actualValue !== expectedValue

      if (isMismatch) {
        console.log(
          `   \x1b[31mActual isFollowingGoals: ${actualValue} (MISMATCH)\x1b[0m`
        )
      } else {
        console.log(`   Actual isFollowingGoals: ${actualValue}`)
      }
    } else {
      console.log(
        `   \x1b[31mError: ${result.result.error}${
          result.result.message ? ` - ${result.result.message}` : ''
        }\x1b[0m`
      )
    }

    console.log(`   Response Time: ${result.metrics.responseTime}ms`)

    if (result.error) {
      console.log(`   \x1b[31mError: ${result.error}\x1b[0m`)
    }

    console.log('')
  }

  console.log('=== SUMMARY ===')
  console.log(`Success Rate: ${summary.successRate.toFixed(1)}%`)
  console.log(
    `Average Response Time: ${summary.averageResponseTime.toFixed(0)}ms`
  )
  console.log(`Total Tests: ${summary.totalTests}`)
  console.log(`Passed: ${summary.passedTests}`)
  console.log(`Failed: ${summary.failedTests}`)

  if (summary.failedTests > 0) {
    throw new Error('Failed tests')
  }
}

const EVALS_OPENAI_API_KEY = process.env.EVALS_OPENAI_API_KEY || ''
if (!EVALS_OPENAI_API_KEY) {
  throw new Error('EVALS_OPENAI_API_KEY is not set')
}

const client = new OpenAI({ apiKey: EVALS_OPENAI_API_KEY })

void runDetailedEval(client)
