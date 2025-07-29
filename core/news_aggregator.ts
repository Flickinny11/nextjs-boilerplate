import Parser from 'rss-parser';
import { NewsArticle, NewsCategory, UrgencyLevel } from './types';

export class NewsAggregator {
  private parser: Parser;
  private sources: Array<{
    url: string;
    name: string;
    category: NewsCategory;
    priority: number;
  }>;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail']
      }
    });

    this.sources = [
      {
        url: 'https://feeds.reuters.com/reuters/topNews',
        name: 'Reuters',
        category: NewsCategory.BREAKING,
        priority: 1
      },
      {
        url: 'https://feeds.npr.org/1001/rss.xml',
        name: 'NPR',
        category: NewsCategory.POLITICS,
        priority: 1
      },
      {
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        name: 'BBC',
        category: NewsCategory.INTERNATIONAL,
        priority: 1
      },
      {
        url: 'https://www.espn.com/espn/rss/news',
        name: 'ESPN',
        category: NewsCategory.SPORTS,
        priority: 2
      },
      {
        url: 'https://feeds.feedburner.com/TechCrunch',
        name: 'TechCrunch',
        category: NewsCategory.TECHNOLOGY,
        priority: 2
      }
    ];
  }

  async fetchAllNews(): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = [];

    for (const source of this.sources) {
      try {
        const articles = await this.fetchFromSource(source);
        allArticles.push(...articles);
      } catch (error) {
        console.warn(`Failed to fetch from ${source.name}:`, error);
        // Continue with other sources even if one fails
      }
    }

    // Sort by urgency and publish date
    return allArticles
      .sort((a, b) => {
        const urgencyOrder = { 
          critical: 4, 
          high: 3, 
          medium: 2, 
          low: 1, 
          routine: 0 
        };
        
        const urgencyDiff = urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        if (urgencyDiff !== 0) return urgencyDiff;
        
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 100); // Limit to most recent/important 100 articles
  }

  private async fetchFromSource(source: {
    url: string;
    name: string;
    category: NewsCategory;
    priority: number;
  }): Promise<NewsArticle[]> {
    try {
      const feed = await this.parser.parseURL(source.url);
      
      return (feed.items || []).slice(0, 20).map((item, index) => {
        const article: NewsArticle = {
          id: `${source.name}-${Date.now()}-${index}`,
          title: item.title || 'Untitled',
          content: this.extractContent(item.content || item.summary || ''),
          summary: this.extractSummary(item.summary || item.content || ''),
          source: source.name,
          author: item.creator || item.author,
          publishedAt: new Date(item.pubDate || Date.now()),
          category: source.category,
          urgency: this.determineUrgency(item.title || '', item.content || ''),
          tags: this.extractTags(item.title || '', item.content || ''),
          url: item.link || '',
          imageUrl: this.extractImageUrl(item),
          readTime: this.calculateReadTime(item.content || item.summary || '')
        };

        return article;
      });
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  private extractContent(rawContent: string): string {
    // Strip HTML tags and clean up content
    return rawContent
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
      .substring(0, 2000); // Limit content length
  }

  private extractSummary(content: string): string {
    const cleaned = this.extractContent(content);
    const sentences = cleaned.split('.').filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('.') + (sentences.length > 2 ? '.' : '');
  }

  private determineUrgency(title: string, content: string): UrgencyLevel {
    const text = (title + ' ' + content).toLowerCase();
    
    const criticalKeywords = [
      'breaking', 'urgent', 'emergency', 'alert', 'disaster', 'crisis',
      'earthquake', 'tornado', 'hurricane', 'terrorist', 'explosion',
      'major incident', 'evacuation', 'lockdown'
    ];
    
    const highKeywords = [
      'developing', 'update', 'just in', 'live', 'happening now',
      'confirmed', 'official', 'announcement', 'statement'
    ];

    const mediumKeywords = [
      'important', 'significant', 'notable', 'major', 'key',
      'report', 'investigation', 'decision', 'ruling'
    ];

    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return UrgencyLevel.CRITICAL;
    }
    
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return UrgencyLevel.HIGH;
    }
    
    if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return UrgencyLevel.MEDIUM;
    }

    // Check if it's very recent (less than 2 hours old)
    const isRecent = Date.now() - new Date().getTime() < 2 * 60 * 60 * 1000;
    return isRecent ? UrgencyLevel.MEDIUM : UrgencyLevel.LOW;
  }

  private extractTags(title: string, content: string): string[] {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];

    const tagKeywords = {
      'politics': ['election', 'government', 'president', 'congress', 'senate', 'vote', 'policy'],
      'technology': ['tech', 'ai', 'artificial intelligence', 'software', 'hardware', 'digital'],
      'sports': ['game', 'team', 'player', 'score', 'championship', 'league', 'tournament'],
      'weather': ['storm', 'rain', 'snow', 'temperature', 'forecast', 'climate'],
      'business': ['market', 'stock', 'company', 'economy', 'earnings', 'revenue', 'investment'],
      'health': ['medical', 'doctor', 'hospital', 'disease', 'treatment', 'vaccine', 'health']
    };

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags.slice(0, 5); // Limit to 5 tags
  }

  private extractImageUrl(item: any): string | undefined {
    // Try different RSS image fields
    if (item['media:content']) {
      return item['media:content'].url || item['media:content'];
    }
    
    if (item['media:thumbnail']) {
      return item['media:thumbnail'].url || item['media:thumbnail'];
    }
    
    if (item.enclosure && item.enclosure.type?.startsWith('image')) {
      return item.enclosure.url;
    }

    // Extract from content
    const imgMatch = item.content?.match(/<img[^>]+src="([^"]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }

    return undefined;
  }

  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.extractContent(content).split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  async getBreakingNews(): Promise<NewsArticle[]> {
    const allNews = await this.fetchAllNews();
    return allNews.filter(article => 
      article.urgency === UrgencyLevel.CRITICAL || 
      article.urgency === UrgencyLevel.HIGH
    ).slice(0, 10);
  }

  async getNewsByCategory(category: NewsCategory): Promise<NewsArticle[]> {
    const allNews = await this.fetchAllNews();
    return allNews.filter(article => article.category === category).slice(0, 20);
  }
}