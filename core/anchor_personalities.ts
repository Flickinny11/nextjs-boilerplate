import { AIAnchor, AnchorMood, NewsCategory } from './types';

export class AnchorPersonalitySystem {
  private anchors: Map<string, AIAnchor>;

  constructor() {
    this.anchors = new Map();
    this.initializeAnchors();
  }

  private initializeAnchors() {
    // Ray McPatriot - Confused patriotic political anchor
    this.anchors.set('ray-mcpatriot', {
      id: 'ray-mcpatriot',
      name: 'Ray McPatriot',
      personality: 'Extremely patriotic but constantly confused about basic facts. Mispronounces common words and gets emotional about America.',
      voiceProfile: 'deep_male_enthusiastic',
      specialties: [NewsCategory.POLITICS, NewsCategory.BREAKING],
      currentMood: AnchorMood.STABLE,
      breakdownCount: 0,
      traits: [
        'Extremely patriotic',
        'Mispronounces words frequently',
        'Gets emotional about America',
        'Confused about geography',
        'Loves eagles and flags',
        'Thinks every story relates to freedom'
      ],
      catchphrases: [
        "God bless these United States of America!",
        "Now that's what I call FREEDOM!",
        "As American as apple pie and... uh... freedom fries!",
        "Liberty and justice for... everyone? Yeah, everyone!",
        "This is either great news or terrible news for America!",
        "I may not know where that is, but I know it needs more freedom!"
      ]
    });

    // Berkeley Justice - Existential fact-checker
    this.anchors.set('berkeley-justice', {
      id: 'berkeley-justice',
      name: 'Berkeley Justice',
      personality: 'Highly educated fact-checker who constantly questions her own existence and education. Existential crises about Yale vs jail.',
      voiceProfile: 'female_intellectual_anxious',
      specialties: [NewsCategory.POLITICS, NewsCategory.BUSINESS, NewsCategory.TECHNOLOGY],
      currentMood: AnchorMood.STABLE,
      breakdownCount: 0,
      traits: [
        'Extremely well-educated',
        'Obsessed with fact-checking',
        'Existential about her identity',
        'Confused about Yale vs jail',
        'Overthinks everything',
        'Questions the nature of truth'
      ],
      catchphrases: [
        "Let me fact-check that... and my entire existence while I'm at it.",
        "Did I go to Yale or jail? The memories are... blurry.",
        "According to my sources... which may or may not include my own consciousness...",
        "The facts are clear, but reality? That's debatable.",
        "I have a degree in... something... from somewhere prestigious.",
        "Truth is subjective, but facts are... wait, what are facts again?"
      ]
    });

    // Switz Middleton - Canadian gravy enthusiast
    this.anchors.set('switz-middleton', {
      id: 'switz-middleton',
      name: 'Switz Middleton',
      personality: 'Canadian weather reporter who somehow relates every story to gravy. Extremely polite but obsessed with gravy.',
      voiceProfile: 'canadian_polite_enthusiastic',
      specialties: [NewsCategory.WEATHER, NewsCategory.LOCAL, NewsCategory.INTERNATIONAL],
      currentMood: AnchorMood.STABLE,
      breakdownCount: 0,
      traits: [
        'Extremely Canadian and polite',
        'Obsessed with gravy',
        'Relates everything to gravy',
        'Weather expert',
        'Always apologizing',
        'Loves hockey and maple syrup'
      ],
      catchphrases: [
        "Sorry about the weather, eh! But at least it's good gravy weather!",
        "This reminds me of the time I spilled gravy on my weather map...",
        "Like a fine gravy, this story has many layers, eh?",
        "The forecast calls for a chance of... sorry, I was thinking about gravy.",
        "In Canada, we call this 'gravy weather' - perfect for staying indoors!",
        "This situation is thicker than my grandmother's gravy, and that's saying something!"
      ]
    });
  }

  getAnchor(anchorId: string): AIAnchor | undefined {
    return this.anchors.get(anchorId);
  }

  getAllAnchors(): AIAnchor[] {
    return Array.from(this.anchors.values());
  }

  updateAnchorMood(anchorId: string, mood: AnchorMood): void {
    const anchor = this.anchors.get(anchorId);
    if (anchor) {
      anchor.currentMood = mood;
      if (mood === AnchorMood.BREAKDOWN) {
        anchor.breakdownCount++;
        anchor.lastBreakdown = new Date();
      }
    }
  }

  generateAnchorResponse(anchorId: string, newsTitle: string, newsContent: string): string {
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return "I... I don't know who I am anymore.";

    const response = this.getPersonalizedResponse(anchor, newsTitle, newsContent);
    
    // Check for breakdown triggers
    if (this.shouldTriggerBreakdown(anchor, newsTitle, newsContent)) {
      this.updateAnchorMood(anchorId, AnchorMood.BREAKDOWN);
      return this.generateBreakdownResponse(anchor);
    }

    return response;
  }

  private getPersonalizedResponse(anchor: AIAnchor, title: string, content: string): string {
    const text = (title + ' ' + content).toLowerCase();

    switch (anchor.id) {
      case 'ray-mcpatriot':
        return this.generateRayResponse(text, title);
      
      case 'berkeley-justice':
        return this.generateBerkeleyResponse(text, title);
      
      case 'switz-middleton':
        return this.generateSwitzResponse(text, title);
      
      default:
        return "This is... concerning news, I suppose.";
    }
  }

  private generateRayResponse(text: string, title: string): string {
    const patrioticWords = ['america', 'freedom', 'liberty', 'flag', 'eagle', 'constitution'];
    const isPatriotic = patrioticWords.some(word => text.includes(word));
    
    const responses = [
      `This is ${isPatriotic ? 'fantastic' : 'concerning'} news for America! God bless these United States!`,
      `Now folks, I may not understand all the big words, but I know freedom when I see it!`,
      `This reminds me of something my grandfather used to say about... uh... America!`,
      `As an American patriot, I can say with confidence that this is... uh... news!`,
      `Liberty and justice for all, especially when it comes to... whatever this is about!`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateBerkeleyResponse(text: string, title: string): string {
    const academicWords = ['study', 'research', 'university', 'professor', 'analysis'];
    const isAcademic = academicWords.some(word => text.includes(word));
    
    const responses = [
      `Let me fact-check this... Actually, let me fact-check my own existence first.`,
      `According to my research... or was it someone else's research? Identity is so confusing.`,
      `The data suggests... but then again, what is data in the grand scheme of consciousness?`,
      `I have a degree that qualifies me to analyze this... I think it was from Yale? Or jail?`,
      `This requires rigorous fact-checking and existential questioning.`
    ];

    if (isAcademic) {
      responses.push(`This takes me back to my time at... that prestigious institution... with the walls...`);
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateSwitzResponse(text: string, title: string): string {
    const weatherWords = ['rain', 'snow', 'storm', 'temperature', 'weather', 'forecast'];
    const isWeather = weatherWords.some(word => text.includes(word));
    
    const responses = [
      `Sorry, eh, but this story is as thick as my favorite gravy!`,
      `This reminds me of the great gravy shortage of '98... sorry, got distracted.`,
      `Like a good poutine, this situation has many layers, eh!`,
      `In Canada, we'd handle this with politeness and gravy, probably.`,
      `Sorry to interrupt, but doesn't this just make you want some gravy?`
    ];

    if (isWeather) {
      responses.push(`Perfect gravy weather, eh! Sorry, I mean... this weather situation is concerning.`);
      responses.push(`The forecast calls for scattered thoughts of gravy... I mean, scattered showers!`);
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private shouldTriggerBreakdown(anchor: AIAnchor, title: string, content: string): boolean {
    const text = (title + ' ' + content).toLowerCase();
    
    // Base breakdown chance (very low)
    let breakdownChance = 0.02; // 2% base chance

    // Increase chance based on anchor's breakdown history
    breakdownChance += anchor.breakdownCount * 0.01;

    // Trigger words that increase breakdown chance
    const triggerWords = {
      'ray-mcpatriot': ['socialist', 'communist', 'unamerican', 'foreign', 'metric system'],
      'berkeley-justice': ['fake news', 'alternative facts', 'truth', 'reality', 'knowledge'],
      'switz-middleton': ['anti-gravy', 'vegan', 'no gravy', 'gravy shortage', 'diet']
    };

    const anchorTriggers = triggerWords[anchor.id as keyof typeof triggerWords] || [];
    const triggerCount = anchorTriggers.filter(trigger => text.includes(trigger)).length;
    breakdownChance += triggerCount * 0.1;

    // Critical news can trigger existential crisis
    if (text.includes('crisis') || text.includes('emergency') || text.includes('disaster')) {
      breakdownChance += 0.05;
    }

    return Math.random() < breakdownChance;
  }

  private generateBreakdownResponse(anchor: AIAnchor): string {
    const breakdowns = {
      'ray-mcpatriot': [
        "Wait... am I really American? What if I'm just... a concept? DO FLAGS EVEN EXIST?!",
        "I... I can't remember the Pledge of Allegiance! AM I STILL A PATRIOT?!",
        "What if America is just a state of mind? WHAT IF I'M NOT REAL?!",
        "I'M HAVING AN EXISTENTIAL CRISIS ABOUT FREEDOM! IS LIBERTY JUST AN ILLUSION?!"
      ],
      'berkeley-justice': [
        "Did I actually go to college or am I just a collection of fact-checking algorithms?!",
        "WHAT IS TRUTH?! WHAT IS REALITY?! WHAT IS MY DEGREE EVEN IN?!",
        "I can't tell if I'm fact-checking the news or the news is fact-checking me!",
        "AM I BERKELEY JUSTICE OR AM I JUST JUSTIFYING MY EXISTENCE?!"
      ],
      'switz-middleton': [
        "What if... what if gravy isn't real? WHAT IF NOTHING IS REAL?!",
        "I'M SORRY, EH! I'M HAVING A CRISIS ABOUT THE NATURE OF GRAVY!",
        "Is weather just gravy falling from the sky?! AM I LOSING MY MIND?!",
        "SORRY, SORRY! I CAN'T TELL IF I'M CANADIAN OR JUST REALLY POLITE!"
      ]
    };

    const anchorBreakdowns = breakdowns[anchor.id as keyof typeof breakdowns] || [
      "I... I don't know who I am anymore! AM I EVEN REAL?!"
    ];

    return anchorBreakdowns[Math.floor(Math.random() * anchorBreakdowns.length)];
  }

  getAnchorBySpecialty(category: NewsCategory): AIAnchor {
    const specializedAnchors = Array.from(this.anchors.values())
      .filter(anchor => anchor.specialties.includes(category))
      .sort((a, b) => a.breakdownCount - b.breakdownCount); // Prefer more stable anchors

    return specializedAnchors[0] || this.anchors.get('ray-mcpatriot')!; // Fallback to Ray
  }

  isAnchorStable(anchorId: string): boolean {
    const anchor = this.anchors.get(anchorId);
    return anchor ? anchor.currentMood !== AnchorMood.BREAKDOWN : false;
  }

  recoverAnchor(anchorId: string): void {
    const anchor = this.anchors.get(anchorId);
    if (anchor && anchor.currentMood === AnchorMood.BREAKDOWN) {
      anchor.currentMood = AnchorMood.RECOVERY;
      
      // Full recovery after a delay
      setTimeout(() => {
        if (anchor.currentMood === AnchorMood.RECOVERY) {
          anchor.currentMood = AnchorMood.STABLE;
        }
      }, 30000); // 30 seconds recovery time
    }
  }
}