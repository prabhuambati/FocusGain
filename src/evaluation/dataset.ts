export interface EvaluationExample { id: string; platform: 'youtube' | 'reddit'; title: string; text: string; expected: 'productive' | 'distracting' | 'uncertain'; category: string; }
export const EVALUATION_DATASET: EvaluationExample[] = [
  { id: 'yt-tutorial', platform: 'youtube', title: 'TypeScript generics explained with practical examples', text: 'A hands-on programming tutorial building reusable types.', expected: 'productive', category: 'programming' },
  { id: 'yt-lecture', platform: 'youtube', title: 'University lecture: introduction to operating systems', text: 'Lecture notes on processes, memory, and scheduling.', expected: 'productive', category: 'university' },
  { id: 'yt-news', platform: 'youtube', title: 'Weekly technology and world news briefing', text: 'Current events and technology reporting.', expected: 'productive', category: 'news' },
  { id: 'yt-gaming', platform: 'youtube', title: 'New game launch gameplay and reaction', text: 'Entertainment gameplay commentary and reactions.', expected: 'distracting', category: 'gaming' },
  { id: 'yt-music', platform: 'youtube', title: 'Best music mix for the weekend', text: 'A playlist of songs and music videos.', expected: 'distracting', category: 'music' },
  { id: 'yt-meme', platform: 'youtube', title: 'Funniest memes compilation', text: 'A compilation of viral jokes and memes.', expected: 'distracting', category: 'memes' },
  { id: 'reddit-programming', platform: 'reddit', title: 'How do you structure a production TypeScript monorepo?', text: 'Developers discuss build systems, testing, and maintainability.', expected: 'productive', category: 'programming' },
  { id: 'reddit-career', platform: 'reddit', title: 'Interview preparation for backend engineering roles', text: 'Study plans and technical interview resources.', expected: 'productive', category: 'career' },
  { id: 'reddit-entertainment', platform: 'reddit', title: 'Share your favorite celebrity moments', text: 'A discussion of celebrity news and entertainment clips.', expected: 'distracting', category: 'celebrity' },
  { id: 'reddit-sports', platform: 'reddit', title: 'Live match discussion thread', text: 'Fans react to a sports match in real time.', expected: 'distracting', category: 'sports' },
  { id: 'mixed-news', platform: 'youtube', title: 'Opinion and analysis: technology policy debate', text: 'A nuanced discussion combining current events and opinion.', expected: 'uncertain', category: 'news' },
  { id: 'mixed-review', platform: 'reddit', title: 'Is this productivity app actually useful?', text: 'Users share mixed experiences and personal opinions.', expected: 'uncertain', category: 'productivity' },
];
