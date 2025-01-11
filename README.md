# AI Team Orchestration Platform

A Next.js application that orchestrates AI agent teams for content generation and research using KaibanJS.

## Overview

This platform allows you to create and manage teams of AI agents that work together to accomplish complex tasks. Currently supported workflows include:

- **Blog Post Generation**: Automated research and writing using specialized agents
- **Social Media Research**: Multi-platform content analysis and trend detection
- **Team Configuration**: Dynamic agent team creation based on topics

## Features

### Next.js Pages

- `/` - Home page with the blog generation interface
  - Real-time agent status monitoring
  - Task progress tracking
  - Performance statistics
  
- `/create` - Team configuration page
  - Dynamic agent team creation
  - Role and task assignment
  - Tool selection for agents

- `/run` - Agent execution history
  - Previous run logs
  - Output history
  - Run status tracking

### API Routes

- `/api/create`
  - POST: Creates new agent team configurations with OpenAI
  - Parameters:
    - `topic`: string - The topic to generate a team for
  - Returns: Team configuration with agents and tasks

- `/api/agents`
  - GET: Executes agent workflows
  - Query Parameters:
    - `topic`: string - The topic to process
  - Returns: Generated content and execution statistics

- `/api/runs`
  - GET: Retrieves execution history
  - Query Parameters:
    - `limit`: number (default: 10)
    - `offset`: number (default: 0)
  - Returns: List of previous runs with status and output

- `/api/runs/[id]`
  - GET: Retrieves specific run details
  - Parameters:
    - `id`: number - Run identifier
  - Returns: Detailed run information and logs

## Getting Started

1. Install dependencies:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
