# AutoQA Playwright Engine — Agents

This directory will contain the AI-powered QA agent implementations.

## Planned Agents

- `QAAgent.ts` — Master orchestrator agent that coordinates page exploration
- `NavigatorAgent.ts` — Handles site crawling and page discovery
- `InteractionAgent.ts` — Simulates user interactions (click, fill, submit)
- `AssertionAgent.ts` — Validates expected behaviors and captures issues
- `AccessibilityAgent.ts` — Runs axe-core a11y checks on each page

Each agent will receive a `ScanContext` and write findings to a shared `ScanResult` accumulator.
