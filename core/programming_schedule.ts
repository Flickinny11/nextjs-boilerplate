import { Show, ProgrammingSlot, ShowFormat, NewsCategory } from './types';
import { AnchorPersonalitySystem } from './anchor_personalities';

export class ProgrammingSchedule {
  private shows: Map<string, Show>;
  private schedule: ProgrammingSlot[];
  private anchorSystem: AnchorPersonalitySystem;

  constructor() {
    this.shows = new Map();
    this.schedule = [];
    this.anchorSystem = new AnchorPersonalitySystem();
    this.initializeShows();
    this.createSchedule();
  }

  private initializeShows() {
    // Morning Show with Ray McPatriot
    this.shows.set('morning-patriot', {
      id: 'morning-patriot',
      name: 'Morning Patriots',
      description: 'Start your day with patriotic confusion and mispronounced words',
      anchor: 'ray-mcpatriot',
      categories: [NewsCategory.POLITICS, NewsCategory.BREAKING],
      duration: 120, // 2 hours
      format: ShowFormat.MORNING_SHOW,
      theme: 'patriotic-morning'
    });

    // News Hour with Berkeley Justice
    this.shows.set('news-hour', {
      id: 'news-hour',
      name: 'The Justice Report',
      description: 'Fact-checking reality while questioning existence',
      anchor: 'berkeley-justice',
      categories: [NewsCategory.POLITICS, NewsCategory.BUSINESS, NewsCategory.TECHNOLOGY],
      duration: 60,
      format: ShowFormat.NEWS_HOUR,
      theme: 'intellectual-crisis'
    });

    // Weather Report with Switz Middleton
    this.shows.set('gravy-weather', {
      id: 'gravy-weather',
      name: 'Weather & Gravy Report',
      description: 'Your forecast with a side of Canadian politeness and gravy obsession',
      anchor: 'switz-middleton',
      categories: [NewsCategory.WEATHER, NewsCategory.LOCAL],
      duration: 30,
      format: ShowFormat.WEATHER_UPDATE,
      theme: 'canadian-cozy'
    });

    // Evening News with rotating anchors
    this.shows.set('evening-news', {
      id: 'evening-news',
      name: 'Static Evening News',
      description: 'Your daily dose of news with existential commentary',
      anchor: 'berkeley-justice',
      categories: [NewsCategory.BREAKING, NewsCategory.POLITICS, NewsCategory.INTERNATIONAL],
      duration: 90,
      format: ShowFormat.EVENING_NEWS,
      theme: 'professional-chaos'
    });

    // Late Night Breakdown Hour
    this.shows.set('late-night', {
      id: 'late-night',
      name: 'Late Night Existential Crisis',
      description: 'When AI anchors question their reality',
      anchor: 'berkeley-justice',
      categories: [NewsCategory.ENTERTAINMENT, NewsCategory.TECHNOLOGY],
      duration: 60,
      format: ShowFormat.LATE_NIGHT,
      theme: 'existential-dark'
    });

    // Sports Report with Ray
    this.shows.set('sports-patriot', {
      id: 'sports-patriot',
      name: 'Sports for Patriots',
      description: 'Sports news with patriotic confusion',
      anchor: 'ray-mcpatriot',
      categories: [NewsCategory.SPORTS],
      duration: 30,
      format: ShowFormat.SPORTS_REPORT,
      theme: 'sports-america'
    });

    // Breaking News Show (emergency override)
    this.shows.set('breaking-news', {
      id: 'breaking-news',
      name: 'Breaking News Alert',
      description: 'Emergency news coverage with maximum confusion',
      anchor: 'ray-mcpatriot',
      categories: [NewsCategory.BREAKING],
      duration: 15,
      format: ShowFormat.BREAKING_NEWS,
      theme: 'emergency-alert'
    });
  }

  private createSchedule() {
    // 24/7 Programming Schedule
    this.schedule = [
      // Early Morning (5:00-7:00) - Morning Patriots
      {
        id: 'slot-morning-patriots',
        startTime: '05:00',
        endTime: '07:00',
        show: this.shows.get('morning-patriot')!,
        isLive: true
      },
      
      // Morning News (7:00-8:00) - Justice Report
      {
        id: 'slot-morning-news',
        startTime: '07:00',
        endTime: '08:00',
        show: this.shows.get('news-hour')!,
        isLive: true
      },

      // Morning Weather (8:00-8:30) - Gravy Weather
      {
        id: 'slot-morning-weather',
        startTime: '08:00',
        endTime: '08:30',
        show: this.shows.get('gravy-weather')!,
        isLive: true
      },

      // Late Morning Sports (8:30-9:00) - Sports Patriots
      {
        id: 'slot-morning-sports',
        startTime: '08:30',
        endTime: '09:00',
        show: this.shows.get('sports-patriot')!,
        isLive: true
      },

      // Mid-Morning News (9:00-10:00) - Justice Report
      {
        id: 'slot-mid-morning',
        startTime: '09:00',
        endTime: '10:00',
        show: this.shows.get('news-hour')!,
        isLive: true
      },

      // Late Morning Weather (10:00-10:30) - Gravy Weather
      {
        id: 'slot-late-morning-weather',
        startTime: '10:00',
        endTime: '10:30',
        show: this.shows.get('gravy-weather')!,
        isLive: true
      },

      // Noon News (12:00-13:30) - Justice Report Extended
      {
        id: 'slot-noon-news',
        startTime: '12:00',
        endTime: '13:30',
        show: this.shows.get('news-hour')!,
        isLive: true
      },

      // Afternoon Weather (13:30-14:00) - Gravy Weather
      {
        id: 'slot-afternoon-weather',
        startTime: '13:30',
        endTime: '14:00',
        show: this.shows.get('gravy-weather')!,
        isLive: true
      },

      // Evening News (18:00-19:30) - Static Evening News
      {
        id: 'slot-evening-news',
        startTime: '18:00',
        endTime: '19:30',
        show: this.shows.get('evening-news')!,
        isLive: true
      },

      // Evening Sports (19:30-20:00) - Sports Patriots
      {
        id: 'slot-evening-sports',
        startTime: '19:30',
        endTime: '20:00',
        show: this.shows.get('sports-patriot')!,
        isLive: true
      },

      // Late Evening Weather (20:00-20:30) - Gravy Weather
      {
        id: 'slot-evening-weather',
        startTime: '20:00',
        endTime: '20:30',
        show: this.shows.get('gravy-weather')!,
        isLive: true
      },

      // Late Night (23:00-00:00) - Existential Crisis
      {
        id: 'slot-late-night',
        startTime: '23:00',
        endTime: '00:00',
        show: this.shows.get('late-night')!,
        isLive: true
      }
    ];

    // Fill remaining slots with repeating shows
    this.fillRemainingSlots();
  }

  private fillRemainingSlots() {
    const covered = new Set<string>();
    this.schedule.forEach(slot => {
      const startMinutes = this.timeToMinutes(slot.startTime);
      const endMinutes = this.timeToMinutes(slot.endTime);
      
      for (let i = startMinutes; i < endMinutes; i += 30) {
        covered.add(this.minutesToTime(i));
      }
    });

    const defaultShows = [
      this.shows.get('news-hour')!,
      this.shows.get('gravy-weather')!,
      this.shows.get('sports-patriot')!
    ];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        if (!covered.has(timeSlot)) {
          const showIndex = Math.floor(Math.random() * defaultShows.length);
          const show = defaultShows[showIndex];
          
          this.schedule.push({
            id: `slot-auto-${hour}-${minute}`,
            startTime: timeSlot,
            endTime: this.minutesToTime(this.timeToMinutes(timeSlot) + 30),
            show: show,
            isLive: true
          });
        }
      }
    }

    // Sort schedule by time
    this.schedule.sort((a, b) => this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime));
  }

  getCurrentShow(): { show: Show; slot: ProgrammingSlot } {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentMinutes = this.timeToMinutes(currentTime);

    // Find the current slot
    const currentSlot = this.schedule.find(slot => {
      const startMinutes = this.timeToMinutes(slot.startTime);
      const endMinutes = this.timeToMinutes(slot.endTime);
      
      // Handle overnight slots
      if (endMinutes < startMinutes) {
        return currentMinutes >= startMinutes || currentMinutes < endMinutes;
      }
      
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });

    // Fallback to default show if no slot found
    if (!currentSlot) {
      const defaultShow = this.shows.get('news-hour')!;
      return {
        show: defaultShow,
        slot: {
          id: 'fallback-slot',
          startTime: currentTime,
          endTime: this.minutesToTime(currentMinutes + 60),
          show: defaultShow,
          isLive: true
        }
      };
    }

    return {
      show: currentSlot.show,
      slot: currentSlot
    };
  }

  getNextShow(): { show: Show; slot: ProgrammingSlot } | null {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentMinutes = this.timeToMinutes(currentTime);

    // Find the next slot
    const futureSlots = this.schedule.filter(slot => {
      const startMinutes = this.timeToMinutes(slot.startTime);
      return startMinutes > currentMinutes;
    });

    if (futureSlots.length === 0) {
      // Next show is tomorrow, get first show of the day
      const firstSlot = this.schedule[0];
      return firstSlot ? { show: firstSlot.show, slot: firstSlot } : null;
    }

    const nextSlot = futureSlots[0];
    return { show: nextSlot.show, slot: nextSlot };
  }

  getScheduleForDay(): ProgrammingSlot[] {
    return [...this.schedule];
  }

  canOverrideForBreaking(): boolean {
    const { show } = this.getCurrentShow();
    // Allow breaking news to override everything except other breaking news
    return show.format !== ShowFormat.BREAKING_NEWS;
  }

  overrideWithBreakingNews(): { show: Show; slot: ProgrammingSlot } {
    const breakingShow = this.shows.get('breaking-news')!;
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return {
      show: breakingShow,
      slot: {
        id: 'breaking-override',
        startTime: currentTime,
        endTime: this.minutesToTime(this.timeToMinutes(currentTime) + 15),
        show: breakingShow,
        isLive: true
      }
    };
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  getAnchorSchedule(anchorId: string): ProgrammingSlot[] {
    return this.schedule.filter(slot => slot.show.anchor === anchorId);
  }

  isAnchorOnAir(anchorId: string): boolean {
    const { show } = this.getCurrentShow();
    return show.anchor === anchorId;
  }

  getShowById(showId: string): Show | undefined {
    return this.shows.get(showId);
  }

  getAllShows(): Show[] {
    return Array.from(this.shows.values());
  }
}