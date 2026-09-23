import { Check, Highlighter, Maximize2, MessageSquarePlus, Minimize2, NotebookPen, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import type { IntegratedSummaryText } from '../types'
import { Card } from './ui'

type HighlightColor='yellow'|'green'|'blue'|'rose'

interface ReaderHighlight{
  id:string
  paragraphIndex:number
  start:number
  end:number
  quote:string
  color:HighlightColor
  comment:string
}

interface SelectedText{
  paragraphIndex:number
  start:number
  end:number
  quote:string
  left:number
  top:number
}

const colors:HighlightColor[]=['yellow','green','blue','rose']
const colorLabels:Record<HighlightColor,string>={yellow:'Yellow',green:'Green',blue:'Blue',rose:'Rose'}

function savedReaderState(key:string){
  try{
    const stored=localStorage.getItem(key)
    if(!stored)return{highlights:[] as ReaderHighlight[],notes:''}
    const parsed=JSON.parse(stored) as {highlights?:ReaderHighlight[];notes?:string}
    return{highlights:Array.isArray(parsed.highlights)?parsed.highlights:[],notes:typeof parsed.notes==='string'?parsed.notes:''}
  }catch{return{highlights:[] as ReaderHighlight[],notes:''}}
}

function selectionOffset(container:HTMLElement,node:Node,offset:number){
  const before=document.createRange()
  before.selectNodeContents(container)
  before.setEnd(node,offset)
  return before.toString().length
}

function id(){
  try{return crypto.randomUUID()}catch{return`${Date.now()}-${Math.random().toString(36).slice(2)}`}
}

export function SourceReader({text,storageScope='local'}:{text:IntegratedSummaryText;storageScope?:string}){
  const storageKey=`madebyaibek-reader:${storageScope}:${text.id}`
  const initial=useMemo(()=>savedReaderState(storageKey),[storageKey])
  const [highlights,setHighlights]=useState<ReaderHighlight[]>(initial.highlights)
  const [notes,setNotes]=useState(initial.notes)
  const [fontSize,setFontSize]=useState(17)
  const [fullScreen,setFullScreen]=useState(false)
  const [selection,setSelection]=useState<SelectedText|null>(null)
  const [composer,setComposer]=useState<{selection:SelectedText;color:HighlightColor}|null>(null)
  const [comment,setComment]=useState('')
  const [status,setStatus]=useState('Select a sentence or phrase to highlight it or attach a comment.')
  const [activeHighlight,setActiveHighlight]=useState<string|null>(null)
  const commentInput=useRef<HTMLTextAreaElement>(null)

  useEffect(()=>{
    const next=savedReaderState(storageKey)
    setHighlights(next.highlights)
    setNotes(next.notes)
    setSelection(null)
    setComposer(null)
  },[storageKey])

  useEffect(()=>{
    try{localStorage.setItem(storageKey,JSON.stringify({highlights,notes}))}catch{/* Reader remains usable if storage is unavailable. */}
  },[highlights,notes,storageKey])

  useEffect(()=>{
    if(!composer)return
    requestAnimationFrame(()=>commentInput.current?.focus())
  },[composer])

  useEffect(()=>{
    if(!fullScreen)return
    const previous=document.body.style.overflow
    document.body.style.overflow='hidden'
    const close=(event:globalThis.KeyboardEvent)=>{if(event.key==='Escape')setFullScreen(false)}
    window.addEventListener('keydown',close)
    return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',close)}
  },[fullScreen])

  const captureSelection=(_event:MouseEvent|KeyboardEvent)=>{
    const selected=window.getSelection()
    if(!selected||selected.isCollapsed||!selected.rangeCount){setSelection(null);return}
    const range=selected.getRangeAt(0)
    const startElement=(range.startContainer.nodeType===Node.ELEMENT_NODE?range.startContainer:range.startContainer.parentElement) as HTMLElement|null
    const endElement=(range.endContainer.nodeType===Node.ELEMENT_NODE?range.endContainer:range.endContainer.parentElement) as HTMLElement|null
    const startParagraph=startElement?.closest<HTMLElement>('[data-source-paragraph]')
    const endParagraph=endElement?.closest<HTMLElement>('[data-source-paragraph]')
    if(!startParagraph||startParagraph!==endParagraph){
      setSelection(null)
      setStatus('For a precise highlight, select text inside one paragraph.')
      return
    }
    const quote=range.toString().trim()
    if(!quote){setSelection(null);return}
    let start=selectionOffset(startParagraph,range.startContainer,range.startOffset)
    let end=selectionOffset(startParagraph,range.endContainer,range.endOffset)
    while(start<end&&/\s/.test(text.paragraphs[Number(startParagraph.dataset.sourceParagraph)]?.[start]??''))start++
    while(end>start&&/\s/.test(text.paragraphs[Number(startParagraph.dataset.sourceParagraph)]?.[end-1]??''))end--
    const rect=range.getBoundingClientRect()
    setSelection({
      paragraphIndex:Number(startParagraph.dataset.sourceParagraph),
      start,
      end,
      quote:text.paragraphs[Number(startParagraph.dataset.sourceParagraph)].slice(start,end),
      left:Math.min(window.innerWidth-176,Math.max(12,rect.left+rect.width/2-82)),
      top:Math.min(window.innerHeight-58,rect.bottom+9),
    })
    setStatus('Choose a highlight color or attach a comment to this passage.')
  }

  const clearBrowserSelection=()=>{window.getSelection()?.removeAllRanges();setSelection(null)}
  const addHighlight=(selected:SelectedText,color:HighlightColor,annotation='')=>{
    const overlaps=highlights.some(item=>item.paragraphIndex===selected.paragraphIndex&&selected.start<item.end&&selected.end>item.start)
    if(overlaps){setStatus('That passage already contains a highlight. Remove it before creating another one.');clearBrowserSelection();return}
    setHighlights(items=>[...items,{id:id(),paragraphIndex:selected.paragraphIndex,start:selected.start,end:selected.end,quote:selected.quote,color,comment:annotation.trim()}])
    setStatus(annotation.trim()?'Comment and highlight saved.':'Highlight saved. You can add a comment in the notebook.')
    clearBrowserSelection()
  }

  const openComposer=(selected:SelectedText)=>{
    setComposer({selection:selected,color:'blue'})
    setComment('')
    clearBrowserSelection()
  }

  const saveComment=()=>{
    if(!composer||!comment.trim())return
    addHighlight(composer.selection,composer.color,comment)
    setComposer(null)
    setComment('')
  }

  const renderParagraph=(paragraph:string,paragraphIndex:number):ReactNode=>{
    const marks=highlights.filter(item=>item.paragraphIndex===paragraphIndex).sort((a,b)=>a.start-b.start)
    const parts:ReactNode[]=[]
    let cursor=0
    for(const mark of marks){
      if(mark.start<cursor||mark.end>paragraph.length)continue
      if(mark.start>cursor)parts.push(paragraph.slice(cursor,mark.start))
      parts.push(<mark
        className={`reader-highlight reader-highlight-${mark.color}${activeHighlight===mark.id?' active':''}`}
        key={mark.id}
        title={mark.comment||'Saved highlight'}
        onClick={()=>setActiveHighlight(mark.id)}
      >{paragraph.slice(mark.start,mark.end)}</mark>)
      cursor=mark.end
    }
    if(cursor<paragraph.length)parts.push(paragraph.slice(cursor))
    return parts
  }

  const wordCount=text.paragraphs.join(' ').trim().split(/\s+/).length
  const readerStyle={'--reader-font-size':`${fontSize}px`} as CSSProperties

  return <Card className={`source-pane source-reader${fullScreen?' source-pane-fullscreen':''}`}>
    <div className="pane-heading source-reader-heading">
      <div><span className="eyebrow">SOURCE TEXT</span><small>{wordCount.toLocaleString()} words · annotations save automatically</small></div>
      <div className="reader-controls" role="toolbar" aria-label="Reading controls">
        <button type="button" onClick={()=>setFontSize(size=>Math.max(15,size-1))} aria-label="Decrease text size" title="Decrease text size">A−</button>
        <button type="button" onClick={()=>setFontSize(size=>Math.min(22,size+1))} aria-label="Increase text size" title="Increase text size">A+</button>
        <button type="button" className="reader-fullscreen-button" onClick={()=>setFullScreen(value=>!value)} aria-label={fullScreen?'Exit full screen':'Open text full screen'}>
          {fullScreen?<Minimize2/>:<Maximize2/>}<span>{fullScreen?'Exit':'Full screen'}</span>
        </button>
      </div>
    </div>

    <div className="reader-status"><Highlighter/>{status}</div>
    <div className="source-reader-body">
      <div className="source-reader-main">
        <article
          className="source-reader-article"
          style={readerStyle}
          onMouseUp={captureSelection}
          onKeyUp={captureSelection}
        >
          {text.paragraphs.map((paragraph,index)=><p data-source-paragraph={index} key={index}>{renderParagraph(paragraph,index)}</p>)}
        </article>
        <div className="summary-glossary"><h3>Glossary</h3>{text.glossary.map(item=><div key={item.term}><strong>{item.term}</strong><span>{item.definition}</span></div>)}</div>
      </div>

      <aside className="reader-notebook">
        <div className="reader-notebook-title"><NotebookPen/><div><strong>Reading notes</strong><span>Private to this browser</span></div></div>
        <textarea value={notes} onChange={event=>setNotes(event.target.value)} placeholder="Write key ideas, unfamiliar terms, connections, or a possible topic sentence…" aria-label="Notes for this source text"/>
        <small><Check/> Saved automatically</small>
        <div className="reader-highlights-head"><strong>Highlights & comments</strong><span>{highlights.length}</span></div>
        {highlights.length===0?<p className="reader-empty-highlights">Select a phrase in the source text to create your first highlight.</p>:<div className="reader-highlight-list">{highlights.map(item=><div className={`reader-highlight-card ${item.color}${activeHighlight===item.id?' active':''}`} key={item.id} onClick={()=>setActiveHighlight(item.id)}>
          <div><span>“{item.quote}”</span><button type="button" onClick={event=>{event.stopPropagation();setHighlights(items=>items.filter(mark=>mark.id!==item.id));if(activeHighlight===item.id)setActiveHighlight(null)}} aria-label="Delete highlight"><Trash2/></button></div>
          <textarea value={item.comment} onChange={event=>setHighlights(items=>items.map(mark=>mark.id===item.id?{...mark,comment:event.target.value}:mark))} onClick={event=>event.stopPropagation()} placeholder="Add a comment to this highlight…" aria-label={`Comment on ${item.quote}`}/>
        </div>)}</div>}
      </aside>
    </div>

    {selection&&<div className="source-selection-toolbar" style={{left:selection.left,top:selection.top}} role="toolbar" aria-label="Highlight selected text">
      {colors.map(color=><button type="button" className={`highlight-swatch ${color}`} onClick={()=>addHighlight(selection,color)} aria-label={`Highlight ${colorLabels[color].toLowerCase()}`} title={`${colorLabels[color]} highlight`} key={color}/>) }
      <button type="button" className="selection-comment" onClick={()=>openComposer(selection)} title="Add comment"><MessageSquarePlus/></button>
      <button type="button" className="selection-close" onClick={clearBrowserSelection} title="Cancel"><X/></button>
    </div>}

    {composer&&<div className="reader-comment-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setComposer(null)}}><div className="reader-comment-composer" role="dialog" aria-modal="true" aria-label="Add a comment to highlighted text">
      <div><MessageSquarePlus/><strong>Comment on selection</strong><button type="button" onClick={()=>setComposer(null)} aria-label="Close comment dialog"><X/></button></div>
      <blockquote>“{composer.selection.quote}”</blockquote>
      <label>Highlight color<div className="comment-colors">{colors.map(color=><button type="button" className={`${color}${composer.color===color?' selected':''}`} onClick={()=>setComposer(value=>value?{...value,color}:value)} aria-label={colorLabels[color]} key={color}/>)}</div></label>
      <textarea ref={commentInput} value={comment} onChange={event=>setComment(event.target.value)} placeholder="Why is this important? What does it connect to?"/>
      <div><button type="button" onClick={()=>setComposer(null)}>Cancel</button><button type="button" className="save-reader-comment" disabled={!comment.trim()} onClick={saveComment}>Save comment</button></div>
    </div></div>}
  </Card>
}
