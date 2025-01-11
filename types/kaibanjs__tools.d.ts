declare module '@kaibanjs/tools' {
  export class Serper {
    constructor(config: { apiKey: string; type: string; params: any });
  }
  export class Firecrawl {
    constructor(config: { apiKey: string; format: string });
  }
  export class TavilySearchResults {
    constructor(config: { maxResults: number; apiKey: string; query: string });
  }
} 