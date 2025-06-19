import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'

// AppContent组件
import AppContent from './components/AppContent'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
