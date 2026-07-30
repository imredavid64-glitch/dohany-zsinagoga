import { useState, useEffect } from 'react';
import { api } from './api';

// Star of David and Jewish symbols
const STAR = '\u2721';
const SHALOM_HE = '\u05E9\u05B8\u05DC\u05D5\u05B9\u05DD';

type Page = 'home' | 'guides' | 'prayers' | 'tickets' | 'events' | 'about';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (token) api.me().then(setUser).catch(() => { localStorage.removeItem('token'); setToken(null); });
    else setUser(null);
  }, [token]);

  const handleAuth = async (email: string, password: string, name?: string) => {
    try {
      const res = name ? await api.register(email, password, name) : await api.login(email, password);
      if (res.token) { localStorage.setItem('token', res.token); setToken(res.token); setShowAuth(false); }
    } catch { alert('Authentication failed'); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(196,154,60,0.03) 2px, transparent 0)', backgroundSize: '50px 50px'}}>
      <Header page={page} setPage={setPage} user={user} onAuth={() => setShowAuth(true)} onLogout={() => { localStorage.removeItem('token'); setToken(null); setUser(null); }} />

      <main className="flex-1">
        {page === 'home' && <HomePage setPage={setPage} />}
        {page === 'guides' && <AudioGuidesPage />}
        {page === 'prayers' && <PrayersPage />}
        {page === 'tickets' && <TicketsPage user={user} />}
        {page === 'events' && <EventsPage user={user} />}
        {page === 'about' && <AboutPage />}
      </main>

      <Footer />

      {showAuth && <AuthModal tab={authTab} setTab={setAuthTab} onSubmit={handleAuth} onClose={() => setShowAuth(false)} />}
    </div>
  );
}

// ========== HEADER ==========
function Header({ page, setPage, user, onAuth, onLogout }: any) {
  const links: { label: string; key: Page }[] = [
    { label: 'Home', key: 'home' },
    { label: 'Audio Guides', key: 'guides' },
    { label: 'Prayers', key: 'prayers' },
    { label: 'Tickets', key: 'tickets' },
    { label: 'Events', key: 'events' },
    { label: 'About', key: 'about' },
  ];

  return (
    <header className="bg-navy-900 text-white shadow-lg" style={{backgroundImage: 'linear-gradient(135deg, #0f1a2e 0%, #1a2744 50%, #0f1a2e 100%)'}}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => setPage('home')} className="flex items-center gap-3 hover:opacity-90 group">
            <span className="text-gold-400 text-xl group-hover:scale-110 transition-transform">{STAR}</span>
            <span className="font-serif text-xl font-bold tracking-tight">Dohány Utcai Zsinagóga</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button key={l.key} onClick={() => setPage(l.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  page === l.key ? 'bg-gold-500 text-white' : 'hover:bg-navy-800'
                }`}>{l.label}</button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">{user.name}</span>
                {user.isAdmin && <span className="text-xs bg-gold-500 text-white px-2 py-0.5 rounded-full">{STAR} Admin</span>}
                <button onClick={onLogout} className="text-sm text-gray-400 hover:text-white">Logout</button>
              </div>
            ) : (
              <button onClick={onAuth} className="btn-gold text-sm !py-1.5 !px-4">{STAR} Sign In</button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden flex gap-1 pb-3 overflow-x-auto">
          {links.map(l => (
            <button key={l.key} onClick={() => setPage(l.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                page === l.key ? 'bg-gold-500 text-white' : 'text-gray-300 hover:bg-navy-800'
              }`}>{l.label}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ========== HOME ==========
function HomePage({ setPage }: any) {
  const [guides, setGuides] = useState<any[]>([]);
  const [prayers, setPrayers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    api.getAudioGuides(true).then(d => setGuides(Array.isArray(d) ? d.slice(0, 3) : []));
    api.getPrayers().then(d => setPrayers(Array.isArray(d) ? d.filter((p: any) => !p.isSpecial).slice(0, 3) : []));
    api.getEvents().then(d => setEvents(Array.isArray(d) ? d.slice(0, 3) : []));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="text-white py-16 md:py-24 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #0f1a2e 0%, #1a2744 50%, #142142 100%)'}}>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 5 L37 22 L55 22 L40 33 L45 50 L30 40 L15 50 L20 33 L5 22 L23 22 Z\' fill=\'%23ffffff\'/%3E%3C/svg%3E")', backgroundSize: '60px 60px'}}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="text-gold-400 text-5xl mb-4 opacity-80">{STAR}</div>
          <p className="text-gold-400 font-serif text-lg mb-2 tracking-widest">{SHALOM_HE}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Dohány Utcai Zsinagóga</h1>
          <p className="text-xl text-gold-400 font-serif mb-6">The Largest Synagogue in Europe</p>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Welcome to the magnificent Dohány Street Synagogue, a living monument of Jewish heritage
            in the heart of Budapest since 1859. Explore our rich history, join us for prayer,
            or book a visit to experience this architectural masterpiece.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setPage('tickets')} className="btn-gold !text-base !px-8 !py-3">{STAR} Book Tickets</button>
            <button onClick={() => setPage('guides')} className="btn !text-base !px-8 !py-3 border-2 border-white text-white hover:bg-white hover:text-navy-900">Audio Guides</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard icon={STAR} title="Audio Guides" desc="Explore with authentic audio guides in multiple languages" action={() => setPage('guides')} />
          <FeatureCard icon={STAR} title="Prayer Schedule" desc="Join our daily and Shabbat services with the community" action={() => setPage('prayers')} />
          <FeatureCard icon={STAR} title="Book a Visit" desc="Reserve your tickets for a memorable experience" action={() => setPage('tickets')} />
        </div>
      </section>

      {/* Featured Guides */}
      {guides.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">Featured Audio Guides</h2>
            <p className="text-gold-600 text-center text-sm mb-10">{STAR} {STAR} {STAR}</p>
            <div className="grid md:grid-cols-3 gap-8">
              {guides.map(g => <GuideCard key={g.id} guide={g} />)}
            </div>
            <div className="text-center mt-8">
              <button onClick={() => setPage('guides')} className="btn-outline">View All Guides</button>
            </div>
          </div>
        </section>
      )}

      {/* Prayer Times */}
      <section className="py-16" style={{background: 'linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%)'}}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-2">Today's Prayer Times</h2>
          <p className="text-gold-600 text-center text-sm mb-10">{STAR} {STAR} {STAR}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {prayers.map(p => (
              <div key={p.id} className="card p-6 text-center hover:-translate-y-1 transition-all">
                <div className="text-gold-500 text-3xl mb-2">{STAR}</div>
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-2xl font-serif font-bold text-navy-800 my-2">{p.time}</p>
                <p className="text-gray-600 text-sm">{p.duration} min &middot; {p.leader}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setPage('prayers')} className="btn-outline">Full Schedule</button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-center mb-2">Upcoming Events</h2>
            <p className="text-gold-600 text-center text-sm mb-10">{STAR} {STAR} {STAR}</p>
            <div className="grid md:grid-cols-3 gap-8">
              {events.map(e => <EventCard key={e.id} event={e} />)}
            </div>
            <div className="text-center mt-8">
              <button onClick={() => setPage('events')} className="btn-outline">All Events</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc, action }: any) {
  return (
    <div className="card p-8 text-center hover:-translate-y-1 transition-transform group">
      <div className="text-4xl mb-4 text-gold-500 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{desc}</p>
      <button onClick={action} className="text-gold-600 font-medium hover:underline">Learn more &rarr;</button>
    </div>
  );
}

// ========== AUDIO GUIDES ==========
function AudioGuidesPage() {
  const [guides, setGuides] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const official = filter === 'official' ? true : undefined;
    const lang = filter === 'hebrew' ? 'he' : undefined;
    api.getAudioGuides(official, lang).then(d => setGuides(Array.isArray(d) ? d : []));
  }, [filter]);

  if (selected) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => setSelected(null)} className="text-gray-600 hover:text-navy-900 mb-4 flex items-center gap-2"><span className="text-gold-500">{STAR}</span> Back to guides</button>
      <div className="card p-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center text-5xl shrink-0">
            <span className="text-gold-600">{STAR}</span>
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold mb-2">{selected.title}</h2>
            <p className="text-gray-600 mb-4">{selected.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><span className="text-gold-500">{STAR}</span> {Math.floor(selected.duration / 60)} min</span>
              <span className="flex items-center gap-1"><span className="text-gold-500">{STAR}</span> {selected.language === 'he' ? 'Hebrew' : 'English'}</span>
              <span className="flex items-center gap-1"><span className="text-gold-500">{STAR}</span> {selected.instructor}</span>
              <span className={selected.isOfficial ? 'text-green-600 flex items-center gap-1' : 'text-orange-600 flex items-center gap-1'}>
                {selected.isOfficial ? `${STAR} Official` : 'Community'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200">
          <p className="text-gray-500 mb-3 flex items-center justify-center gap-2">{STAR} Audio Player</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-gold-500 h-2 rounded-full w-0"></div>
          </div>
          <div className="flex justify-center gap-3">
            <button className="btn-primary">{STAR} Play Preview</button>
            <button className="btn-outline">Download</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Audio Guides</h1>
      <p className="text-gray-600 mb-2">Explore the synagogue with authentic audio guides.</p>
      <p className="text-gold-600 text-sm mb-6">{STAR} Official guides approved by the congregation {STAR}</p>

      <div className="flex gap-2 mb-8">
        {['all', 'official', 'hebrew'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
              filter === f ? 'bg-navy-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}>{f === 'all' ? 'All' : f === 'official' ? `${STAR} Official` : `${STAR} Hebrew`}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {guides.map(g => <GuideCard key={g.id} guide={g} onClick={() => setSelected(g)} detailed />)}
      </div>
    </div>
  );
}

function GuideCard({ guide, onClick, detailed }: any) {
  return (
    <div className={`card ${onClick ? 'cursor-pointer hover:-translate-y-1 transition-transform' : ''}`} onClick={onClick}>
      <div className={`p-6 ${!detailed && 'text-center'}`}>
        <div className={`${detailed ? 'flex items-start gap-4' : 'block'}`}>
          <div className={`${detailed ? 'w-16 h-16 shrink-0' : 'w-20 h-20 mx-auto mb-3'} bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center text-2xl`}>
            <span className="text-gold-600">{STAR}</span>
          </div>
          <div className={detailed ? 'flex-1' : ''}>
            <h3 className={`font-bold ${detailed ? 'text-lg' : 'text-xl mb-2'}`}>{guide.title}</h3>
            {!detailed && <p className="text-gray-600 text-sm mb-3">{guide.description}</p>}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">{STAR} {Math.floor(guide.duration / 60)} min</span>
              <span className="flex items-center gap-1">{STAR} {guide.language === 'he' ? 'Hebrew' : 'English'}</span>
              <span className={`flex items-center gap-1 ${guide.isOfficial ? 'text-green-600' : 'text-orange-600'}`}>
                {guide.isOfficial ? `${STAR} Official` : 'Community'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== PRAYERS ==========
function PrayersPage() {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [day, setDay] = useState(new Date().toLocaleDateString('en', { weekday: 'short' }).toLowerCase());
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  useEffect(() => { api.getPrayers(day).then(d => setPrayers(Array.isArray(d) ? d : [])); }, [day]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Prayer Schedule</h1>
      <p className="text-gold-600 text-sm mb-6">{STAR} Join our community for daily and Shabbat services {STAR}</p>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {days.map(d => (
          <button key={d} onClick={() => setDay(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition flex items-center gap-1 ${
              day === d ? 'bg-gold-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}>{d === 'sat' ? `${STAR} Shabbat` : d === 'sun' ? 'Sunday' : d.charAt(0).toUpperCase() + d.slice(1)}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prayers.map(p => (
          <div key={p.id} className={`card p-6 ${p.isSpecial ? 'ring-2 ring-gold-400 relative' : ''}`}>
            {p.isSpecial && (
              <div className="absolute -top-3 -right-3 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                {STAR} Special {STAR}
              </div>
            )}
            <div className="text-gold-500 text-2xl mb-2">{STAR}</div>
            <h3 className="font-bold text-xl mb-1">{p.name}</h3>
            <p className="text-3xl font-serif font-bold text-navy-800 my-3">{p.time}</p>
            <p className="text-gray-600 text-sm mb-3">{p.description}</p>
            <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
              <span className="flex items-center gap-1">{STAR} {p.duration} min</span>
              <span className="flex items-center gap-1">{STAR} {p.leader}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== TICKETS ==========
function TicketsPage({ user }: any) {
  const [types, setTypes] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [step, setStep] = useState<'types' | 'book'>('types');
  const [selectedType, setSelectedType] = useState<any>(null);
  const [form, setForm] = useState({ date: '', time: '10:00', quantity: 1 });

  useEffect(() => {
    api.getTicketTypes().then(d => setTypes(Array.isArray(d) ? d : []));
    if (user) api.getMyTickets().then(d => setMyTickets(Array.isArray(d) ? d : []));
  }, [user]);

  const handleBook = async () => {
    if (!user) return alert('Please sign in to book tickets');
    try {
      const res = await api.bookTicket({ type: selectedType.id, ...form, visitorName: user.name, visitorEmail: user.email });
      if (res.bookingRef) {
        alert(`Booking confirmed!\nReference: ${res.bookingRef}\nTotal: $${res.total}`);
        setStep('types');
        api.getMyTickets().then(d => setMyTickets(Array.isArray(d) ? d : []));
      }
    } catch { alert('Booking failed. Please try again.'); }
  };

  if (step === 'book' && selectedType) return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => setStep('types')} className="text-gray-600 hover:text-navy-900 mb-4 flex items-center gap-2"><span className="text-gold-500">{STAR}</span> Back</button>
      <div className="card p-8">
        <div className="text-center text-gold-500 text-3xl mb-2">{STAR}</div>
        <h2 className="font-serif text-2xl font-bold text-center mb-1">{selectedType.name} Ticket</h2>
        <p className="text-gold-600 text-sm text-center mb-4">{STAR} Reserve your visit {STAR}</p>
        <p className="text-3xl font-bold text-gold-600 text-center mb-6">${selectedType.price}.00</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">{STAR} Visit Date</label>
            <input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">{STAR} Time</label>
            <select className="input" value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
              <option>09:00</option><option>10:00</option><option>11:00</option><option>14:00</option><option>15:00</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-1">{STAR} Quantity</label>
            <input type="number" min="1" max="20" className="input" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 1})} />
          </div>
          <div className="border-t pt-4 text-center">
            <p className="text-lg font-bold">{STAR} Total: ${(selectedType.price * form.quantity).toFixed(2)}</p>
          </div>
          <button onClick={handleBook} className="btn-gold w-full !py-3" disabled={!form.date}>{STAR} Confirm Booking {STAR}</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Book Your Visit</h1>
      <p className="text-gold-600 text-sm mb-6">{STAR} Choose from our available ticket types {STAR}</p>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {types.map(t => (
          <div key={t.id} className={`card p-6 text-center cursor-pointer hover:-translate-y-1 transition-all group ${
            selectedType?.id === t.id ? 'ring-2 ring-gold-500' : ''
          }`} onClick={() => { setSelectedType(t); setStep('book'); }}>
            <div className="text-gold-500 text-2xl mb-2 group-hover:scale-110 transition-transform">{STAR}</div>
            <h3 className="font-bold text-lg mb-1">{t.name}</h3>
            <p className="text-2xl font-bold text-gold-600 my-2">${t.price}.00</p>
            <p className="text-gray-500 text-sm">{t.description}</p>
          </div>
        ))}
      </div>

      {user && myTickets.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-4">{STAR} My Bookings</h2>
          <div className="space-y-3">
            {myTickets.slice(0, 5).map(t => (
              <div key={t.id} className="card p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-gold-500">{STAR}</span>
                  <span className="font-bold">{t.bookingRef}</span>
                  <span className="text-gray-600">{t.date} at {t.time}</span>
                  <span className="text-sm text-gray-500">{t.type}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  t.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>{STAR} {t.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ========== EVENTS ==========
function EventsPage({ user }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    api.getEvents(category === 'all' ? undefined : category).then(d => setEvents(Array.isArray(d) ? d : []));
  }, [category]);

  const categories = [
    { key: 'all', label: `${STAR} All Events` },
    { key: 'study', label: `${STAR} Study` },
    { key: 'culture', label: `${STAR} Culture` },
    { key: 'dining', label: `${STAR} Dining` },
    { key: 'holiday', label: `${STAR} Holidays` },
    { key: 'education', label: `${STAR} Education` },
  ];

  const handleRegister = async (eventId: string) => {
    if (!user) return alert('Please sign in to register');
    const name = prompt('Your name:');
    if (!name) return;
    const email = prompt('Your email:');
    if (!email) return;
    try {
      const res = await api.registerForEvent(eventId, name, email);
      if (res.message) alert(res.message);
    } catch { alert('Registration failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold mb-2">Events & Activities</h1>
      <p className="text-gold-600 text-sm mb-6">{STAR} Discover Jewish life at the synagogue {STAR}</p>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              category === c.key ? 'bg-navy-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}>{c.label}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(e => <EventCard key={e.id} event={e} onRegister={() => handleRegister(e.id)} />)}
      </div>
    </div>
  );
}

function EventCard({ event, onRegister }: any) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`card ${showDetails ? 'md:col-span-2 lg:col-span-3' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full capitalize flex items-center gap-1 w-fit">{STAR} {event.category}</span>
            <h3 className="font-bold text-xl mt-1">{event.name}</h3>
          </div>
          <button onClick={() => setShowDetails(!showDetails)} className="text-gray-400 hover:text-gray-600">
            {showDetails ? '▲' : '▼'}
          </button>
        </div>
        <p className="text-gray-600 mb-3">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">{STAR} {event.schedule}</span>
          <span className="flex items-center gap-1">{STAR} {event.instructor}</span>
          {event.price > 0 ? <span className="font-bold text-gold-600 flex items-center gap-1">{STAR} ${event.price}.00</span> : <span className="text-green-600 flex items-center gap-1">{STAR} Free</span>}
        </div>
        <button onClick={onRegister} className="btn-primary w-full flex items-center justify-center gap-2">{STAR} Register Now</button>

        {showDetails && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-bold mb-2 flex items-center gap-2">{STAR} Registered Attendees ({event.registrations?.length || 0}/{event.capacity})</h4>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${((event.registrations?.length || 0) / event.capacity) * 100}%` }}></div>
            </div>
            {event.registrations?.length === 0 && <p className="text-gray-400 text-sm">No registrations yet. Be the first!</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== ABOUT ==========
function AboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    api.getAbout().then(setAbout);
    api.getComments().then(d => setComments(Array.isArray(d) ? d : []));
  }, []);

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await api.addComment(newComment, 5);
      if (res.id) { setComments([res, ...comments]); setNewComment(''); }
    } catch { alert('Please sign in to comment'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {about && (
        <>
          <div className="card p-8 mb-8">
            <div className="text-center text-gold-500 text-4xl mb-4">{STAR}</div>
            <h1 className="font-serif text-3xl font-bold text-center mb-1">{about.name}</h1>
            <p className="text-gold-600 text-center text-sm mb-4">{STAR} Built in {about.built} &middot; {about.style} &middot; Capacity: {about.capacity.toLocaleString()} {STAR}</p>
            <p className="text-gray-600 mb-6 text-center">{about.description}</p>
            <p className="text-gray-700 mb-6 leading-relaxed">{about.history}</p>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">{STAR} Highlights</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {about.highlights?.map((h: string, i: number) => (
                <span key={i} className="bg-gold-50 text-gold-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">{STAR} {h}</span>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-sm border-t pt-6">
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-1">{STAR} Location</h4>
                <p className="text-gray-600">{about.location}</p>
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-1">{STAR} Contact</h4>
                <p className="text-gray-600">Phone: {about.contact.phone}<br />Email: {about.contact.email}</p>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="font-serif text-2xl font-bold mb-2">{STAR} Visitor Comments</h2>
            <p className="text-gold-600 text-sm mb-4">Share your experience at the synagogue</p>
            <div className="flex gap-2 mb-6">
              <input className="input flex-1" placeholder="Share your experience..." value={newComment} onChange={e => setNewComment(e.target.value)} />
              <button onClick={addComment} className="btn-primary flex items-center gap-1">{STAR} Post</button>
            </div>
            <div className="space-y-4">
              {comments.slice(0, 10).map(c => (
                <div key={c.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold-500">{STAR}</span>
                    <span className="font-medium">{c.userName}</span>
                    <span className="text-yellow-500 flex">
                      {Array.from({length: c.rating}).map((_, i) => (
                        <span key={i}>{STAR}</span>
                      ))}
                    </span>
                    <span className="text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 ml-6">{c.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-3xl mb-2">{STAR}</p>
                  <p>No comments yet. Be the first to share!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ========== AUTH MODAL ==========
function AuthModal({ tab, setTab, onSubmit, onClose }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (tab === 'register' && !name) return;
    onSubmit(email, password, tab === 'register' ? name : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-serif text-2xl font-bold">{tab === 'login' ? 'Sign In' : 'Create Account'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <p className="text-gold-600 text-sm mb-6 text-center">{STAR} Welcome to Dohány Utcai Zsinagóga {STAR}</p>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${tab === 'login' ? 'bg-white shadow' : ''}`}>{STAR} Sign In</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${tab === 'register' ? 'bg-white shadow' : ''}`}>{STAR} Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} required />
          </div>
          <button type="submit" className="btn-gold w-full !py-3 !text-base flex items-center justify-center gap-2">
            {STAR} {tab === 'login' ? 'Sign In' : 'Create Account'} {STAR}
          </button>
        </form>
      </div>
    </div>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="text-gray-400 py-8 mt-12" style={{background: 'linear-gradient(135deg, #0f1a2e 0%, #1a2744 50%, #0f1a2e 100%)'}}>
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-2xl text-gold-400 mb-2 opacity-60">{STAR}</p>
        <p className="text-gold-400 font-serif text-lg font-bold mb-1">Dohány Utcai Zsinagóga</p>
        <p className="text-sm mb-1">{SHALOM_HE} &middot; {STAR} &middot; Budapest, Dohány u. 2, 1074 Hungary</p>
        <p className="text-sm mb-4">+36 1 555-0123 &middot; info@dohany-synagogue.hu</p>
        <div className="flex justify-center gap-6 text-sm mb-4">
          <a href="#" className="hover:text-white transition">{STAR} Privacy</a>
          <a href="#" className="hover:text-white transition">{STAR} Terms</a>
          <a href="#" className="hover:text-white transition">{STAR} Contact</a>
        </div>
        <p className="text-xs opacity-60">{STAR} Dohány Utcai Zsinagóga. All rights reserved. {STAR}</p>
      </div>
    </footer>
  );
}
