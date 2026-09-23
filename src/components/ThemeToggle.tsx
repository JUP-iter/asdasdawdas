import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

type Theme='light'|'dark'

const currentTheme=():Theme=>document.documentElement.dataset.theme==='dark'?'dark':'light'

export function ThemeToggle(){
  const[theme,setTheme]=useState<Theme>(currentTheme)
  const toggle=()=>{
    const next=theme==='light'?'dark':'light'
    document.documentElement.dataset.theme=next
    document.documentElement.style.colorScheme=next
    try{localStorage.setItem('madebyaibek-theme',next)}catch{/* Theme still changes when browser storage is unavailable. */}
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next==='dark'?'#0a0f15':'#f6f7f3')
    setTheme(next)
  }
  const dark=theme==='dark'
  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={`Switch to ${dark?'day':'night'} theme`} aria-pressed={dark} title={`Switch to ${dark?'day':'night'} theme`}>{dark?<Sun/>:<Moon/>}<span>{dark?'Day':'Night'}</span></button>
}
