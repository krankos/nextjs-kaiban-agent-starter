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
    background: 'Expert in academic writing, technical communication, and data journalism. Skilled at synthesizing complex information, Experienced in creating properly cited content. Expert in LinkedIn Marketing, especially in the tech industry. Skilled at writing engaging and informative content for LinkedIn posts.',
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
  title: "LinkedIn post writing",
  description: `
        Write a LinkedIn post that showcases the company’s (Addval Solutions) expertise, value, and contributions without relying on fabricated or unverifiable information.

Requirements:

    Authentic Hook: Start with a compelling and factual opening line—this could be a verified statistic, a milestone the company has achieved, or a relevant industry insight. Avoid generic or sensationalist claims.
    Educational and Value-Driven: Share actionable insights, real-world examples, or thoughtful perspectives that reflect the company’s core values and expertise. If referencing data, ensure it is sourced from credible publications or the company’s own verified reports.
    Concise and Readable Structure: Use short paragraphs, lists, or bullet points for clarity.
    Brand Alignment: Maintain a tone that aligns with the company’s values: professional, approachable, and solution-oriented. Avoid exaggerated or salesy language.
    Engaging Call to Action (CTA): Encourage interaction with prompts like:
        “What are your thoughts on this approach?”
        “Explore our recent case study for more insights.”
        “We’d love to hear how your team handles [topic].”

Stylistic Guidelines:

    Prioritize transparency: If data or metrics are included, ensure they are attributed to reliable sources. For example, “According to [source], X% of professionals in our industry face this challenge.”
    Avoid hyperbole or unverifiable claims, focusing instead on measurable outcomes or expert commentary.
    Keep it concise, between 150-250 words, with a focus on delivering clear value.

Optional Enhancements:

    Include visuals or links to reports, case studies, or white papers for additional credibility.
    Share behind-the-scenes company updates or achievements that demonstrate transparency and authenticity.
    `,
  expectedOutput:
    "A compilation of all of the research and content extraction results done in prior steps on {topic}.",
  agent: writerAgent,
});

const produceBlogPostTask = new Task({
  title: "Produce LinkedIn Post",
  description: `
        Using the summarized findings on {topic}, write a polished LinkedIn post that is concise, engaging, and aligned with best practices for company page content.

Requirements:

    Compelling Opening: Start with a bold statement, statistic, or question to grab attention.
    Value-Driven Content: Highlight the key insights or solutions from the research in a way that resonates with the target audience.
    Clear and Concise: Structure the post for readability with short paragraphs or bullet points.
    Professional Tone: Reflect the company’s brand voice while maintaining a conversational and approachable style.
    Call to Action: Conclude with a clear invitation for engagement, such as “What do you think about this approach?” or “Share your thoughts in the comments.”

Stylistic Guidelines:

    Use simple, direct language to ensure clarity.
    Limit emojis to 1–2, if any, to keep the post professional.
    Use technical jargon sparingly and explain complex terms for a broader audience.
    Make sure the spacing and formatting are consistent for easy reading.
    Be creative with the headline to pique interest and encourage clicks.
    Make sure bullet points are well styled. You can use "-" or "•" for bullet points and use spacing.
    At the end of the post, add a P.S. to indicate that the post was written by an AI assistant.
    Use emojis sparingly and strategically to enhance the post’s visual appeal.

Length:
Aim for 150–200 words for optimal readability and impact.
    `,
  expectedOutput:
    "A complete LinkedIn post in plain text, structured with a compelling opening, key insights, and an engaging conclusion based on the provided research on {topic}.",
  agent: writerAgent,
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
  
