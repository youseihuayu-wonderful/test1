import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  GitPullRequest,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  Clock3,
  Compass,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquareQuote,
  PauseCircle,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import {
  capabilityEvidence,
  definitionsOfDone,
  interviewMap,
  intro,
  kpiFramework,
  roleRequirements,
  scopeBoundaries,
  statusMeta,
  tenDayPlan,
  workItems,
  type Category,
  type StatusKey,
  type WorkItem,
} from './data'

type View = 'overview' | 'work' | 'stories' | 'plan'
type PlanTab = 'sprint' | 'fit' | 'kpi'

const navItems: Array<{ id: View; label: string; eyebrow: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Overview', eyebrow: 'Impact snapshot', icon: LayoutDashboard },
  { id: 'work', label: 'Work ledger', eyebrow: 'Issues & PRs', icon: BriefcaseBusiness },
  { id: 'stories', label: 'Story bank', eyebrow: 'Interview evidence', icon: MessageSquareQuote },
  { id: 'plan', label: 'Interview plan', eyebrow: '10-day system', icon: CalendarDays },
]

const statusIcon: Record<StatusKey, typeof CheckCircle2> = {
  shipped: CheckCircle2,
  completed: FileCheck2,
  'in-progress': Clock3,
  paused: PauseCircle,
  planned: CircleDashed,
  proposal: Lightbulb,
}

const categories: Array<'All' | Category> = ['All', 'Infrastructure', 'Production', 'QA', 'Review', 'Frontend', 'Compatibility', 'Research']
const statuses: Array<'All' | StatusKey> = ['All', 'shipped', 'completed', 'in-progress', 'paused', 'planned', 'proposal']

function App() {
  const [view, setView] = useState<View>('overview')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [selectedWork, setSelectedWork] = useState<WorkItem | null>(null)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'All' | Category>('All')
  const [status, setStatus] = useState<'All' | StatusKey>('All')
  const [planTab, setPlanTab] = useState<PlanTab>('sprint')
  const searchRef = useRef<HTMLInputElement>(null)

  const countedItems = workItems.filter((item) => item.counted)
  const shippedCount = countedItems.filter((item) => item.status === 'shipped').length
  const completedCount = countedItems.filter((item) => item.status === 'completed').length
  const inProgressCount = countedItems.filter((item) => item.status === 'in-progress').length

  const filteredWork = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return workItems.filter((item) => {
      const matchesQuery = !normalizedQuery || [
        item.title,
        item.shortTitle,
        item.repository,
        item.summary,
        item.skills.join(' '),
        item.links.map((link) => link.label).join(' '),
      ].join(' ').toLowerCase().includes(normalizedQuery)
      return matchesQuery && (category === 'All' || item.category === category) && (status === 'All' || item.status === status)
    })
  }, [category, query, status])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setView('work')
        window.setTimeout(() => searchRef.current?.focus(), 0)
      }
      if (event.key === 'Escape') {
        setSelectedWork(null)
        setMobileNavOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedWork ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedWork])

  const navigate = (next: View) => {
    setView(next)
    setMobileNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><span>IQ</span></div>
          <div>
            <strong>Impact Atlas</strong>
            <span>Private working portfolio</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}>
                <Icon size={19} strokeWidth={1.8} />
                <span><strong>{item.label}</strong><small>{item.eyebrow}</small></span>
                <ChevronRight size={16} />
              </button>
            )
          })}
        </nav>

        <div className="sidebar-proof">
          <div className="proof-icon"><ShieldCheck size={18} /></div>
          <div><strong>Evidence standard</strong><p>Only verified work. Status boundaries stay explicit.</p></div>
        </div>

        <div className="sidebar-footer">
          <span className="avatar">SY</span>
          <div><strong>Shihua Yu</strong><small>QA · Engineering · Support</small></div>
        </div>
      </aside>

      {mobileNavOpen && <button className="nav-backdrop" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-canvas">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
          <div className="breadcrumb"><span>IQSS portfolio</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === view)?.label}</strong></div>
          <div className="topbar-actions">
            <button className="search-shortcut" onClick={() => { setView('work'); window.setTimeout(() => searchRef.current?.focus(), 0) }}>
              <Search size={15} /><span>Search work</span><kbd>⌘ K</kbd>
            </button>
            <div className="live-chip"><span /> Verified Sep 08, 2026</div>
          </div>
        </header>

        {view === 'overview' && (
          <Overview
            shippedCount={shippedCount}
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            onNavigate={navigate}
            onSelect={setSelectedWork}
          />
        )}
        {view === 'work' && (
          <WorkLedger
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            items={filteredWork}
            searchRef={searchRef}
            onSelect={setSelectedWork}
          />
        )}
        {view === 'stories' && <StoryBank onSelect={setSelectedWork} />}
        {view === 'plan' && <InterviewPlan tab={planTab} setTab={setPlanTab} />}
      </main>

      {selectedWork && <WorkDrawer item={selectedWork} onClose={() => setSelectedWork(null)} />}
    </div>
  )
}

function PageHeading({ eyebrow, title, body, action }: { eyebrow: string; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="page-heading">
      <div><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{body}</p></div>
      {action}
    </div>
  )
}

function Overview({ shippedCount, completedCount, inProgressCount, onNavigate, onSelect }: {
  shippedCount: number
  completedCount: number
  inProgressCount: number
  onNavigate: (view: View) => void
  onSelect: (item: WorkItem) => void
}) {
  const featured = workItems.filter((item) => item.featured).slice(0, 4)
  const delivered = shippedCount + completedCount

  return (
    <div className="page page--overview">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="section-kicker section-kicker--light"><Sparkles size={13} /> 2026 · IQSS / Dataverse</span>
          <h1>Quality work,<br /><em>made legible.</em></h1>
          <p>A verified record of engineering, QA judgment, production support, and the evidence behind every claim.</p>
          <div className="hero-actions">
            <button className="button button--bright" onClick={() => onNavigate('work')}>Explore all work <ArrowUpRight size={17} /></button>
            <button className="button button--ghost" onClick={() => onNavigate('stories')}>Open story bank</button>
          </div>
        </div>
        <div className="hero-visual" aria-label={`${delivered} of 14 assigned workstreams have complete delivery`}>
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="score-disc">
            <span>Complete delivery</span>
            <strong>{delivered}<small>/14</small></strong>
            <em>{Math.round((delivered / 14) * 100)}% verified</em>
          </div>
          <div className="floating-tag floating-tag--top"><Zap size={15} /> Production + CI</div>
          <div className="floating-tag floating-tag--bottom"><ShieldCheck size={15} /> Risk-first QA</div>
        </div>
      </section>

      <section className="metric-grid" aria-label="Portfolio totals">
        <MetricCard label="Assigned workstreams" value="14" note="12 started · 2 planned" icon={BriefcaseBusiness} tone="blue" />
        <MetricCard label="Complete delivery" value={String(delivered)} note={`${shippedCount} shipped · ${completedCount} QA/review`} icon={CheckCircle2} tone="green" />
        <MetricCard label="Authored PRs merged" value="5" note="Across 4 repositories" icon={GitPullRequest} tone="amber" />
        <MetricCard label="Implementation open" value={String(inProgressCount)} note="Status kept explicit" icon={Clock3} tone="violet" />
      </section>

      <section className="overview-grid">
        <div className="panel capability-panel">
          <div className="panel-heading"><div><span className="section-kicker">Evidence density</span><h2>Role capability map</h2></div><button className="text-button" onClick={() => onNavigate('plan')}>Full role fit <ArrowUpRight size={15} /></button></div>
          <div className="capability-list">
            {capabilityEvidence.map((item) => (
              <div className="capability-row" key={item.name} title={item.note}>
                <div><strong>{item.name}</strong><span>{item.evidence} evidence-backed stories</span></div>
                <div className="meter"><span style={{ width: `${Math.max(18, (item.evidence / 8) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel activity-panel">
          <div className="panel-heading"><div><span className="section-kicker">Delivery rhythm</span><h2>Workstream activity</h2></div><BarChart3 size={20} /></div>
          <div className="bar-chart" aria-label="Three workstreams in July, eight in August, three in September">
            {[['Jul', 3], ['Aug', 8], ['Sep', 3]].map(([month, count]) => (
              <div className="bar-column" key={month as string}>
                <div className="bar-value">{count}</div>
                <div className="bar-track"><span style={{ height: `${(Number(count) / 8) * 100}%` }} /></div>
                <strong>{month}</strong>
              </div>
            ))}
          </div>
          <div className="activity-insight"><TrendingUp size={17} /><p><strong>August was the execution peak.</strong> Eight streams across production, infrastructure, QA, review, and frontend engineering.</p></div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="section-kicker">Selected evidence</span><h2>Four stories that carry the portfolio</h2></div><button className="button button--outline" onClick={() => onNavigate('work')}>View all 16 records</button></div>
        <div className="featured-grid">
          {featured.map((item, index) => <FeaturedCard item={item} rank={index + 1} key={item.id} onClick={() => onSelect(item)} />)}
        </div>
      </section>

      <section className="principle-strip">
        <Compass size={25} />
        <div><span>Operating principle</span><strong>Problem → responsibility → judgment → action → evidence → result.</strong></div>
        <p>Not a tool list. Not inflated ownership. Every story starts with user impact and ends at the verified boundary.</p>
      </section>
    </div>
  )
}

function MetricCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof Target; tone: string }) {
  return (
    <div className={`metric-card metric-card--${tone}`}>
      <div className="metric-icon"><Icon size={19} /></div>
      <div><span>{label}</span><strong>{value}</strong><p>{note}</p></div>
    </div>
  )
}

function FeaturedCard({ item, rank, onClick }: { item: WorkItem; rank: number; onClick: () => void }) {
  return (
    <button className="featured-card" onClick={onClick}>
      <div className="featured-top"><span className="project-rank">0{rank}</span><StatusPill status={item.status} label={statusMeta[item.status].short} /></div>
      <div className="project-symbol">{item.shortTitle.split(' ').slice(0, 2).map((word) => word[0]).join('')}</div>
      <div><span className="repo-label">{item.repository}</span><h3>{item.shortTitle}</h3><p>{item.summary}</p></div>
      <div className="featured-footer"><span>{item.category}</span><span>Open case <ArrowUpRight size={14} /></span></div>
    </button>
  )
}

function WorkLedger({ query, setQuery, category, setCategory, status, setStatus, items, searchRef, onSelect }: {
  query: string
  setQuery: (value: string) => void
  category: 'All' | Category
  setCategory: (value: 'All' | Category) => void
  status: 'All' | StatusKey
  setStatus: (value: 'All' | StatusKey) => void
  items: WorkItem[]
  searchRef: React.RefObject<HTMLInputElement | null>
  onSelect: (item: WorkItem) => void
}) {
  const reset = () => { setQuery(''); setCategory('All'); setStatus('All') }
  return (
    <div className="page">
      <PageHeading
        eyebrow="Work ledger · 14 assigned + 2 initiatives"
        title="Every issue. Every PR. Exact boundaries."
        body="Search the complete record, filter by status or discipline, and open any card for the full problem-to-result evidence trail."
        action={<div className="heading-stat"><strong>{items.length}</strong><span>records shown</span></div>}
      />

      <section className="filter-panel">
        <label className="search-field"><Search size={18} /><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, repositories, skills, PRs…" /><kbd>⌘ K</kbd></label>
        <div className="filter-row">
          <div className="filter-group"><SlidersHorizontal size={16} /><span>Discipline</span>{categories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
          <label className="select-wrap">Status<select value={status} onChange={(event) => setStatus(event.target.value as 'All' | StatusKey)}>{statuses.map((item) => <option value={item} key={item}>{item === 'All' ? 'All statuses' : statusMeta[item].label}</option>)}</select></label>
        </div>
      </section>

      {items.length > 0 ? (
        <section className="work-grid">
          {items.map((item) => <WorkCard item={item} key={item.id} onClick={() => onSelect(item)} />)}
        </section>
      ) : (
        <div className="empty-state"><Search size={28} /><h2>No matching evidence</h2><p>Clear the filters or use a broader issue, repository, or skill term.</p><button className="button button--dark" onClick={reset}>Reset filters</button></div>
      )}
    </div>
  )
}

function WorkCard({ item, onClick }: { item: WorkItem; onClick: () => void }) {
  return (
    <button className="work-card" onClick={onClick}>
      <div className="work-card-head"><StatusPill status={item.status} label={item.statusLabel} /><span className="work-number">{item.number ? `#${String(item.number).padStart(2, '0')}` : 'EXTRA'}</span></div>
      <div className="work-card-body"><span className="repo-label">{item.repository}</span><h2>{item.shortTitle}</h2><p>{item.summary}</p></div>
      <div className="skill-row">{item.skills.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}</div>
      <div className="work-card-foot"><span>{item.date}</span><span>View evidence <ArrowUpRight size={14} /></span></div>
    </button>
  )
}

function StatusPill({ status, label }: { status: StatusKey; label: string }) {
  const Icon = statusIcon[status]
  return <span className={`status-pill status-pill--${status}`}><Icon size={13} />{label}</span>
}

function StoryBank({ onSelect }: { onSelect: (item: WorkItem) => void }) {
  const coreIds = ['localstack-1057', 'guestbook-12220', 'map-337', 'password-12544', 'roles-11919', 'featured-12381']
  const coreStories = coreIds.map((id) => workItems.find((item) => item.id === id)!).filter(Boolean)
  return (
    <div className="page">
      <PageHeading eyebrow="Interview story bank" title="Six stories. One repeatable spine." body="Each case is structured for a 60–90 second answer. Lead with impact and judgment; expand technical detail only when asked." />

      <section className="story-formula">
        {['Problem', 'Responsibility', 'Risk / Judgment', 'Actions', 'Validation', 'Result / Learning'].map((step, index) => (
          <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>{index < 5 && <ChevronRight size={16} />}</div>
        ))}
      </section>

      <section className="story-list">
        {coreStories.map((item, index) => (
          <button className="story-row" onClick={() => onSelect(item)} key={item.id}>
            <div className="story-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="story-main"><div><span className="repo-label">{item.category} · {item.repository}</span><h2>{item.shortTitle}</h2></div><p>{item.summary}</p></div>
            <div className="story-use"><span>Best for</span><strong>{item.interviewQuestions[0]}</strong></div>
            <div className="round-arrow"><ArrowUpRight size={17} /></div>
          </button>
        ))}
      </section>

      <section className="two-column-section">
        <div className="panel interview-map">
          <div className="panel-heading"><div><span className="section-kicker">Fast retrieval</span><h2>Question → evidence map</h2></div><Target size={20} /></div>
          <div className="map-table">
            {interviewMap.map(([question, primary, backup]) => <div key={question}><strong>{question}</strong><span>{primary}</span><em>{backup}</em></div>)}
          </div>
        </div>
        <div className="panel narrative-panel">
          <div className="panel-heading"><div><span className="section-kicker">90-second opening</span><h2>Core narrative</h2></div><MessageSquareQuote size={20} /></div>
          {intro.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="quote-note"><Sparkles size={17} /><span>Shift the frame from “I write code” to “I design QA systems, assess release risk, troubleshoot production, and drive resolution.”</span></div>
        </div>
      </section>
    </div>
  )
}

function InterviewPlan({ tab, setTab }: { tab: PlanTab; setTab: (tab: PlanTab) => void }) {
  return (
    <div className="page">
      <PageHeading eyebrow="Senior QA & Production Support Manager" title="Prepare for judgment, not trivia." body="The role fit is strongest where technical evidence becomes a release decision, a production diagnosis, or a repeatable QA system." />
      <div className="tab-bar" role="tablist">
        <button role="tab" aria-selected={tab === 'sprint'} className={tab === 'sprint' ? 'active' : ''} onClick={() => setTab('sprint')}><CalendarDays size={16} />10-day sprint</button>
        <button role="tab" aria-selected={tab === 'fit'} className={tab === 'fit' ? 'active' : ''} onClick={() => setTab('fit')}><Target size={16} />Role fit</button>
        <button role="tab" aria-selected={tab === 'kpi'} className={tab === 'kpi' ? 'active' : ''} onClick={() => setTab('kpi')}><BarChart3 size={16} />KPI & definition of done</button>
      </div>

      {tab === 'sprint' && (
        <section className="sprint-grid">
          {tenDayPlan.map(([day, title, detail], index) => <article className={`day-card ${index === 0 ? 'day-card--current' : ''}`} key={day}><div><span>{day}</span>{index === 0 && <em>Start here</em>}</div><strong>{title}</strong><p>{detail}</p><div className="day-line" /></article>)}
        </section>
      )}

      {tab === 'fit' && (
        <>
          <section className="role-table panel">
            <div className="role-table-head"><span>Role requirement</span><span>Priority</span><span>Verified evidence</span><span>Boundary / preparation gap</span></div>
            {roleRequirements.map(([requirement, priority, evidence, gap]) => <div className="role-table-row" key={requirement}><strong>{requirement}</strong><span className="priority-chip">{priority}</span><p>{evidence}</p><em>{gap}</em></div>)}
          </section>
          <section className="truth-panel"><ShieldCheck size={23} /><div><span>Truthful gap language</span><strong>“I haven’t owned that exact Dataverse production process yet. My closest experience is…, and my first step would be…”</strong><p>No formal direct-report claim. No Dataverse release-ownership claim. No PostgreSQL/JMeter experience invented to fill a box.</p></div></section>
        </>
      )}

      {tab === 'kpi' && (
        <>
          <section className="kpi-grid">{kpiFramework.map(([name, measure], index) => <article key={name}><div><span>{String(index + 1).padStart(2, '0')}</span><BarChart3 size={18} /></div><h2>{name}</h2><p>{measure}</p></article>)}</section>
          <section className="dod-section"><div className="section-heading"><div><span className="section-kicker">Operating contracts</span><h2>Definition of done by work type</h2></div></div><div className="dod-grid">{definitionsOfDone.map((item) => <article key={item.type}><span>{item.type}</span><ol>{item.steps.map((step) => <li key={step}><i><Check size={12} /></i>{step}</li>)}</ol></article>)}</div></section>
          <section className="scope-section"><div className="section-heading"><div><span className="section-kicker">Claim boundaries</span><h2>What stays outside the score</h2></div></div><div className="scope-grid">{scopeBoundaries.map((group) => <article key={group.label}><strong>{group.label}</strong>{group.items.map((item) => <p key={item}>{item}</p>)}</article>)}</div></section>
        </>
      )}
    </div>
  )
}

function WorkDrawer({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  const sections = [
    ['Problem / Situation', item.problem],
    ['Responsibility / Task', item.responsibility],
  ]
  return (
    <div className="drawer-layer" role="dialog" aria-modal="true" aria-label={`${item.shortTitle} details`}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close project details" />
      <aside className="drawer">
        <div className="drawer-head">
          <div><StatusPill status={item.status} label={item.statusLabel} /><span className="drawer-date">{item.date}</span></div>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="drawer-title"><span className="repo-label">{item.repository} · {item.category}</span><h1>{item.title}</h1><p>{item.summary}</p></div>
        {item.metrics && <div className="drawer-metrics">{item.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
        <div className="drawer-content">
          <div className="origin-card"><span>Origin & ownership</span><p>{item.source}</p><strong>{item.ownership}</strong></div>
          {sections.map(([title, text]) => <DetailSection title={title} key={title}><p>{text}</p></DetailSection>)}
          <DetailSection title="Risk / Judgment"><ul>{item.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></DetailSection>
          <DetailSection title="Actions"><ol>{item.actions.map((action) => <li key={action}>{action}</li>)}</ol></DetailSection>
          <DetailSection title="Validation / Evidence"><ul className="evidence-list">{item.validation.map((proof) => <li key={proof}><CheckCircle2 size={16} />{proof}</li>)}</ul></DetailSection>
          <DetailSection title="Result / Honest boundary"><p className="result-copy">{item.result}</p></DetailSection>
          <DetailSection title="Interview use"><div className="question-chips">{item.interviewQuestions.map((question) => <span key={question}>{question}</span>)}</div></DetailSection>
          <DetailSection title="Technologies & capabilities"><div className="skill-row skill-row--large">{item.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></DetailSection>
          <div className="drawer-links">
            {item.links.map((link) => <a href={link.url} target="_blank" rel="noreferrer" key={link.url}><span><GitPullRequest size={16} />{link.label}<small>{link.kind}</small></span><ExternalLink size={15} /></a>)}
          </div>
        </div>
      </aside>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="detail-section"><h2>{title}</h2>{children}</section>
}

export default App
