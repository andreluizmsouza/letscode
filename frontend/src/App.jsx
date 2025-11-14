import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import ListaPastas from './pages/ListaPastas'
import RegistrarSaida from './pages/RegistrarSaida'
import DetalhesPasta from './pages/DetalhesPasta'

function App() {
  const [currentPage, setCurrentPage] = useState('lista')

  return (
    <Router>
      <div className="App">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/pastas" replace />} />
            <Route
              path="/pastas"
              element={<ListaPastas setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/registrar"
              element={<RegistrarSaida setCurrentPage={setCurrentPage} />}
            />
            <Route
              path="/pastas/:id"
              element={<DetalhesPasta setCurrentPage={setCurrentPage} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
