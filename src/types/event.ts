export interface Event {
  id: string;

  title: string;
  shortDescription: string;
  description: string;

  type: string;
  domain: string;

  date: string;
  time: string;
  venue: string;

  participants: number;

  status: "upcoming" | "completed";

  registrationOpen: boolean;

  color: string;

  banner: string;

  gallery: string[];

  highlights: string[];

  timeline: string[];

  speakers: {
    name: string;
    role: string;
    image: string;
  }[];
}