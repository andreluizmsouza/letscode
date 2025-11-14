import { useNavigate } from 'react-router-dom'

function Header({ currentPage, setCurrentPage }) {
  const navigate = useNavigate()

  const handleNavigation = (page, path) => {
    setCurrentPage(page)
    navigate(path)
  }

  return (
    <div className="header">
      <h1>Controle de Documentos - CEHAB-RJ</h1>
      <p>Sistema de controle de saída de pastas para digitalização</p>
      <div className="nav">
        <button
          className={currentPage === 'lista' ? 'active' : ''}
          onClick={() => handleNavigation('lista', '/pastas')}
        >
          Listar Pastas
        </button>
        <button
          className={currentPage === 'registrar' ? 'active' : ''}
          onClick={() => handleNavigation('registrar', '/registrar')}
        >
          Registrar Saída
        </button>
      </div>
    </div>
  )
}

export default Header
