import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui'

export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return{failed:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('MadeByAibek UI error',error,info)}
  render(){if(this.state.failed)return <div className="fatal-error"><AlertTriangle/><h1>Something went wrong.</h1><p>Your data is safe. Reload the application to restore this screen.</p><Button onClick={()=>location.reload()}>Reload MadeByAibek</Button></div>;return this.props.children}
}
