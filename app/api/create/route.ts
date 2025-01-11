import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Agent, Task, Team } from "kaibanjs";
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the schemas
const AgentSchema = z.object({
  name: z.string(),
  role: z.string(),
  goal: z.string(),
  background: z.string(),
  tools: z.array(z.string())
});

const TaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  expectedOutput: z.string(),
  agent: z.string()
});

const TeamConfigSchema = z.object({
  agents: z.array(AgentSchema),
  tasks: z.array(TaskSchema)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic } = body;

    // Use OpenAI to generate team configuration
    const prompt = `Generate a KaibanJS team configuration for the topic: "${topic}".
    Include 3 agents with different roles and their corresponding tasks.
    Each agent should have a unique purpose and complement the others.
    Format the response as a JSON object with the following structure:
    {
      "agents": [{ 
        "name": string, // Generic name for agent no spaces based on role
        "role": string,
        "goal": string,
        "background": string,
        "tools": string[] // One or more of the following tools relevant to the role and tasks: "tavilySearchResults", "firecrawl", "serper", "githubIssue", "jina"

      }],
      "tasks": [{ 
        "title": string,
        "description": string,
        "expectedOutput": string,
        "agent": string // name of the agent responsible
      }],
    }`;

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(TeamConfigSchema, "team_config")
    });

    const config = completion.choices[0].message.parsed;
    // Create agents with their specified tools
    const agents = config?.agents.map((agentConfig: any) => {
      const agentTools = (agentConfig.tools || [])
        .map((toolName: string) => [toolName])
        .filter(Boolean);
      return new Agent({ 
        ...agentConfig,
        tools: agentTools
      });
    });

    // Create tasks linked to agents
    const tasks = config?.tasks.map((taskConfig: any) => {
      return new Task({
        ...taskConfig,
        agent: agents?.[taskConfig.agentIndex]
      });
    });
  

    return NextResponse.json({ 
      success: true,
      config: { agents:config?.agents, tasks: config?.tasks }
    });
  } catch (error) {
    console.error('Error in create route:', error);
    return NextResponse.json(
      { error: 'Failed to create team configuration' },
      { status: 500 }
    );
  }
}
