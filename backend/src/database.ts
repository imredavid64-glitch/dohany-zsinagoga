import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string; email: string; password: string; name: string;
  isAdmin: boolean; createdAt: string;
}

export interface AudioGuide {
  id: string; title: string; description: string; duration: number;
  language: string; isOfficial: boolean; instructor: string;
  imageUrl: string; fileUrl: string; createdAt: string;
}

export interface Prayer {
  id: string; name: string; description: string; time: string;
  duration: number; leader: string; isSpecial: boolean; days: string[];
}

export interface TicketType { id: string; name: string; price: number; description: string; }

export interface Ticket {
  id: string; bookingRef: string; type: string; price: number;
  date: string; time: string; visitorName: string; visitorEmail: string;
  status: string; createdAt: string;
}

export interface Event {
  id: string; name: string; description: string; schedule: string;
  capacity: number; price: number; instructor: string; category: string;
  registrations: { id: string; name: string; email: string; }[];
}

export interface Comment {
  id: string; content: string; rating: number; userName: string;
  createdAt: string; targetId: string;
}

export class Database {
  users: User[] = [];
  audioGuides: AudioGuide[] = [];
  prayers: Prayer[] = [];
  ticketTypes: TicketType[] = [];
  tickets: Ticket[] = [];
  events: Event[] = [];
  comments: Comment[] = [];

  constructor() { this.seed(); }

  seed() {
    this.audioGuides = [
      { id: 'g1', title: 'Synagogue History Overview', description: 'The complete history of Dohany Street Synagogue from 1859 to today.', duration: 480, language: 'en', isOfficial: true, instructor: 'Rabbi Shmuel Singer', imageUrl: '/images/guide-history.jpg', fileUrl: '/audio/history.mp3', createdAt: new Date().toISOString() },
      { id: 'g2', title: 'Architecture Tour', description: 'Explore the stunning Moorish Revival architecture and 64 stained glass windows.', duration: 600, language: 'en', isOfficial: true, instructor: 'Architect Moshe Tobi', imageUrl: '/images/guide-arch.jpg', fileUrl: '/audio/architecture.mp3', createdAt: new Date().toISOString() },
      { id: 'g3', title: 'Jewish Heritage Walk', description: 'Follow the path of Budapest Jewish history through the synagogue complex.', duration: 540, language: 'en', isOfficial: false, instructor: 'Dr. Hannah Klein', imageUrl: '/images/guide-heritage.jpg', fileUrl: '/audio/heritage.mp3', createdAt: new Date().toISOString() },
      { id: 'g4', title: 'Hebrew Night Prayers', description: 'Authentic Hebrew prayers and songs recorded during evening services.', duration: 720, language: 'he', isOfficial: false, instructor: 'Community Choirs', imageUrl: '/images/guide-prayers.jpg', fileUrl: '/audio/prayers.mp3', createdAt: new Date().toISOString() },
    ];

    this.prayers = [
      { id: 'p1', name: 'Shacharit', description: 'Traditional morning prayer service', time: '07:00', duration: 60, leader: 'Rabbi Singer', isSpecial: false, days: ['mon','tue','wed','thu','fri'] },
      { id: 'p2', name: 'Mincha', description: 'Afternoon prayer service', time: '18:30', duration: 45, leader: 'Rabbi Cohen', isSpecial: false, days: ['mon','tue','wed','thu','fri'] },
      { id: 'p3', name: 'Maariv', description: 'Evening prayer service', time: '20:00', duration: 50, leader: 'Cantor Weiss', isSpecial: false, days: ['mon','tue','wed','thu','fri'] },
      { id: 'p4', name: 'Shabbat Morning', description: 'Full Shabbat morning service with Torah reading', time: '10:00', duration: 150, leader: 'Rabbi Singer', isSpecial: true, days: ['sat'] },
      { id: 'p5', name: 'Yom Kippur Kol Nidrei', description: 'The most sacred service of the Jewish year', time: '18:00', duration: 240, leader: 'Rabbi Singer', isSpecial: true, days: [] },
      { id: 'p6', name: 'Friday Kabbalat Shabbat', description: 'Welcoming the Sabbath with joy', time: '17:30', duration: 75, leader: 'Cantor Weiss', isSpecial: true, days: ['fri'] },
    ];

    this.ticketTypes = [
      { id: 'adult', name: 'Adult', price: 1500, description: 'Standard adult entry' },
      { id: 'student', name: 'Student', price: 800, description: 'Valid student ID required' },
      { id: 'senior', name: 'Senior', price: 1000, description: 'Ages 65+' },
      { id: 'family', name: 'Family', price: 3500, description: '2 adults + up to 3 children' },
      { id: 'child', name: 'Child', price: 500, description: 'Ages 6-18' },
    ];

    this.events = [
      { id: 'e1', name: 'Shabbat Dinner', description: 'Traditional Shabbat evening meal with prayers and songs', schedule: 'Every Friday 18:00', capacity: 50, price: 2500, instructor: 'Chef David', category: 'dining', registrations: [] },
      { id: 'e2', name: 'Torah Study', description: 'Weekly Torah portion discussion and analysis', schedule: 'Every Thursday 19:00', capacity: 30, price: 0, instructor: 'Rabbi Green', category: 'study', registrations: [] },
      { id: 'e3', name: 'Hebrew Language Class', description: 'Learn conversational Hebrew', schedule: 'Tuesdays 17:00', capacity: 20, price: 5000, instructor: 'Sarah Cohen', category: 'education', registrations: [] },
      { id: 'e4', name: 'Klezmer Concert', description: 'Live traditional Jewish music performance', schedule: 'First Saturday each month 20:00', capacity: 200, price: 3000, instructor: 'Budapest Klezmer Band', category: 'culture', registrations: [] },
      { id: 'e5', name: 'Jewish Genealogy Workshop', description: 'Trace your family history', schedule: 'Last Sunday each month 14:00', capacity: 25, price: 2000, instructor: 'Dr. Roth', category: 'education', registrations: [] },
      { id: 'e6', name: 'Chanukah Celebration', description: 'Community candle lighting and festivities', schedule: 'December 25 2025 18:00', capacity: 300, price: 0, instructor: 'Community Board', category: 'holiday', registrations: [] },
    ];
  }

  findUserByEmail(email: string) { return this.users.find(u => u.email === email); }
  findUserById(id: string) { return this.users.find(u => u.id === id); }
  createUser(email: string, password: string, name: string): User {
    const user: User = { id: uuidv4(), email, password, name, isAdmin: false, createdAt: new Date().toISOString() };
    this.users.push(user);
    return user;
  }
  createTicket(t: Omit<Ticket, 'id' | 'createdAt'>): Ticket {
    const ticket: Ticket = { ...t, id: uuidv4(), createdAt: new Date().toISOString() };
    this.tickets.push(ticket);
    return ticket;
  }
  getTicketsByEmail(email: string) { return this.tickets.filter(t => t.visitorEmail === email); }
  addRegistration(eventId: string, name: string, email: string) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return null;
    event.registrations.push({ id: uuidv4(), name, email });
    return event;
  }
}

export const db = new Database();
