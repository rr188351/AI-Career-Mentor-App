import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

type ScreenName =
  | 'splash' | 'welcome' | 'login' | 'signup' | 'stage' | 'interests' | 'goals'
  | 'assessment' | 'results' | 'home' | 'explore' | 'details' | 'compare'
  | 'mentor' | 'roadmap' | 'progress' | 'notifications' | 'profile' | 'settings'

type IconName =
  | 'arrow' | 'back' | 'bell' | 'bookmark' | 'briefcase' | 'check' | 'chevron'
  | 'compass' | 'eye' | 'home' | 'lock' | 'mail' | 'message' | 'path' | 'person'
  | 'search' | 'settings' | 'spark' | 'sun' | 'moon' | 'target' | 'trend' | 'user' | 'x'

const iconPaths: Record<IconName, React.ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  back: <><path d="M19 12H5M11 18l-6-6 6-6" /></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  bookmark: <><path d="M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-4-6 4Z" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  chevron: <><path d="m9 18 6-6-6-6" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.2 5.8L8 16l2.2-5.8Z" /></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
  home: <><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3Z" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /></>,
  path: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" /></>,
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <><path d="M20.7 15.2A8.5 8.5 0 0 1 8.8 3.3 8.5 8.5 0 1 0 20.7 15.2Z" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>,
  trend: <><path d="M3 18 9 12l4 4 8-10M16 6h5v5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
}

type ProfileData = { name: string; email: string }
type NotificationPrefs = { careers: boolean; roadmap: boolean; mentor: boolean }
type AppStore = {
  theme: 'dark' | 'light'; setTheme: (theme: 'dark' | 'light') => void
  skills: string[]; setSkills: React.Dispatch<React.SetStateAction<string[]>>
  savedCareers: string[]; setSavedCareers: React.Dispatch<React.SetStateAction<string[]>>
  profile: ProfileData; setProfile: React.Dispatch<React.SetStateAction<ProfileData>>
  notificationPrefs: NotificationPrefs; setNotificationPrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>
}

const AppContext = createContext<AppStore | null>(null)
function useApp() {
  const value = useContext(AppContext)
  if (!value) throw new Error('App context is unavailable')
  return value
}

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) as T : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Local persistence is optional. */ }
  }, [key, value])
  return [value, setValue] as const
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function Button({ children, onClick, variant = 'primary', icon, disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; icon?: IconName; disabled?: boolean
}) {
  return <button className={`button ${variant}`} onClick={onClick} disabled={disabled}>{children}{icon && <Icon name={icon} size={18} />}</button>
}

function Glass({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`glass ${className}`} onClick={onClick}>{children}</div>
}

function ProgressBar({ value }: { value: number }) {
  return <div className="progress-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill" style={{ width: `${value}%` }} /></div>
}

function Chip({ children, selected = false, onClick }: { children: React.ReactNode; selected?: boolean; onClick?: () => void }) {
  return <button className={`chip ${selected ? 'selected' : ''}`} onClick={onClick}>{selected && <Icon name="check" size={14} />}{children}</button>
}

function Field({ label, placeholder, type = 'text', icon }: { label: string; placeholder: string; type?: string; icon?: IconName }) {
  const [visible, setVisible] = useState(false)
  return <label className="field-wrap"><span>{label}</span><div className="field">{icon && <Icon name={icon} size={18} />}<input type={visible ? 'text' : type} placeholder={placeholder} />{type === 'password' && <button className="icon-button tiny" onClick={() => setVisible(!visible)} type="button" aria-label="Toggle password visibility"><Icon name="eye" size={18} /></button>}</div></label>
}

function Logo({ small = false }: { small?: boolean }) {
  return <div className={`logo ${small ? 'small' : ''}`}><div className="logo-orbit" /><Icon name="compass" size={small ? 22 : 34} /></div>
}

function ThemeToggle() {
  const { theme, setTheme } = useApp()
  const next = theme === 'dark' ? 'light' : 'dark'
  return <button className="icon-button theme-toggle" onClick={() => setTheme(next)} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}><span className="theme-icon" key={theme}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} /></span></button>
}

function GoogleButton({ onDemo }: { onDemo: () => void }) {
  return <button className="button secondary google-button" onClick={onDemo}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.7A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.7.1-1.3.3-1.9V7.4H3A10 10 0 0 0 2 12c0 1.7.4 3.2 1 4.6l3.4-2.7Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.9.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 3 7.4l3.4 2.7C7.2 7.7 9.4 5.9 12 5.9Z"/></svg>
    <span>Continue with Google</span>
  </button>
}

const titles: Partial<Record<ScreenName, string>> = {
  explore: 'Explore your possibilities.', details: 'UX Designer', compare: 'Compare your career paths.',
  roadmap: 'Your UX Designer roadmap', progress: 'Look how far you’ve come.', notifications: 'Notifications', settings: 'Settings',
}

function TopBar({ screen, back, action }: { screen: ScreenName; back?: () => void; action?: React.ReactNode }) {
  return <div className="topbar">{back ? <button className="icon-button" onClick={back} aria-label="Go back"><Icon name="back" /></button> : <Logo small />}<div className="topbar-title">{titles[screen]}</div><div className="topbar-actions">{action}<ThemeToggle /></div></div>
}

const navItems: { screen: ScreenName; label: string; icon: IconName }[] = [
  { screen: 'home', label: 'Home', icon: 'home' }, { screen: 'explore', label: 'Explore', icon: 'compass' },
  { screen: 'mentor', label: 'Mentor', icon: 'message' }, { screen: 'roadmap', label: 'Roadmap', icon: 'path' },
  { screen: 'profile', label: 'Profile', icon: 'user' },
]

function BottomNav({ current, go }: { current: ScreenName; go: (s: ScreenName) => void }) {
  return <nav className="bottom-nav">{navItems.map(item => <button key={item.screen} className={current === item.screen ? 'active' : ''} onClick={() => go(item.screen)}><Icon name={item.icon} size={19} /><span>{item.label}</span></button>)}</nav>
}

function Screen({ children, className = '', nav, go }: { children: React.ReactNode; className?: string; nav?: ScreenName; go: (s: ScreenName) => void }) {
  return <main className={`screen ${className}`}><div className="ambient ambient-a" /><div className="ambient ambient-b" /><div className={`scroll ${nav ? 'with-nav' : ''}`}>{children}</div>{nav && <BottomNav current={nav} go={go} />}<div className="home-indicator" /></main>
}

function StepHeader({ step, title, copy, back }: { step: number; title: string; copy?: string; back: () => void }) {
  return <><TopBar screen="stage" back={back} action={<span className="step-count">{step} / 3</span>} /><div className="step-progress"><span style={{ width: `${step * 33.33}%` }} /></div><div className="eyebrow">PERSONALIZE YOUR JOURNEY</div><div className="screen-title">{title}</div>{copy && <div className="screen-copy">{copy}</div>}</>
}

const careerData = [
  { title: 'UX Designer', match: 88, desc: 'Shape useful digital experiences through research and thoughtful design.', tags: ['Design', 'Research'] },
  { title: 'Software Engineer', match: 82, desc: 'Build reliable products by turning ideas into working systems.', tags: ['Coding', 'Logic'] },
  { title: 'Data Analyst', match: 78, desc: 'Find patterns in data and turn them into clear decisions.', tags: ['Data', 'Insights'] },
  { title: 'Product Designer', match: 76, desc: 'Connect user needs, visual craft, and product strategy.', tags: ['Strategy', 'UI'] },
  { title: 'Product Manager', match: 72, desc: 'Guide teams toward valuable problems and focused outcomes.', tags: ['Leadership', 'Business'] },
]

function MatchPill({ value }: { value: number }) {
  return <div className="match-pill" style={{ '--match': `${value}%` } as React.CSSProperties}><span>{value}%</span> profile match</div>
}

function CareerCard({ career, featured = false, onOpen, saved, onSave }: { career: typeof careerData[number]; featured?: boolean; onOpen: () => void; saved?: boolean; onSave?: () => void }) {
  return <Glass className={`career-card ${featured ? 'featured' : ''}`}><div className="career-row"><div className="career-icon"><Icon name={career.title.includes('Data') ? 'trend' : career.title.includes('Software') ? 'briefcase' : 'spark'} /></div><button className={`icon-button tiny ${saved ? 'saved' : ''}`} onClick={onSave} aria-label="Save career"><Icon name="bookmark" size={18} /></button></div><div className="card-title">{career.title}</div><MatchPill value={career.match} /><div className="body-copy">{career.desc}</div><div className="tag-row">{career.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div><button className="text-action" onClick={onOpen}>View role <Icon name="arrow" size={16} /></button></Glass>
}

function Splash({ go }: { go: (s: ScreenName) => void }) {
  useEffect(() => { const timer = setTimeout(() => go('welcome'), 1800); return () => clearTimeout(timer) }, [go])
  return <Screen go={go} className="splash"><div className="splash-content"><Logo /><div className="brand-name">AI Career Mentor</div><div className="tagline">Find your direction. Build your future.</div></div><div className="loading-line"><span /></div></Screen>
}

function Welcome({ go }: { go: (s: ScreenName) => void }) {
  const benefits: [IconName, string][] = [['spark', 'Discover your strengths'], ['compass', 'Explore your matches'], ['path', 'Build your roadmap']]
  return <Screen go={go} className="welcome"><TopBar screen="welcome" /><div className="hero-visual"><div className="path-line one" /><div className="path-line two" /><div className="hero-core"><Icon name="compass" size={34} /></div><span className="node n1" /><span className="node n2" /><span className="node n3" /></div><div className="screen-title large">Your future, with a clearer direction.</div><div className="screen-copy">Discover careers that match your strengths, understand your skill gaps, and build a plan that moves you forward.</div><div className="benefit-list">{benefits.map(([icon, text]) => <div className="benefit" key={text}><span><Icon name={icon} size={18} /></span>{text}</div>)}</div><div className="bottom-actions"><Button onClick={() => go('signup')} icon="arrow">Get Started</Button><Button variant="ghost" onClick={() => go('login')}>I already have an account</Button></div></Screen>
}

function AuthScreen({ signup, go }: { signup?: boolean; go: (s: ScreenName) => void }) {
  const [accepted, setAccepted] = useState(false)
  const [notice, setNotice] = useState('')
  return <Screen go={go}><TopBar screen={signup ? 'signup' : 'login'} back={() => go('welcome')} /><div className="auth-heading"><div className="eyebrow">{signup ? 'BEGIN YOUR JOURNEY' : 'WELCOME BACK'}</div><div className="screen-title">{signup ? 'Create your account' : 'Continue your journey'}</div><div className="screen-copy">{signup ? 'A clearer career direction starts with understanding you.' : 'Your roadmap and mentor are ready when you are.'}</div></div><div className="form-stack">{signup && <Field label="Full name" placeholder="Ananya Sharma" icon="person" />}<Field label="Email" placeholder="you@example.com" type="email" icon="mail" /><Field label="Password" placeholder="At least 8 characters" type="password" icon="lock" />{signup ? <button className={`check-row ${accepted ? 'checked' : ''}`} onClick={() => setAccepted(!accepted)}><span className="check-box">{accepted && <Icon name="check" size={14} />}</span><span>I agree to the Terms and Privacy Policy.</span></button> : <button className="forgot" onClick={() => setNotice('Password recovery is not connected in this demo.')}>Forgot password?</button>}<Button onClick={() => go(signup ? 'stage' : 'home')} disabled={signup && !accepted}>{signup ? 'Create Account' : 'Log In'}</Button><div className="or"><span />or continue with<span /></div><GoogleButton onDemo={() => setNotice('Google sign-in is shown for demonstration and is not connected.')} />{notice && <div className="demo-notice" role="status"><Icon name="spark" size={15} />{notice}</div>}<button className="auth-switch" onClick={() => go(signup ? 'login' : 'signup')}>{signup ? 'Already have an account? Log in' : 'New here? Create an account'}</button></div></Screen>
}

function Stage({ go }: { go: (s: ScreenName) => void }) {
  const [selected, setSelected] = useState('School / College Student')
  const options: [string, string, IconName][] = [['School / College Student', 'Exploring paths while you study', 'briefcase'], ['Recent Graduate', 'Starting your first chapter', 'spark'], ['Working Professional', 'Growing with more intention', 'trend'], ['Exploring a Career Change', 'Finding a new direction', 'compass']]
  return <Screen go={go}><StepHeader step={1} title="Where are you in your career journey?" copy="This helps us tailor recommendations to your experience." back={() => go('signup')} /><div className="select-list">{options.map(([title, desc, icon]) => <button key={title} onClick={() => setSelected(title)} className={`select-card ${selected === title ? 'selected' : ''}`}><span className="select-icon"><Icon name={icon} /></span><span><strong>{title}</strong><small>{desc}</small></span><span className="radio">{selected === title && <span />}</span></button>)}</div><div className="sticky-action"><Button onClick={() => go('interests')} icon="arrow">Continue</Button></div></Screen>
}

function Interests({ go }: { go: (s: ScreenName) => void }) {
  const options = ['Technology', 'Design & Creativity', 'Business', 'Data & Analytics', 'Research', 'Communication', 'Problem Solving', 'Leadership']
  const [selected, setSelected] = useState(['Technology', 'Design & Creativity', 'Problem Solving'])
  const { skills, setSkills } = useApp()
  const [adding, setAdding] = useState(false)
  const [skill, setSkill] = useState('')
  const [skillError, setSkillError] = useState('')
  const toggle = (v: string) => setSelected(s => s.includes(v) ? s.filter(x => x !== v) : [...s, v])
  const addSkill = () => {
    const clean = skill.trim()
    if (!clean) return setSkillError('Enter a skill first.')
    if (skills.some(s => s.toLowerCase() === clean.toLowerCase())) return setSkillError('That skill is already added.')
    setSkills(current => [...current, clean])
    setSkill('')
    setSkillError('')
  }
  return <Screen go={go}><StepHeader step={2} title="What are you naturally curious about?" copy="Choose a few. You can update these at any time." back={() => go('stage')} /><div className="section-label">INTERESTS</div><div className="chip-grid">{options.map(o => <Chip key={o} selected={selected.includes(o)} onClick={() => toggle(o)}>{o}</Chip>)}</div><Glass className="skill-box"><div><div className="card-title small">Skills you already use <span className="optional-label">Optional</span></div><div className="body-copy">Add practical or people skills—every starting point counts.</div></div><div className="tag-row skill-tags">{skills.map(s => <span className="skill-chip" key={s}>{s}<button onClick={() => setSkills(current => current.filter(item => item !== s))} aria-label={`Remove ${s}`}><Icon name="x" size={13} /></button></span>)}<Chip onClick={() => setAdding(true)}>+ Add skill</Chip></div>{adding && <form className="skill-entry" onSubmit={e => { e.preventDefault(); addSkill() }}><input autoFocus value={skill} onChange={e => { setSkill(e.target.value); setSkillError('') }} placeholder="e.g. C++, Python, SQL" aria-label="New skill" /><div><button type="button" onClick={() => { setAdding(false); setSkill(''); setSkillError('') }}>Cancel</button><button type="submit">Add</button></div>{skillError && <span role="alert">{skillError}</span>}</form>}</Glass><div className="sticky-action"><Button onClick={() => go('goals')} icon="arrow">Continue</Button></div></Screen>
}

function Goals({ go }: { go: (s: ScreenName) => void }) {
  const [selected, setSelected] = useState('Prepare for internships')
  const goals = ['Find my ideal career', 'Prepare for internships', 'Become job-ready', 'Learn new skills', 'Switch careers', 'Grow in my current role']
  return <Screen go={go}><StepHeader step={3} title="What would you like to achieve?" copy="Pick the goal that matters most right now." back={() => go('interests')} /><div className="goal-grid">{goals.map(g => <button className={`goal-card ${selected === g ? 'selected' : ''}`} onClick={() => setSelected(g)} key={g}><Icon name={g.includes('skills') ? 'spark' : g.includes('intern') ? 'briefcase' : 'target'} /><span>{g}</span>{selected === g && <span className="mini-check"><Icon name="check" size={13} /></span>}</button>)}</div><div className="section-label">I’D LIKE TO MAKE PROGRESS IN</div><div className="segmented"><button>3 months</button><button className="active">6 months</button><button>1 year</button></div><div className="sticky-action"><Button onClick={() => go('assessment')} icon="arrow">Start Assessment</Button></div></Screen>
}

function Assessment({ go }: { go: (s: ScreenName) => void }) {
  const [answer, setAnswer] = useState(1)
  const answers = ['Finding patterns and analyzing data', 'Designing a creative solution', 'Building and testing something practical', 'Understanding people and their needs']
  return <Screen go={go}><TopBar screen="assessment" back={() => go('goals')} action={<button className="save-later">Save & resume</button>} /><div className="question-meta"><span>Question 4 of 12</span><span>33%</span></div><ProgressBar value={33} /><div className="question">When solving a challenging problem, what do you enjoy most?</div><div className="screen-copy">Choose the response that feels most natural to you.</div><div className="answer-list">{answers.map((a, i) => <button className={`answer-card ${answer === i ? 'selected' : ''}`} onClick={() => setAnswer(i)} key={a}><span>{String.fromCharCode(65 + i)}</span><strong>{a}</strong>{answer === i && <Icon name="check" />}</button>)}</div><Glass className="info-note"><Icon name="spark" size={17} /><span>Your responses personalize suggestions—they don’t define or limit you.</span></Glass><div className="dual-actions"><Button variant="secondary" onClick={() => go('goals')}>Back</Button><Button onClick={() => go('results')} icon="arrow">Continue</Button></div></Screen>
}

function Results({ go }: { go: (s: ScreenName) => void }) {
  return <Screen go={go}><TopBar screen="results" back={() => go('assessment')} /><div className="eyebrow">YOUR CAREER PROFILE</div><div className="screen-title">Your career profile is taking shape.</div><div className="screen-copy">You combine creative thinking with a practical, analytical approach.</div><Glass className="profile-radar"><div className="radar"><span>82</span><small>balanced profile</small></div><div className="bar-list">{[['Creative thinking', 86], ['Problem solving', 81], ['Collaboration', 76]].map(([label, value]) => <div key={label as string}><div className="bar-label"><span>{label}</span><b>{value}%</b></div><ProgressBar value={value as number} /></div>)}</div></Glass><div className="section-label">WHAT STOOD OUT</div><div className="observation-list"><div><Icon name="spark" /><span><strong>Human-centered curiosity</strong><small>You often consider how solutions affect people.</small></span></div><div><Icon name="trend" /><span><strong>Structured problem solving</strong><small>You enjoy making complex ideas clearer.</small></span></div><div><Icon name="path" /><span><strong>Learn by making</strong><small>Practical projects may help you progress faster.</small></span></div></div><div className="disclaimer">Based on your responses, not a psychological diagnosis or guarantee.</div><div className="bottom-actions static"><Button onClick={() => go('explore')} icon="arrow">Explore My Career Matches</Button><Button variant="ghost" onClick={() => go('profile')}>Review My Profile</Button></div></Screen>
}

function Home({ go }: { go: (s: ScreenName) => void }) {
  const { savedCareers, setSavedCareers } = useApp()
  const saved = savedCareers.includes('UX Designer')
  const toggleSaved = () => setSavedCareers(current => saved ? current.filter(item => item !== 'UX Designer') : [...current, 'UX Designer'])
  return <Screen go={go} nav="home"><div className="home-header"><div><div className="greeting">Good morning, Ananya</div><div>Your next chapter starts here.</div></div><div className="header-actions"><ThemeToggle /><button className="icon-button" onClick={() => go('notifications')} aria-label="Notifications"><Icon name="bell" /></button><button className="icon-button" onClick={() => go('settings')} aria-label="Settings"><Icon name="settings" /></button><button className="avatar" onClick={() => go('profile')}>AS</button></div></div><Glass className="mentor-feature"><div className="mentor-copy"><div className="eyebrow">YOUR AI CAREER MENTOR</div><div className="feature-title">Let’s find your direction.</div><div className="body-copy">Get personalized guidance based on your strengths and goals.</div><Button onClick={() => go('mentor')} icon="arrow">Talk to Your Mentor</Button></div><div className="ai-orb"><span /><Icon name="spark" size={25} /></div></Glass><div className="section-heading"><div><span>Careers that fit you</span><small>Based on your current profile</small></div><button onClick={() => go('explore')}>See all</button></div><Glass className="featured-career clickable-card" onClick={() => go('details')}><div className="career-top"><div className="career-icon"><Icon name="spark" /></div><MatchPill value={88} /></div><div className="card-title">UX Designer</div><div className="body-copy">Your interest in design, problem-solving, and user behaviour makes this path worth exploring.</div><div className="tag-row"><span className="tag">Design</span><span className="tag">Research</span><span className="tag">Empathy</span></div><div className="card-actions"><button className={saved ? 'saved' : ''} onClick={(event) => { event.stopPropagation(); toggleSaved() }} aria-pressed={saved}><Icon name="bookmark" size={17} /> {saved ? 'Saved' : 'Save'}</button><Button variant="secondary" onClick={() => go('details')}>Why it matches</Button></div></Glass><div className="section-heading"><div><span>Your career roadmap</span><small>3 of 8 milestones completed</small></div><button onClick={() => go('progress')}>Progress</button></div><Glass className="roadmap-preview"><ProgressBar value={37} /><div className="next-row"><span className="milestone-number">04</span><div><small>NEXT MILESTONE</small><strong>Build your first portfolio case study</strong></div></div><Button variant="secondary" onClick={() => go('roadmap')} icon="arrow">Continue Roadmap</Button></Glass><div className="section-heading"><div><span>Quick actions</span></div></div><div className="quick-grid">{[['Explore Careers', 'compass', 'explore'], ['Career Assessment', 'target', 'assessment'], ['Compare Paths', 'trend', 'compare'], ['Ask AI Mentor', 'message', 'mentor']].map(([label, icon, screen]) => <button onClick={() => go(screen as ScreenName)} key={label}><Icon name={icon as IconName} /><span>{label}</span><Icon name="chevron" size={15} /></button>)}</div></Screen>
}

function Explore({ go }: { go: (s: ScreenName) => void }) {
  const [query, setQuery] = useState('')
  const { savedCareers, setSavedCareers } = useApp()
  const [category, setCategory] = useState('For you')
  const careers = careerData.filter(c => {
    const termMatch = `${c.title} ${c.desc} ${c.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())
    const categoryMatch = category === 'For you' || c.title.includes(category) || c.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase())) || (category === 'Technology' && ['Software Engineer', 'Data Analyst'].includes(c.title))
    return termMatch && categoryMatch
  })
  return <Screen go={go} nav="explore"><TopBar screen="explore" action={<button className="icon-button" onClick={() => go('settings')} aria-label="Settings"><Icon name="settings" /></button>} /><div className="search-field"><Icon name="search" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search careers, skills..." /><button onClick={() => setCategory(category === 'For you' ? 'Design' : 'For you')}>Filter</button></div><div className="chips-scroll">{['For you', 'Technology', 'Design', 'Data'].map(item => <Chip key={item} selected={category === item} onClick={() => setCategory(item)}>{item}</Chip>)}</div><div className="list-meta"><span>{careers.length} paths to explore</span><button>Best match</button></div>{careers.length ? <div className="career-list">{careers.map((c, i) => <CareerCard key={c.title} career={c} featured={i === 0} onOpen={() => go('details')} saved={savedCareers.includes(c.title)} onSave={() => setSavedCareers(current => current.includes(c.title) ? current.filter(x => x !== c.title) : [...current, c.title])} />)}</div> : <Glass className="empty-state"><Icon name="search" size={30} /><div className="card-title">No careers found</div><div className="body-copy">Try a broader role, skill, or interest.</div><Button variant="secondary" onClick={() => { setQuery(''); setCategory('For you') }}>Clear search</Button></Glass>}</Screen>
}

function Details({ go }: { go: (s: ScreenName) => void }) {
  const { savedCareers, setSavedCareers } = useApp()
  const saved = savedCareers.includes('UX Designer')
  return <Screen go={go}><TopBar screen="details" back={() => go('explore')} action={<button className={`icon-button ${saved ? 'saved' : ''}`} onClick={() => setSavedCareers(current => saved ? current.filter(item => item !== 'UX Designer') : [...current, 'UX Designer'])} aria-label={saved ? 'Remove saved career' : 'Save career'}><Icon name="bookmark" /></button>} /><div className="role-hero"><div className="career-icon large"><Icon name="spark" size={27} /></div><div><div className="screen-title">UX Designer</div><div className="screen-copy">Design useful, accessible digital experiences grounded in real user needs.</div></div><MatchPill value={88} /></div><Glass className="why-card"><div className="eyebrow">WHY THIS MATCHES YOU</div><div className="card-title">Creativity with a practical edge</div><div className="body-copy">You enjoy understanding people, simplifying complex problems, and building tangible solutions.</div><button className="text-action">Match explained by your selected interests and assessment responses</button></Glass><DetailSection title="Your relevant strengths" items={['Creative problem solving', 'Visual communication', 'Curiosity about people']} positive /><DetailSection title="Skills to develop" items={['User research methods', 'Interaction design', 'Portfolio storytelling']} /><Glass className="detail-block"><div className="card-title">What you might do</div><ul><li>Interview users and synthesize insights</li><li>Create user flows, wireframes, and prototypes</li><li>Collaborate with product and engineering</li></ul></Glass><Glass className="learning-card"><Icon name="path" /><div><div className="card-title small">Suggested first direction</div><div className="body-copy">Start with UX fundamentals, then redesign one everyday app flow.</div></div></Glass><div className="section-label">RELATED PATHS</div><div className="related-row"><Chip>Product Designer</Chip><Chip>UX Researcher</Chip></div><div className="dual-actions sticky-bottom"><Button variant="secondary" onClick={() => go('compare')}>Compare</Button><Button onClick={() => go('roadmap')}>Build My Roadmap</Button></div></Screen>
}

function DetailSection({ title, items, positive }: { title: string; items: string[]; positive?: boolean }) {
  return <div className="detail-section"><div className="section-heading"><div><span>{title}</span></div></div><div className="skill-list">{items.map(i => <div key={i}><span className={positive ? 'positive' : ''}><Icon name={positive ? 'check' : 'arrow'} size={14} /></span>{i}</div>)}</div></div>
}

function Compare({ go }: { go: (s: ScreenName) => void }) {
  const roles = [{ name: 'UX Designer', match: 88, color: 'cyan' }, { name: 'Software Engineer', match: 82, color: 'blue' }, { name: 'Data Analyst', match: 78, color: 'violet' }]
  const rows = [{ label: 'Strongest alignment', vals: ['Creativity', 'Building', 'Patterns'] }, { label: 'Develop next', vals: ['Research', 'Systems', 'SQL'] }, { label: 'Learning effort', vals: ['Moderate', 'Focused', 'Moderate'] }]
  return <Screen go={go}><TopBar screen="compare" back={() => go('details')} /><div className="screen-copy">Compare trade-offs—not winners. Choose the path you want to experience first.</div><div className="compare-head">{roles.map(r => <Glass key={r.name} className={`compare-role ${r.color}`}><span>{r.match}%</span><strong>{r.name}</strong></Glass>)}</div><div className="compare-rows">{rows.map(row => <div key={row.label}><div className="section-label">{row.label}</div><div className="compare-values">{row.vals.map((v, i) => <span key={v}><b>{v}</b><small>{roles[i].name.split(' ')[0]}</small></span>)}</div></div>)}</div><Glass className="activity-compare"><div className="card-title">Typical work activities</div>{roles.map((r, i) => <div className="activity-row" key={r.name}><span className={`dot ${r.color}`} /><strong>{r.name}</strong><small>{['Research · flows · prototyping', 'Coding · testing · shipping', 'Cleaning · analysis · reporting'][i]}</small></div>)}</Glass><Glass className="first-step"><Icon name="spark" /><div><div className="card-title small">Try before you decide</div><div className="body-copy">Complete one 60-minute starter task in each path and note what energizes you.</div></div></Glass><div className="bottom-actions static"><Button onClick={() => go('roadmap')} icon="arrow">Start UX Designer Roadmap</Button><Button variant="ghost" onClick={() => go('home')}>Save comparison</Button></div></Screen>
}

function Mentor({ go }: { go: (s: ScreenName) => void }) {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<{ id: number; from: 'user' | 'mentor'; text: string }[]>([])
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, typing])
  const send = (value = text) => {
    const clean = value.trim()
    if (!clean || typing) return
    setMessages(current => [...current, { id: Date.now(), from: 'user', text: clean }])
    setText('')
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMessages(current => [...current, { id: Date.now() + 1, from: 'mentor', text: 'Demo response: a good next step is one small project for each path you are considering. Compare how each one felt, then update your roadmap.' }])
    }, 1100)
  }
  return <Screen go={go} nav="mentor"><div className="chat-header"><div className="mentor-avatar"><Icon name="spark" /></div><div><strong>Career Mentor</strong><span><i /> Ready to help</span></div><div className="chat-tools"><ThemeToggle /><button className="icon-button" onClick={() => go('settings')} aria-label="Settings"><Icon name="settings" /></button></div></div><div className="ai-caution"><Icon name="spark" size={14} /> AI guidance is a starting point—evaluate what fits you.</div><div className="chat-body"><div className="date-label">TODAY</div><div className="bubble user">I like design, but I am also interested in coding. Which career should I explore?</div><div className="message-row"><div className="mini-mentor"><Icon name="spark" size={13} /></div><div className="bubble assistant">You may want to compare <strong>UX design, product design, and front-end development.</strong><br /><br />Your next step could be a small design task and a simple coding exercise so you can experience the differences before deciding.<button onClick={() => go('compare')}>Compare these paths <Icon name="arrow" size={15} /></button></div></div>{messages.map(m => m.from === 'user' ? <div className="bubble user" key={m.id}>{m.text}</div> : <div className="message-row" key={m.id}><div className="mini-mentor"><Icon name="spark" size={13} /></div><div className="bubble assistant">{m.text}</div></div>)}{typing && <div className="message-row" aria-live="polite"><div className="mini-mentor"><Icon name="spark" size={13} /></div><div className="bubble assistant typing" aria-label="Mentor is typing"><span /><span /><span /></div></div>}<div className="suggestions"><span>TRY ASKING</span>{['Compare these career paths', 'What skills am I missing?', 'Create my learning plan'].map(p => <button key={p} onClick={() => send(p)} disabled={typing}>{p}</button>)}</div><div ref={endRef} /></div><form className="composer" onSubmit={e => { e.preventDefault(); send() }}><button type="button" className="icon-button" aria-label="Add attachment (not available in demo)">+</button><input placeholder="Ask your career mentor..." value={text} onChange={e => setText(e.target.value)} aria-label="Message" /><button type="submit" className="send" aria-label="Send message" disabled={!text.trim() || typing}><Icon name="arrow" /></button></form></Screen>
}

const milestones = ['Understand UX fundamentals', 'Learn user research methods', 'Practise wireframing', 'Create a UI design project', 'Build a UX case study', 'Publish a portfolio', 'Prepare for interviews', 'Apply for internships']

function Roadmap({ go }: { go: (s: ScreenName) => void }) {
  const [completed, setCompleted] = useState(3)
  return <Screen go={go} nav="roadmap"><TopBar screen="roadmap" action={<button className="icon-button" onClick={() => go('progress')}><Icon name="trend" /></button>} /><Glass className="roadmap-summary"><div className="ring" style={{ '--progress': `${completed / 8 * 360}deg` } as React.CSSProperties}><span>{Math.round(completed / 8 * 100)}%</span></div><div><div className="card-title">You’re building momentum</div><div className="body-copy">{completed} of 8 milestones complete</div><small>Approx. 10–12 weeks remaining</small></div></Glass><div className="timeline">{milestones.map((m, i) => { const done = i < completed; const current = i === completed; return <div className={`timeline-item ${done ? 'done' : current ? 'current' : ''}`} key={m}><div className="timeline-marker">{done ? <Icon name="check" size={15} /> : i + 1}</div><Glass className="timeline-card"><div className="timeline-meta">{done ? 'COMPLETED' : current ? 'CURRENT MILESTONE' : 'UPCOMING'}<span>{i < 4 ? '1 week' : '2 weeks'}</span></div><div className="card-title small">{m}</div>{current && <><div className="body-copy">Turn your research and wireframes into a clear story of your design process.</div><div className="resource-row"><Icon name="path" size={16} /> 3 lessons · 2 practical tasks</div><Button onClick={() => setCompleted(Math.min(8, completed + 1))}>Mark task complete</Button></>}</Glass></div>})}</div><div className="sticky-action nav-safe"><Button onClick={() => setCompleted(Math.min(8, completed + 1))} icon="arrow">Continue Learning</Button></div></Screen>
}

function Progress({ go }: { go: (s: ScreenName) => void }) {
  const bars = [35, 60, 45, 80, 65, 25, 0]
  return <Screen go={go}><TopBar screen="progress" back={() => go('roadmap')} /><div className="screen-copy">Small, consistent steps are turning into real capability.</div><Glass className="progress-hero"><div className="ring large" style={{ '--progress': '133deg' } as React.CSSProperties}><span>37%</span></div><div><div className="eyebrow">ROADMAP COMPLETE</div><div className="feature-title">3 of 8</div><div className="body-copy">milestones completed</div></div></Glass><Glass className="weekly-card"><div className="card-row"><div><div className="card-title">Weekly activity</div><div className="body-copy">4 focused days</div></div><span className="success-label">+1 this week</span></div><div className="week-bars">{bars.map((b, i) => <div key={i}><span style={{ height: `${Math.max(b, 5)}%` }} className={b ? '' : 'empty'} /><small>{'MTWTFSS'[i]}</small></div>)}</div></Glass><div className="section-heading"><div><span>Skills in progress</span><small>Illustrative self-reported progress</small></div></div><Glass className="skills-progress">{[['Wireframing', 72], ['User research', 54], ['Visual design', 41]].map(([n, v]) => <div key={n as string}><div className="bar-label"><span>{n}</span><b>{v}%</b></div><ProgressBar value={v as number} /></div>)}</Glass><div className="section-heading"><div><span>Recent achievements</span></div></div><div className="achievement"><span><Icon name="check" /></span><div><strong>Wireframing essentials</strong><small>Completed 2 days ago</small></div></div><Glass className="next-action"><div className="eyebrow">RECOMMENDED NEXT</div><div className="card-title">Outline your first case study</div><div className="body-copy">Start with the problem, your process, and what changed.</div><Button onClick={() => go('roadmap')}>Continue Roadmap</Button></Glass><Button variant="ghost">Review my goals</Button></Screen>
}

function Notifications({ go }: { go: (s: ScreenName) => void }) {
  const items: [IconName, string, string, boolean][] = [
    ['path', 'Your next milestone is ready', 'Start building your first portfolio case study.', true],
    ['spark', 'A new career match was added', 'Product Designer now fits your updated interests.', true],
    ['check', 'Milestone completed', 'You finished Practise wireframing. Nice progress.', false],
    ['message', 'Your mentor has a follow-up', 'Try a small front-end task to compare career paths.', false],
  ]
  return <Screen go={go}><TopBar screen="notifications" back={() => go('home')} action={<button className="icon-button" onClick={() => go('settings')} aria-label="Settings"><Icon name="settings" /></button>} /><div className="notification-head"><span>RECENT</span><button>Mark all as read</button></div><div className="notification-list">{items.map((item, i) => <div className={`notification ${item[3] ? 'unread' : ''}`} key={item[1]}><span className="notification-icon"><Icon name={item[0]} /></span><div><strong>{item[1]}</strong><p>{item[2]}</p><small>{i < 2 ? `${i + 1}h ago` : `${i} days ago`}</small></div>{item[3] && <i />}</div>)}</div><div className="section-label">EARLIER</div><Glass className="notification-pref"><Icon name="bell" /><div><div className="card-title small">Stay in control</div><div className="body-copy">Choose which reminders are helpful to you.</div></div><Icon name="chevron" /></Glass></Screen>
}

function Profile({ go }: { go: (s: ScreenName) => void }) {
  const { profile, savedCareers } = useApp()
  const groups: { title: string; rows: [IconName, string, string?][] }[] = [
    { title: 'YOUR CAREER PROFILE', rows: [['target', 'Current goal', 'Prepare for internships'], ['spark', 'Interests & skills', 'Technology, Design +3'], ['bookmark', 'Saved careers', `${savedCareers.length} careers`], ['trend', 'Assessment history', 'Last updated May 18']] },
    { title: 'PREFERENCES', rows: [['settings', 'Settings'], ['bell', 'Notifications'], ['eye', 'Accessibility'], ['lock', 'Privacy & data controls']] },
  ]
  return <Screen go={go} nav="profile"><div className="profile-tools"><ThemeToggle /><button className="icon-button" onClick={() => go('settings')} aria-label="Settings"><Icon name="settings" /></button></div><div className="profile-head"><div className="profile-avatar">{profile.name.split(' ').map(n => n[0]).slice(0, 2).join('')}<span /></div><div><div className="screen-title">{profile.name}</div><div className="body-copy">Final-year Computer Science student</div></div><Button variant="secondary" onClick={() => go('settings')}>Edit</Button></div><Glass className="goal-banner"><div><div className="eyebrow">CURRENT DIRECTION</div><div className="card-title">Exploring UX Design</div></div><MatchPill value={88} /></Glass>{groups.map(g => <div className="settings-group" key={g.title}><div className="section-label">{g.title}</div><Glass>{g.rows.map(([icon, label, value]) => <button className="settings-row" key={label} onClick={() => label === 'Notifications' ? go('notifications') : ['Settings', 'Accessibility', 'Privacy & data controls'].includes(label) ? go('settings') : undefined}><span><Icon name={icon} /></span><div><strong>{label}</strong>{value && <small>{value}</small>}</div><Icon name="chevron" size={16} /></button>)}</Glass></div>)}<button className="signout" onClick={() => go('settings')}>Sign out</button><div className="version">AI Career Mentor · Version 1.0</div></Screen>
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button className={`toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={onChange}><span /></button>
}

function Dialog({ title, children, onClose, actions }: { title: string; children: React.ReactNode; onClose: () => void; actions?: React.ReactNode }) {
  return <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}><div className="dialog glass" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={e => e.stopPropagation()}><div className="dialog-head"><div id="dialog-title" className="card-title">{title}</div><button className="icon-button tiny" onClick={onClose} aria-label="Close dialog"><Icon name="x" /></button></div><div className="body-copy">{children}</div>{actions && <div className="dialog-actions">{actions}</div>}</div></div>
}

function Settings({ go }: { go: (s: ScreenName) => void }) {
  const { theme, setTheme, profile, setProfile, notificationPrefs, setNotificationPrefs } = useApp()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState<'privacy' | 'about' | 'signout' | null>(null)
  const toggleNotification = (key: keyof NotificationPrefs) => setNotificationPrefs(current => ({ ...current, [key]: !current[key] }))
  const saveProfile = () => {
    if (!draft.name.trim() || !draft.email.trim()) return setNotice('Name and email cannot be empty.')
    setProfile({ name: draft.name.trim(), email: draft.email.trim() })
    setEditing(false)
    setNotice('Profile changes saved locally.')
  }
  return <Screen go={go}><TopBar screen="settings" back={() => go('profile')} /><div className="settings-intro"><div className="screen-title">Your app, your preferences.</div><div className="screen-copy">Changes are stored on this device for the prototype.</div></div>
    <div className="section-label">APPEARANCE</div><Glass className="settings-panel"><div className="settings-copy"><span className="setting-icon"><Icon name={theme === 'dark' ? 'moon' : 'sun'} /></span><div><strong>Theme</strong><small>Applied throughout the app</small></div></div><div className="theme-options"><button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')}><Icon name="sun" size={16} />Light</button><button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')}><Icon name="moon" size={16} />Dark</button></div></Glass>
    <div className="section-label">ACCOUNT</div><Glass className="settings-panel account-panel">{editing ? <div className="edit-form"><label><span>Display name</span><input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} /></label><label><span>Email</span><input type="email" value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} /></label><div className="dual-actions"><Button variant="secondary" onClick={() => { setDraft(profile); setEditing(false) }}>Cancel</Button><Button onClick={saveProfile}>Save</Button></div></div> : <><div className="account-summary"><div className="profile-avatar compact">{profile.name.split(' ').map(n => n[0]).slice(0, 2).join('')}</div><div><strong>{profile.name}</strong><small>{profile.email}</small></div></div><Button variant="secondary" onClick={() => setEditing(true)}>Edit Profile</Button></>}</Glass>{notice && <div className="settings-notice" role="status">{notice}</div>}
    <div className="section-label">NOTIFICATIONS</div><Glass className="settings-panel toggle-list">{([['careers', 'Career recommendations', 'New paths that match your profile'], ['roadmap', 'Roadmap reminders', 'Gentle prompts for planned milestones'], ['mentor', 'AI Mentor updates', 'Follow-up suggestions from your mentor']] as [keyof NotificationPrefs, string, string][]).map(([key, label, copy]) => <div className="toggle-row" key={key}><div><strong>{label}</strong><small>{copy}</small></div><Toggle checked={notificationPrefs[key]} onChange={() => toggleNotification(key)} label={label} /></div>)}</Glass>
    <div className="section-label">PREFERENCES</div><Glass className="settings-panel"><div className="settings-copy"><span className="setting-icon"><Icon name="message" /></span><div><strong>Language</strong><small>English</small></div><span className="supported-label">Available</span></div></Glass>
    <div className="section-label">PRIVACY & ABOUT</div><Glass className="settings-panel action-list"><button onClick={() => setDialog('privacy')}><Icon name="lock" /><span>Privacy information<small>How this prototype stores local data</small></span><Icon name="chevron" size={16} /></button><button onClick={() => setDialog('about')}><Icon name="spark" /><span>About AI Career Mentor<small>Product purpose and demo status</small></span><Icon name="chevron" size={16} /></button></Glass>
    <button className="signout" onClick={() => setDialog('signout')}>Sign out of demo</button>
    {dialog === 'privacy' && <Dialog title="Privacy information" onClose={() => setDialog(null)}>This prototype stores theme, profile edits, notification preferences, saved careers, and skills in your browser’s local storage. No server-side privacy policy or external data service is connected.</Dialog>}
    {dialog === 'about' && <Dialog title="About this prototype" onClose={() => setDialog(null)}>AI Career Mentor is a frontend demonstration designed to help people explore career directions. Recommendations and AI responses are illustrative and should be evaluated critically.</Dialog>}
    {dialog === 'signout' && <Dialog title="Sign out of demo?" onClose={() => setDialog(null)} actions={<><Button variant="secondary" onClick={() => setDialog(null)}>Cancel</Button><Button onClick={() => { setDialog(null); go('welcome') }}>Sign Out</Button></>}>This ends the current demo session visually. No real authenticated account is connected, and locally saved preferences remain on this device.</Dialog>}
  </Screen>
}

export default function App() {
  const [screen, setScreen] = useState<ScreenName>(() => {
    const requested = new URLSearchParams(window.location.search).get('screen')
    const available: ScreenName[] = ['splash', 'welcome', 'login', 'signup', 'stage', 'interests', 'goals', 'assessment', 'results', 'home', 'explore', 'details', 'compare', 'mentor', 'roadmap', 'progress', 'notifications', 'profile', 'settings']
    return requested && available.includes(requested as ScreenName) ? requested as ScreenName : 'splash'
  })
  const [history, setHistory] = useState<ScreenName[]>([])
  const [theme, setTheme] = usePersistentState<'dark' | 'light'>('acm-theme', 'dark')
  const [skills, setSkills] = usePersistentState<string[]>('acm-skills', ['JavaScript', 'Figma'])
  const [savedCareers, setSavedCareers] = usePersistentState<string[]>('acm-saved-careers', ['UX Designer'])
  const [profile, setProfile] = usePersistentState<ProfileData>('acm-profile', { name: 'Ananya Sharma', email: 'ananya@example.com' })
  const [notificationPrefs, setNotificationPrefs] = usePersistentState<NotificationPrefs>('acm-notifications', { careers: true, roadmap: true, mentor: false })
  useLayoutEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  const changeTheme = (next: 'dark' | 'light') => {
    if (next === theme) return
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (doc.startViewTransition && !reduceMotion) doc.startViewTransition(() => flushSync(() => setTheme(next)))
    else setTheme(next)
  }
  const go = useMemo(() => (next: ScreenName) => {
    setScreen(current => {
      if (current !== next) setHistory(h => [...h.slice(-12), current])
      return next
    })
  }, [])

  const view: Record<ScreenName, React.ReactNode> = {
    splash: <Splash go={go} />, welcome: <Welcome go={go} />, login: <AuthScreen go={go} />, signup: <AuthScreen signup go={go} />,
    stage: <Stage go={go} />, interests: <Interests go={go} />, goals: <Goals go={go} />, assessment: <Assessment go={go} />,
    results: <Results go={go} />, home: <Home go={go} />, explore: <Explore go={go} />, details: <Details go={go} />,
    compare: <Compare go={go} />, mentor: <Mentor go={go} />, roadmap: <Roadmap go={go} />, progress: <Progress go={go} />,
    notifications: <Notifications go={go} />, profile: <Profile go={go} />, settings: <Settings go={go} />,
  }

  const store = { theme, setTheme: changeTheme, skills, setSkills, savedCareers, setSavedCareers, profile, setProfile, notificationPrefs, setNotificationPrefs }
  return (
    <AppContext.Provider value={store}>
      <div className="app-shell" data-theme={theme}>
        <div className="phone-stage">
          <div className="device">
            <span className="device-island" aria-hidden="true" />
            <span className="device-button device-button-mute" aria-hidden="true" />
            <span className="device-button device-button-vol-up" aria-hidden="true" />
            <span className="device-button device-button-vol-down" aria-hidden="true" />
            <span className="device-button device-button-power" aria-hidden="true" />
            {view[screen]}
          </div>
        </div>
        <button className="screen-index" aria-label="Screen index" title={`Screen: ${screen} · ${history.length} visited`} onClick={() => go('home')}><span /></button>
      </div>
    </AppContext.Provider>
  )
}
