export type Category = 'All' | 'AI' | 'Backend' | 'Frontend' | 'Data' | 'Infra' | 'Mobile' | 'Security'

export interface Source {
  id: string
  name: string
  avatarUrl?: string
}

export interface FeedItem {
  id: string
  title: string
  excerpt: string
  url: string
  publishedAt: string
  source: Source
  tags: Category[]
  readingMinutes: number
  isNew?: boolean
  isBookmarked?: boolean
}
