import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pastasAPI } from '../services/api'

function ListaPastas({ setCurrentPage }) {
  const [pastas, setPastas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentPage('lista')
    carregarPastas()
  }, [])

  const carregarPastas = async () => {
    try {
      setLoading(true)
      const response = await pastasAPI.listar()
      setPastas(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar pastas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (data) => {
    if (!data) return '-'
    return new Date(data).toLocaleString('pt-BR')
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'ENVIADO': return 'status-enviado'
      case 'RECEBIDO': return 'status-recebido'
      case 'RETORNADO': return 'status-retornado'
      default: return ''
    }
  }

  const handleDeletar = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta pasta?')) {
      return
    }

    try {
      await pastasAPI.deletar(id)
      carregarPastas()
    } catch (err) {
      alert('Erro ao deletar pasta')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div>
      <div className="card">
        <h2>Lista de Pastas</h2>
        {error && <div className="error">{error}</div>}

        {pastas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#757575', padding: '20px' }}>
            Nenhuma pasta registrada ainda.
          </p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Data Saída</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pastas.map((pasta) => (
                  <tr key={pasta.id}>
                    <td>{pasta.numero}</td>
                    <td>{pasta.descricao}</td>
                    <td>{pasta.tipoDocumento}</td>
                    <td>{formatarData(pasta.dataSaida)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(pasta.status)}`}>
                        {pasta.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/pastas/${pasta.id}`)}
                        >
                          Ver Detalhes
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeletar(pasta.id)}
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListaPastas
