export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
  author: string;
  readingTime: string;
  featured: boolean;
  state?: string;
  heroImage: string;
  content: string;
}

