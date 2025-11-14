import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { pastasAPI } from '../services/api'

function RegistrarSaida({ setCurrentPage }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    numero: '',
    descricao: '',
    tipoDocumento: 'Contrato',
    quantidadeDocumentos: '',
    observacoes: '',
    responsavelSaida: ''
  })

  useEffect(() => {
    setCurrentPage('registrar')
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await pastasAPI.registrarSaida(formData)
      setSuccess(true)
      setFormData({
        numero: '',
        descricao: '',
        tipoDocumento: 'Contrato',
        quantidadeDocumentos: '',
        observacoes: '',
        responsavelSaida: ''
      })

      setTimeout(() => {
        navigate('/pastas')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao registrar saída')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Registrar Saída de Pasta</h2>
        <p style={{ color: '#757575', marginBottom: '20px' }}>
          Preencha os dados da pasta que está sendo enviada para digitalização na NovaGM
        </p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">Saída registrada com sucesso! Redirecionando...</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="numero">Número da Pasta *</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              placeholder="Ex: P-2024-001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição *</label>
            <input
              type="text"
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              placeholder="Ex: Contratos de locação 2024"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoDocumento">Tipo de Documento *</label>
            <select
              id="tipoDocumento"
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              required
            >
              <option value="Contrato">Contrato</option>
              <option value="Termo">Termo</option>
              <option value="Processo">Processo</option>
              <option value="Relatório">Relatório</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantidadeDocumentos">Quantidade de Documentos *</label>
            <input
              type="number"
              id="quantidadeDocumentos"
              name="quantidadeDocumentos"
              value={formData.quantidadeDocumentos}
              onChange={handleChange}
              required
              min="1"
              placeholder="Ex: 50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsavelSaida">Responsável pela Saída *</label>
            <input
              type="text"
              id="responsavelSaida"
              name="responsavelSaida"
              value={formData.responsavelSaida}
              onChange={handleChange}
              required
              placeholder="Nome do responsável"
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacoes">Observações</label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Informações adicionais (opcional)"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Saída'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/pastas')}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegistrarSaida
