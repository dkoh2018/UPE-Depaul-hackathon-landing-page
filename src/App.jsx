import React from 'react'
import { Background, PATTERNS } from './components/backgrounds'
import RegistrationForm from './components/RegistrationForm'

function App() {
  return (
    <Background pattern={PATTERNS.SCANLINES}>
      <RegistrationForm />
    </Background>
  )
}

export default App
