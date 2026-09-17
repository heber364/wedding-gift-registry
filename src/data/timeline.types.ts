export interface TimelineEvent {
  id: string;
  year: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  location?: string;
  image?: string;
}
