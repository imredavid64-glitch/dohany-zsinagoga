import { createContext, useContext, useEffect, useState } from 'react';

export type Lang = 'hu' | 'en';

const hu: Record<string, string> = {
  // Language
  langName: 'Magyar',
  langOther: 'EN',

  // Header nav
  'nav.home': 'Kezdőlap',
  'nav.guides': 'Audiokalauzok',
  'nav.prayers': 'Imádságok',
  'nav.tickets': 'Jegyek',
  'nav.events': 'Programok',
  'nav.about': 'Rólunk',
  admin: 'Admin',
  logout: 'Kijelentkezés',
  signIn: 'Bejelentkezés',

  // Hero
  'hero.tagline': 'Európa legnagyobb zsinagógája',
  'hero.welcome': 'Üdvözöljük a csodálatos Dohány utcai zsinagógában, a zsidó örökség élő emlékművében Budapest szívében, 1859 óta. Ismerje meg gazdag történelmünket, csatlakozzon imáinkhoz, vagy foglalja le látogatását, hogy megtapasztalja ezt az építészeti remekművet.',
  'hero.bookTickets': 'Jegyfoglalás',
  'hero.audioGuides': 'Audiokalauzok',

  // Features
  'feat.guides': 'Audiokalauzok',
  'feat.guides.desc': 'Fedezze fel a zsinagógát autentikus audiokalauzokkal',
  'feat.prayers': 'Imarend',
  'feat.prayers.desc': 'Csatlakozzon napi és sábáti istentiszteleteinkhez',
  'feat.visit': 'Látogatás foglalása',
  'feat.visit.desc': 'Foglaljon jegyet egy felejthetetlen élményhez',
  learnMore: 'Tudjon meg többet',

  // Home sections
  featuredGuides: 'Kiemelt audiokalauzok',
  viewAllGuides: 'Összes kalauz megtekintése',
  todaysPrayers: 'Mai imaidőpontok',
  fullSchedule: 'Teljes imarend',
  upcomingEvents: 'Közelgő programok',
  allEvents: 'Minden program',
  duration: '{min} perc',

  // Audio guides
  'guides.title': 'Audiokalauzok',
  'guides.subtitle': 'Fedezze fel a zsinagógát autentikus audiokalauzokkal.',
  'guides.officialNote': 'A gyülekezet által jóváhagyott hivatalos kalauzok',
  all: 'Mind',
  official: 'Hivatalos',
  hebrew: 'Héber',
  backToGuides: 'Vissza a kalauzokhoz',
  hebrewLang: 'Héber',
  englishLang: 'Angol',
  officialBadge: 'Hivatalos',
  communityBadge: 'Közösségi',
  audioPlayer: 'Lejátszó',
  playPreview: 'Előnézet lejátszása',
  download: 'Letöltés',

  // Prayers
  'prayers.title': 'Imarend',
  'prayers.subtitle': 'Csatlakozzon közösségünkhöz napi és sábáti istentiszteleteken',
  shabbat: 'Sábát',
  special: 'Különleges',
  'day.mon': 'Hétfő',
  'day.tue': 'Kedd',
  'day.wed': 'Szerda',
  'day.thu': 'Csütörtök',
  'day.fri': 'Péntek',
  'day.sat': 'Szombat',
  'day.sun': 'Vasárnap',

  // Tickets
  'tickets.title': 'Látogatás foglalása',
  'tickets.subtitle': 'Válasszon a rendelkezésre álló jegyfajták közül',
  myBookings: 'Foglalásaim',
  back: 'Vissza',
  visitDate: 'Látogatás dátuma',
  time: 'Időpont',
  quantity: 'Mennyiség',
  total: 'Összesen',
  confirmBooking: 'Foglalás megerősítése',
  reserveVisit: 'Foglalja le látogatását',
  ticketSuffix: 'jegy',
  statusConfirmed: 'Megerősítve',
  statusPending: 'Függőben',
  bookSignIn: 'A jegyfoglaláshoz kérjük, jelentkezzen be',
  bookingConfirmed: 'Foglalás visszaigazolva!',
  reference: 'Referencia',
  bookingFailed: 'A foglalás nem sikerült. Kérjük, próbálja újra.',
  dateAtTime: '{date} {time}',
  // Ticket type names (from backend ids)
  'ticket.adult': 'Felnőtt',
  'ticket.student': 'Diák',
  'ticket.senior': 'Idős',
  'ticket.family': 'Családi',
  'ticket.child': 'Gyermek',

  // Events
  'events.title': 'Programok és események',
  'events.subtitle': 'Fedezze fel a zsidó életet a zsinagógában',
  'cat.all': 'Minden program',
  'cat.study': 'Tanulás',
  'cat.culture': 'Kultúra',
  'cat.dining': 'Étkezés',
  'cat.holiday': 'Ünnepek',
  'cat.education': 'Oktatás',
  registerNow: 'Jelentkezés',
  free: 'Ingyenes',
  attendees: 'Regisztrált résztvevők ({count}/{capacity})',
  noRegistrations: 'Még nincs jelentkező. Legyen Ön az első!',
  registerSignIn: 'A jelentkezéshez kérjük, jelentkezzen be',
  yourName: 'Az Ön neve:',
  yourEmail: 'Az Ön e-mail címe:',
  registrationFailed: 'A regisztráció nem sikerült',
  registered: 'Sikeres jelentkezés!',

  // About
  'about.visitorComments': 'Látogatói vélemények',
  'about.shareExperience': 'Ossza meg élményét a zsinagógában',
  'about.placeholder': 'Ossza meg élményét...',
  post: 'Közzététel',
  'about.signInToComment': 'A véleményezéshez kérjük, jelentkezzen be',
  'about.noComments': 'Még nincs vélemény. Legyen Ön az első!',
  builtIn: 'Épült {year} · {style} · Férőhely: {capacity}',
  highlights: 'Látnivalók',
  location: 'Elhelyezkedés',
  contact: 'Kapcsolat',
  phone: 'Telefon',
  email: 'E-mail',

  // Auth
  'auth.signIn': 'Bejelentkezés',
  'auth.register': 'Regisztráció',
  'auth.createAccount': 'Fiók létrehozása',
  'auth.welcome': 'Üdvözöljük a Dohány utcai zsinagógában',
  'auth.fullName': 'Teljes név',
  'auth.email': 'E-mail',
  'auth.password': 'Jelszó',
  'auth.namePlaceholder': 'Az Ön neve',
  'auth.emailPlaceholder': 'you@example.com',
  'auth.passwordPlaceholder': 'Legalább 6 karakter',
  authFailed: 'Sikertelen hitelesítés',

  // Footer
  'footer.privacy': 'Adatvédelem',
  'footer.terms': 'Felhasználási feltételek',
  'footer.contact': 'Kapcsolat',
  'footer.rights': 'Dohány utcai zsinagóga. Minden jog fenntartva.',
};

const en: Record<string, string> = {
  // Language
  langName: 'English',
  langOther: 'HU',

  // Header nav
  'nav.home': 'Home',
  'nav.guides': 'Audio Guides',
  'nav.prayers': 'Prayers',
  'nav.tickets': 'Tickets',
  'nav.events': 'Events',
  'nav.about': 'About',
  admin: 'Admin',
  logout: 'Logout',
  signIn: 'Sign In',

  // Hero
  'hero.tagline': 'The Largest Synagogue in Europe',
  'hero.welcome': 'Welcome to the magnificent Dohány Street Synagogue, a living monument of Jewish heritage in the heart of Budapest since 1859. Explore our rich history, join us for prayer, or book a visit to experience this architectural masterpiece.',
  'hero.bookTickets': 'Book Tickets',
  'hero.audioGuides': 'Audio Guides',

  // Features
  'feat.guides': 'Audio Guides',
  'feat.guides.desc': 'Explore with authentic audio guides in multiple languages',
  'feat.prayers': 'Prayer Schedule',
  'feat.prayers.desc': 'Join our daily and Shabbat services with the community',
  'feat.visit': 'Book a Visit',
  'feat.visit.desc': 'Reserve your tickets for a memorable experience',
  learnMore: 'Learn more',

  // Home sections
  featuredGuides: 'Featured Audio Guides',
  viewAllGuides: 'View All Guides',
  todaysPrayers: "Today's Prayer Times",
  fullSchedule: 'Full Schedule',
  upcomingEvents: 'Upcoming Events',
  allEvents: 'All Events',
  duration: '{min} min',

  // Audio guides
  'guides.title': 'Audio Guides',
  'guides.subtitle': 'Explore the synagogue with authentic audio guides.',
  'guides.officialNote': 'Official guides approved by the congregation',
  all: 'All',
  official: 'Official',
  hebrew: 'Hebrew',
  backToGuides: 'Back to guides',
  hebrewLang: 'Hebrew',
  englishLang: 'English',
  officialBadge: 'Official',
  communityBadge: 'Community',
  audioPlayer: 'Audio Player',
  playPreview: 'Play Preview',
  download: 'Download',

  // Prayers
  'prayers.title': 'Prayer Schedule',
  'prayers.subtitle': 'Join our community for daily and Shabbat services',
  shabbat: 'Shabbat',
  special: 'Special',
  'day.mon': 'Monday',
  'day.tue': 'Tuesday',
  'day.wed': 'Wednesday',
  'day.thu': 'Thursday',
  'day.fri': 'Friday',
  'day.sat': 'Saturday',
  'day.sun': 'Sunday',

  // Tickets
  'tickets.title': 'Book Your Visit',
  'tickets.subtitle': 'Choose from our available ticket types',
  myBookings: 'My Bookings',
  back: 'Back',
  visitDate: 'Visit Date',
  time: 'Time',
  quantity: 'Quantity',
  total: 'Total',
  confirmBooking: 'Confirm Booking',
  reserveVisit: 'Reserve your visit',
  ticketSuffix: 'Ticket',
  statusConfirmed: 'confirmed',
  statusPending: 'pending',
  bookSignIn: 'Please sign in to book tickets',
  bookingConfirmed: 'Booking confirmed!',
  reference: 'Reference',
  bookingFailed: 'Booking failed. Please try again.',
  dateAtTime: '{date} at {time}',
  'ticket.adult': 'Adult',
  'ticket.student': 'Student',
  'ticket.senior': 'Senior',
  'ticket.family': 'Family',
  'ticket.child': 'Child',

  // Events
  'events.title': 'Events & Activities',
  'events.subtitle': 'Discover Jewish life at the synagogue',
  'cat.all': 'All Events',
  'cat.study': 'Study',
  'cat.culture': 'Culture',
  'cat.dining': 'Dining',
  'cat.holiday': 'Holidays',
  'cat.education': 'Education',
  registerNow: 'Register Now',
  free: 'Free',
  attendees: 'Registered Attendees ({count}/{capacity})',
  noRegistrations: 'No registrations yet. Be the first!',
  registerSignIn: 'Please sign in to register',
  yourName: 'Your name:',
  yourEmail: 'Your email:',
  registrationFailed: 'Registration failed',
  registered: 'Registered!',

  // About
  'about.visitorComments': 'Visitor Comments',
  'about.shareExperience': 'Share your experience at the synagogue',
  'about.placeholder': 'Share your experience...',
  post: 'Post',
  'about.signInToComment': 'Please sign in to comment',
  'about.noComments': 'No comments yet. Be the first to share!',
  builtIn: 'Built in {year} · {style} · Capacity: {capacity}',
  highlights: 'Highlights',
  location: 'Location',
  contact: 'Contact',
  phone: 'Phone',
  email: 'Email',

  // Auth
  'auth.signIn': 'Sign In',
  'auth.register': 'Register',
  'auth.createAccount': 'Create Account',
  'auth.welcome': 'Welcome to Dohány Utcai Zsinagóga',
  'auth.fullName': 'Full Name',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.namePlaceholder': 'Your name',
  'auth.emailPlaceholder': 'you@example.com',
  'auth.passwordPlaceholder': 'Min 6 characters',
  authFailed: 'Authentication failed',

  // Footer
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms',
  'footer.contact': 'Contact',
  'footer.rights': 'Dohány Utcai Zsinagóga. All rights reserved.',
};

type Dict = Record<string, string>;

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('lang');
    return saved === 'en' || saved === 'hu' ? saved : 'hu';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'hu' ? 'hu' : 'en';
  }, [lang]);

  const dict: Dict = lang === 'hu' ? hu : en;

  const t = (key: string, vars?: Record<string, string | number>): string => {
    let s = dict[key] ?? en[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        s = s.replace(`{${k}}`, String(v));
      });
    }
    return s;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, toggle: () => setLang(lang === 'hu' ? 'en' : 'hu'), t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
