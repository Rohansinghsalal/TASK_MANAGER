import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import routes from './routes.jsx'
import Navbar from './components/Navbar.jsx'
import { useEffect } from 'react'
import { checkApiHealth } from './api/taskApi'

function App() {
  // Check API connection on app startup
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await checkApiHealth()
      } catch {
        // API unavailable, silently continue
      }
    }
    
    checkConnection()
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {routes.map((route, index) => (
          <Route 
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App
