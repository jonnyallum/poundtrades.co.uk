import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { LoginForm } from './LoginForm'
import { SignUpForm } from './SignUpForm'

export function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode)

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  const handleClose = () => {
    setMode('login') // Reset to login mode when closing
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0">
        <DialogHeader className="sr-only">
          <h2>{mode === 'login' ? 'Sign In' : 'Sign Up'}</h2>
        </DialogHeader>
        
        <div className="p-6">
          {mode === 'login' ? (
            <LoginForm onToggleMode={toggleMode} onClose={handleClose} />
          ) : (
            <SignUpForm onToggleMode={toggleMode} onClose={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

