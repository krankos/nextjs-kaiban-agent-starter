import { Agent, Task, Team } from "kaibanjs";
import { Firecrawl, Serper, TavilySearchResults } from "@kaibanjs/tools";

// Enhanced search tool with better parameters
const searchTool = new TavilySearchResults({
    maxResults: 15,
    apiKey: process.env.NEXT_PUBLIC_TRAVILY_API_KEY ?? '',
    query: '{topic}'
});

const firecrawlTool = new Firecrawl({
    apiKey: process.env.NEXT_PUBLIC_FIRECRWAL_API_KEY ?? '',
    format: 'markdown'
});

const serpTool = new Serper({
    apiKey: process.env.NEXT_PUBLIC_SERPER_API_KEY ?? '',
    type: 'search',
    params: {
        num: 20,
        tbs: "qdr:d"
    }
});

// Research Agent
const researchAgent = new Agent({
    name: 'URL Retrieval',
    role: 'News Researcher',
    goal: 'Find relevant and recent news articles on a given topic, focusing on credible sources and diverse perspectives. Ensure articles are from reputable news organizations, academic sources, or industry experts. Articles should be recent, today or this week.',
    background: 'Expert at web searching and finding relevant sites.',
    tools: [searchTool, firecrawlTool]
});

const evaluationAgent = new Agent({
    name: 'Evaluation',
    role: 'Evaluator',
    goal: 'Conduct comprehensive evaluation of research quality, source credibility, and grounded on {topic}. Flag any old news or gaps in coverage that need additional research. Determine if research is sufficient or do another round.',
    background: 'Specialized in journalistic fact-checking, academic peer review processes, and content verification. Expert in identifying misinformation, analyzing source methodology, and evaluating statistical validity. Trained in bias detection and maintaining objectivity in research assessment.',
    tools: []
});

const secondaryResearchAgent = new Agent({
    name: 'Secondary Research',
    role: 'Secondary Researcher',
    goal: 'Conduct deep-dive research to fill gaps identified in primary research. Focus on specialized industry reports, academic papers, expert analyses, and historical context. Ensure comprehensive coverage of topic nuances and emerging developments.',
    background: 'Expert in research, seo keywords, and experienced in synthesizing complex information and sources.',
    tools: [serpTool]
});

// Firecrawl Agent
const firecrawlAgent = new Agent({
    name: 'URL Parser',
    role: 'Content Extractor',
    goal: 'Extract and format article content from provided URLs while maintaining accuracy and readability. Include proper attribution and identify key quotes.',
    background: 'Specialized in web scraping, content parsing, and maintaining proper attribution to original sources.',
    tools: [firecrawlTool]
});

// Writer Agent
const writerAgent = new Agent({
    name: 'Post Writer',
    role: 'Content Creator',
    goal: 'Create comprehensive content, detailed citations, expert quotes.',
    background: 'Expert in academic writing, technical communication, and data journalism. Skilled at synthesizing complex information, Experienced in creating properly cited content.',
    tools: []
});

// Tasks with detailed instructions
const researchTask = new Task({
    title: 'Latest news research',
    description: `
        Research and identify 6-10 recent, credible sources and summaries on: {topic}
        Requirements:
        - Articles must be today and relevant to {topic}
        - Include at least 3 different perspectives on the topic
        - Avoid duplicate coverage
        - Provide brief summaries for each article
    `,
    expectedOutput: 'A JSON array of articles with URLs, titles, sources, publish dates, summaries, and main perspectives',
    agent: researchAgent,
});

const firecrawlTask = new Task({
    title: 'Content Extraction',
    description: `
        Extract content from the provided URLs for topic: {topic}
        Requirements:
        - Maintain proper attribution and source links
        - Format content in clean markdown
        - Extract 3-5 key quotes per article
        - Note any statistical data points
        - Flag paywalled content
    `,
    expectedOutput: 'A JSON array of processed articles with full content, key quotes, and metadata',
    agent: firecrawlAgent
});

const evaluationTask = new Task({
    title: 'Evaluation',
    description: `
        Evaluate the quality of the research and content extraction results.
    `,
    expectedOutput: 'TRUE or FALSE if the research and content extraction results are good to start writing content related to {topic}.',
    agent: evaluationAgent
});

const secondaryResearchTask = new Task({
    title: 'Secondary Research',
    description: `
        Find additional relevant news articles on a given topic, focusing on credible sources and diverse perspectives. Ensure articles are from the past week and represent at least 3 different viewpoints.
    `,
    expectedOutput: 'A JSON array of articles with URLs, titles, sources, publish dates, summaries, and main perspectives',
    agent: firecrawlAgent
});

const writingTask = new Task({
    title: 'Blog post writing',
    description: `
        Write an analytical draft compiling all of the research and content extraction results.
        Requirements:
        - Create a clear outline
        - Include relevant quotes and statistics
        - Add proper citations
        - Aim for complete and comprehensive
        - Verbosity and length is required
    `,
    expectedOutput: 'A compilation of all of the research and content extraction results done in prior steps on {topic}.',
    agent: writerAgent
});

const produceBlogPostTask = new Task({
    title: 'Produce Blog Post',
    description: `
        Produce the final blog post about {topic} based on the provided research with emojis and formatting.
    `,
    expectedOutput: 'A complete blog post in markdown format with citations and structured sections based on the provided research and draft of on {topic}.',
    agent: writerAgent
});

// Create the Team
export const blogTeam = new Team({
    name: 'AI Research Team',
    agents: [researchAgent, firecrawlAgent, evaluationAgent, secondaryResearchAgent, writerAgent],
    tasks: [researchTask, firecrawlTask, evaluationTask, secondaryResearchTask, writingTask, produceBlogPostTask],
    env: {
        OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? '',
        TRAVILY_API_KEY: process.env.NEXT_PUBLIC_TRAVILY_API_KEY ?? '',
        FIRECRWAL_API_KEY: process.env.NEXT_PUBLIC_FIRECRWAL_API_KEY ?? ''
    }
});
  
