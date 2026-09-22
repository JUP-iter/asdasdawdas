import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'

export function Button({ children, variant = 'primary', loading, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; loading?: boolean }) {
  return <button className={`button button-${variant} ${className}`} disabled={loading || props.disabled} {...props}>
    {loading ? <LoaderCircle size={17} className="spin" /> : null}{children}
  </button>
}
export function Card({ children, className = '', ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode }) { return <section className={`card ${className}`} {...props}>{children}</section> }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'blue' }) { return <span className={`badge badge-${tone}`}>{children}</span> }
export function ProgressBar({ value, color, label }: { value: number; color?: string; label?: string }) { return <div className="progress-wrap" aria-label={label ?? `${value}% complete`}><div className="progress-track"><span style={{ width: `${value}%`, background: color }} /></div></div> }
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) { return <div className="empty-state"><div className="empty-icon">{icon}</div><h3>{title}</h3><p>{description}</p>{action}</div> }
export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) { return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action}</div> }
export function ArrowLink({ children }: { children: ReactNode }) { return <span className="arrow-link">{children}<ArrowRight size={15} /></span> }
