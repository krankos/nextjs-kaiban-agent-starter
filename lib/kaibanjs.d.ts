import type { IAgentParams, ITaskParams } from "kaibanjs";

declare module 'kaibanjs' {
  interface AgentConfig {
    name: string;
    role: string;
    goal: string;
    background: string;
    tools: any[];
  }

  interface TaskConfig {
    title: string;
    description: string;
    expectedOutput: string;
    agent: Agent;
  }

  interface TeamConfig {
    name: string;
    agents: Agent[];
    tasks: Task[];
    env: Record<string, string>;
    workflow?: {
        type: string;
        steps: any[];
    };
  }

  export class Team {
    constructor(config: TeamConfig);
    start(params: { topic: string }): Promise<TeamOutput>;
    useStore(): any;
  }
  
  export class Agent {
    constructor(config: AgentConfig);
  }
  
  export class Task {
    constructor(config: TaskConfig);
  }
} 