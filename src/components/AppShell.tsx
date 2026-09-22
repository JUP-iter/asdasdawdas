import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BarChart3, BookOpen, BrainCircuit, ChevronDown, FilePenLine, FileText, Flame, GraduationCap, LayoutDashboard, LibraryBig, Lightbulb, LogOut, Menu, Search, Sparkles, UserRound, X, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useApp } from '../state/AppContext'
import { complexTopics, grammarTopics, readings, vocabulary } from '../data/seed'

const links = [
  ['Dashboard', '/app', LayoutDashboard], ['Grammar', '/app/grammar', BookOpen], ['Complex Grammar', '/app/complex-grammar', BrainCircuit], ['Vocabulary', '/app/vocabulary', LibraryBig], ['Reading', '/app/reading', GraduationCap], ['Main Ideas', '/app/main-ideas', Lightbulb], ['Integrated Skills Summary', '/app/integrated-summary', FileText], ['Essay Checker', '/app/essay', FilePenLine], ['Progress', '/app/progress', BarChart3],
] as const

export function AppShell() {
  const { user, logout } = useApp(); const [open, setOpen] = useState(false); const [searchOpen,setSearchOpen]=useState(false); const [query,setQuery]=useState(''); const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(()=>{const handler=(event:KeyboardEvent)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setSearchOpen(value=>!value)}if(event.key==='Escape')setSearchOpen(false)};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[])
  if (!user) return null
  const hasMeasurements=user.skills.some(skill=>skill.assessed)
  const searchItems=[...links.map(([label,to])=>({label,meta:'Section',to})),...grammarTopics.map(item=>({label:item.title,meta:`Grammar · ${item.level}`,to:'/app/grammar'})),...complexTopics.map(item=>({label:item.title,meta:`Complex grammar · ${item.level}`,to:'/app/complex-grammar'})),...vocabulary.map(item=>({label:item.word,meta:`Vocabulary · ${item.level}`,to:'/app/vocabulary'})),...readings.map(item=>({label:item.title,meta:`Reading · ${item.level}`,to:'/app/reading'}))].filter(item=>`${item.label} ${item.meta}`.toLowerCase().includes(query.toLowerCase())).slice(0,10)
  return <div className="app-shell">
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button>
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <NavLink to="/" className="brand"><span className="brand-mark"><Sparkles size={20}/></span><span>MadeByAibek</span></NavLink>
      <div className="sidebar-level"><div className="level-orb">{user.level}</div><div><span>Your English</span><strong>{hasMeasurements?`${user.levelProgress}% measured`:'Not assessed'}</strong></div></div>
      <nav>{links.map(([label,to,Icon]) => <NavLink key={to} to={to} end={to === '/app'}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="sidebar-foot">
        <div className="streak-pill"><Flame size={18}/><div><strong>{user.streak} day streak</strong><span>{user.streak?'Keep it going':'No practice yet'}</span></div></div>
        <NavLink to="/app/profile" className="profile-button"><span>{user.name[0]}</span><div><strong>{user.name}</strong><small>Level {Math.floor(user.xp / 100) + 1}</small></div><ChevronDown size={15}/></NavLink>
        <button className="logout-button" onClick={logout}><LogOut size={16}/> Log out</button>
      </div>
    </aside>
    {open && <div className="mobile-scrim" onClick={() => setOpen(false)} />}
    <main className="app-main">
      <header className="app-topbar"><button className="topbar-search" onClick={()=>setSearchOpen(true)}><Search size={17}/><span>Search lessons, words, topics…</span><kbd>Ctrl K</kbd></button><div className="topbar-stats"><span><Zap size={16}/> {user.xp.toLocaleString()} XP</span><NavLink to="/app/profile"><UserRound size={18}/></NavLink></div></header>
      <div className="page-container"><Outlet /></div>
    </main>
    <nav className="bottom-nav">{links.slice(0,5).map(([label,to,Icon]) => <NavLink key={to} to={to} end={to === '/app'}><Icon size={20}/><span>{label === 'Complex Grammar' ? 'Advanced' : label}</span></NavLink>)}</nav>
    {searchOpen&&<div className="search-overlay" onMouseDown={()=>setSearchOpen(false)}><div className="search-dialog" onMouseDown={event=>event.stopPropagation()}><div className="search-input"><Search/><input autoFocus value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search MadeByAibek…"/><button onClick={()=>setSearchOpen(false)}><X/></button></div><div className="search-results">{searchItems.length?searchItems.map((item,index)=><NavLink key={`${item.to}-${item.label}-${index}`} to={item.to} onClick={()=>{setSearchOpen(false);setQuery('')}}><Search/><div><strong>{item.label}</strong><span>{item.meta}</span></div><ChevronDown/></NavLink>):<div className="search-empty">No matching lessons, words, or passages.</div>}</div></div></div>}
  </div>
}
