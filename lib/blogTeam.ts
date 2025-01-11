import { Agent, Task, Team } from "kaibanjs";
import { Firecrawl } from "@kaibanjs/tools";
import { TavilySearchResults } from '@kaibanjs/tools';


// Define the search tool used by the Research Agent
const searchTool = new TavilySearchResults({
    maxResults: 15,
    apiKey: process.env.NEXT_PUBLIC_TRAVILY_API_KEY ?? '',
    query: 'latest news on {topic}'
});

const firecrawlTool = new Firecrawl({
    apiKey: process.env.NEXT_PUBLIC_FIRECRWAL_API_KEY ?? '',
    format: 'markdown'
});

// Define the Research Agent
const researchAgent = new Agent({
    name: 'URL Retrieval',
    role: 'News Researcher',
    goal: 'Find relevant and recent news articles on a given topic, focusing on credible sources and diverse perspectives',
    background: 'Expert at discovering trending news stories and identifying reliable sources. Skilled in filtering out low-quality or duplicate content.',
    tools: [searchTool]
});

// Define the Firecrawl Agent
const firecrawlAgent = new Agent({
    name: 'URL Parser',
    role: 'Content Extractor',
    goal: 'Extract and format article content from provided URLs while maintaining accuracy and readability',
    background: 'Specialized in web scraping, content parsing, and maintaining proper attribution to original sources.',
    tools: [firecrawlTool]
});

// Define the Writer Agent
const writerAgent = new Agent({
    name: 'Post Writer',
    role: 'Content Creator',
    goal: 'Create engaging, well-structured blog posts that synthesize information from multiple sources',
    background: 'Expert in content creation, storytelling, and maintaining a consistent writing style. Skilled at organizing information logically and maintaining reader engagement.',
    tools: []
});

  // Define Tasks
const researchTask = new Task({
    title: 'Latest news research',
    description: 'Research and identify 6-10 recent, credible news articles on: {topic}. Focus on diverse perspectives and authoritative sources.',
    expectedOutput: 'A curated list of relevant news articles with brief summaries of their key points',
    agent: researchAgent,
});

const firecrawlTask = new Task({
    title: 'URL Retrieval',
    description: 'Parse the URLs of the latest news articles on the topic: {topic}',
    expectedOutput: 'A list of URLs of the latest news articles on the given topic',
    agent: firecrawlAgent
});
  
const writingTask = new Task({
    title: 'Blog post writing',
    description: 'Write a blog post about {topic} based on the provided research',
    expectedOutput: 'An engaging blog post summarizing the latest news on the topic in Markdown format',
    agent: writerAgent
});

// Create the Team
export const blogTeam = new Team({
    name: 'AI News Blogging Team',
    agents: [researchAgent, firecrawlAgent, writerAgent],
    tasks: [researchTask, firecrawlTask, writingTask],
    env: {
        OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '',
        TRAVILY_API_KEY: process.env.NEXT_PUBLIC_TRAVILY_API_KEY ?? '',
        FIRECRWAL_API_KEY: process.env.NEXT_PUBLIC_FIRECRWAL_API_KEY ?? ''
    }
});
  
