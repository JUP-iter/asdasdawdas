import { ArrowRight, BarChart3, BookOpenCheck, BrainCircuit, Check, FileCheck2, Menu, Sparkles, Target, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export function LandingPage() {
  const [menu, setMenu] = useState(false)
  return <div className="landing">
    <header className="landing-nav"><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={20}/></span><span>MadeByAibek</span></Link><nav className={menu ? 'open' : ''}><a href="#method">How it works</a><a href="#features">Skills</a><a href="#progress">Progress</a><Link to="/login">Log in</Link><Link to="/signup" className="nav-cta">Start learning <ArrowRight size={15}/></Link></nav><button className="landing-menu" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button></header>
    <main>
      <section className="hero"><div className="hero-copy"><span className="hero-kicker"><span></span> English that adapts to you</span><h1>Build your English.<br/><em>One skill at a time.</em></h1><p>Personalized practice for grammar, vocabulary, reading, and writing—guided by what you need most.</p><div className="hero-actions"><Link to="/signup"><Button>Start learning <ArrowRight size={17}/></Button></Link><Link to="/diagnostic"><Button variant="secondary">Take a diagnostic</Button></Link></div><div className="hero-proof"><span><Check/> No credit card</span><span><Check/> 8-minute setup</span><span><Check/> Built for B1–C1</span></div></div>
        <div className="hero-product">
          <div className="product-window"><div className="window-bar"><i/><i/><i/><span>madebyaibek.app/dashboard</span></div><div className="mini-app"><aside><div className="mini-logo">M</div>{[1,2,3,4,5].map(n=><span key={n} className={n===1?'active':''}/>)}</aside><div className="mini-main"><div className="mini-header"><div><small>MONDAY, 19 SEPTEMBER</small><strong>Good morning, Maya.</strong></div><div className="mini-avatar">M</div></div><div className="mini-grid"><div className="mini-level"><small>YOUR ENGLISH LEVEL</small><strong>B1<span>+</span></strong><p>67% toward B2</p><div className="mini-progress"><i/></div></div><div className="mini-recommend"><small>RECOMMENDED FOR YOU</small><div className="mini-icon"><BrainCircuit/></div><strong>Complex conditionals</strong><p>10 questions · 7 min</p><button>Continue <ArrowRight/></button></div></div><div className="mini-skills">{[['Grammar',72],['Vocabulary',67],['Reading',81],['Writing',59]].map(([x,v])=><div key={x}><span>{x}</span><strong>{v}%</strong><i><b style={{width:`${v}%`}}/></i></div>)}</div></div></div>
          </div><div className="float-card float-one"><Target/><div><span>Weak area detected</span><strong>Complex grammar</strong></div></div><div className="float-card float-two"><span className="float-check"><Check/></span><div><span>Lesson complete</span><strong>+45 XP earned</strong></div></div>
        </div>
      </section>
      <section className="logos"><span>Built for focused learners at</span><div><strong>NORTHBRIDGE</strong><strong>OXFORD STUDY</strong><strong>IELTS<span>+</span></strong><strong>CAMBRIA</strong><strong>ACADEMIA</strong></div></section>
      <section className="method" id="method"><div className="section-intro"><span className="eyebrow">A smarter learning loop</span><h2>Know where you are.<br/>Know what comes next.</h2><p>MadeByAibek turns every answer into a clearer path forward, so your practice is always focused.</p></div><div className="method-grid">{[
        [BarChart3,'01','Assess','A short diagnostic maps your skill level across grammar, vocabulary, reading, and writing.'],
        [Target,'02','Focus','MadeByAibek finds the exact patterns holding you back—not just a general level.'],
        [BookOpenCheck,'03','Practice','Complete targeted, bite-sized sessions with useful explanations for every answer.'],
        [BrainCircuit,'04','Adapt','Your learning plan updates with each session, keeping challenge at the right level.'],
      ].map((item)=>{const [Icon,n,title,desc]=item as [typeof BarChart3,string,string,string];return <article key={n}><div className="method-icon"><Icon/></div><span>{n}</span><h3>{title}</h3><p>{desc}</p></article>})}</div></section>
      <section className="feature-band" id="features"><div><span className="eyebrow">Six skills. One clear profile.</span><h2>Everything you need to move forward.</h2><p>Build balanced English with connected practice that sees the whole picture.</p></div><div className="feature-cards">{[[BookOpenCheck,'Grammar','Master everyday and complex structures with explanations that make rules stick.'],[BrainCircuit,'Vocabulary','Learn useful words in context, review them at the right time, and build academic range.'],[FileCheck2,'Essay feedback','See individual errors, recurring patterns, and the next skills worth practicing.']].map((item)=>{const [Icon,title,description]=item as [typeof BookOpenCheck,string,string];return <article key={title}><Icon/><h3>{title}</h3><p>{description}</p><span>Explore skill <ArrowRight/></span></article>})}</div></section>
      <section className="landing-cta" id="progress"><Sparkles/><h2>Your next level is closer<br/>than it looks.</h2><p>Start with a short diagnostic. Leave with a learning plan built for you.</p><Link to="/signup"><Button>Build my learning plan <ArrowRight size={17}/></Button></Link></section>
    </main>
    <footer><Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18}/></span><span>MadeByAibek</span></Link><p>Thoughtful English practice for ambitious learners.</p><span>© 2026 MadeByAibek</span></footer>
  </div>
}
