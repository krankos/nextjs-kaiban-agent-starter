import { Agent, Task, Team } from "kaibanjs";
import { Serper, Firecrawl } from "@kaibanjs/tools";

// Configure Serper tool
const searchTool = new Serper({
    apiKey: process.env.NEXT_PUBLIC_SERPER_API_KEY ?? '',
    type: 'search',
    params: {
        timeframe: '24h',  // Limit to last 24 hours
        num: 20, // Increase results to find more relevant posts
        tbs: "qdr:d"
    }
});

const firecrawlTool = new Firecrawl({
    apiKey: process.env.NEXT_PUBLIC_FIRECRWAL_API_KEY ?? '',
    format: 'markdown'
});

// Define the Keyword Agent
const keywordAgent = new Agent({
    name: 'KeywordExtractor',
    role: 'Keyword Analyst',
    goal: 'Extract relevant keywords and search terms from the given topic',
    background: 'Expert at analyzing topics and identifying key search terms for the given topic',
    tools: []
});

// Define platform-specific agents
const redditAgent = new Agent({
    name: 'RedditSearcher',
    role: 'Reddit Researcher',
    goal: 'Find today\'s most relevant Reddit posts and discussions on the provided keywords',
    background: 'Specialized in searching Reddit for trending discussions and valuable insights .',
    tools: [searchTool, firecrawlTool],
});

const twitterAgent = new Agent({
    name: 'TwitterSearcher',
    role: 'Twitter Researcher',
    goal: 'Find relevant tweets and discussions on the provided keywords',
    background: 'Specialized in searching Twitter for trending discussions and valuable insights. Proficient in using site: to target Twitter / X specifically when searching.',
    tools: [searchTool, firecrawlTool]
});

const linkedinAgent = new Agent({
    name: 'LinkedInSearcher',
    role: 'LinkedIn Researcher',
    goal: 'Find relevant LinkedIn posts and discussions on the provided keywords',
    background: 'Specialized in searching LinkedIn for professional discussions and insights. Proficient in using site: to target Linkedin specifically when searching.',
    tools: [searchTool, firecrawlTool]
});

// Add new merger agent
const mergerAgent = new Agent({
    name: 'ResultsMerger',
    role: 'Results Processor',
    goal: 'Combine and organize social media results into a cohesive report',
    background: 'Expert at analyzing and organizing social media data from multiple platforms',
    tools: []
});

// Define Tasks
const keywordTask = new Task({
    title: 'Extract Keywords',
    description: `
        Analyze the topic "{topic}" and extract:
        - Primary keywords
        - Alternative phrasings
        - Related hashtags
        - Trending terms
    `,
    expectedOutput: 'A structured list of search terms with categories',
    agent: keywordAgent,
    }
);

const redditTask = new Task({
    title: 'Search Reddit',
    description: 'Search Reddit for posts from the last 24 hours related to: {keywords}',
    expectedOutput: `
        List of Reddit posts including:
        - Full URL
        - Subreddit name
        - Post title
        - Engagement metrics
        - Posted time (must be within 24h)
        - Brief summary
    `,
    agent: redditAgent
});

const twitterTask = new Task({
    title: 'Search Twitter',
    description: 'Search Twitter for posts related to keywords: {keywords}',
    expectedOutput: 'A list of relevant tweet URLs with brief descriptions',
    agent: twitterAgent
});

const linkedinTask = new Task({
    title: 'Search LinkedIn',
    description: 'Search LinkedIn for posts related to keywords: {keywords}',
    expectedOutput: 'A list of relevant LinkedIn post URLs with brief descriptions',
    agent: linkedinAgent
});

// Add merger task
const mergerTask = new Task({
    title: 'Merge Results',
    description: 'Combine and organize results from Reddit, Twitter, and LinkedIn searches',
    expectedOutput: `
        Organized report containing:
        - Most engaging posts across platforms
        - Platform-specific highlights
        - Common themes or trends
        - Combined engagement metrics
    `,
    agent: mergerAgent
});

// Create the Team
export const socialTeam = new Team({
    name: 'Social Media Research Team',
    agents: [keywordAgent, redditAgent, twitterAgent, linkedinAgent, mergerAgent],
    tasks: [keywordTask, redditTask, twitterTask, linkedinTask, mergerTask],
    env: {
        OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
    },
    workflow: {
        type: 'parallel',
        steps: [
            {
                task: keywordTask,
                next: {
                    type: 'parallel',
                    tasks: [redditTask, twitterTask, linkedinTask],
                    next: mergerTask
                }
            }
        ]
    }
});
  
