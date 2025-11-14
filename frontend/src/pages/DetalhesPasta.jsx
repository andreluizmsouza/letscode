import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { pastasAPI } from '../services/api'

function DetalhesPasta({ setCurrentPage }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pasta, setPasta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRecebimentoForm, setShowRecebimentoForm] = useState(false)
  const [showRetornoForm, setShowRetornoForm] = useState(false)
  const [responsavelRecebimento, setResponsavelRecebimento] = useState('')
  const [responsavelRetorno, setResponsavelRetorno] = useState('')
  const [observacoesRetorno, setObservacoesRetorno] = useState('')

  useEffect(() => {
    setCurrentPage('detalhes')
    carregarPasta()
  }, [id])

  const carregarPasta = async () => {
    try {
      setLoading(true)
      const response = await pastasAPI.buscar(id)
      setPasta(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar detalhes da pasta')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatarData = (data) => {
    if (!data) return '-'
    return new Date(data).toLocaleString('pt-BR')
  }

  const handleRecebimento = async (e) => {
    e.preventDefault()
    try {
      await pastasAPI.registrarRecebimento(id, responsavelRecebimento)
      setShowRecebimentoForm(false)
      setResponsavelRecebimento('')
      carregarPasta()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao registrar recebimento')
    }
  }

  const handleRetorno = async (e) => {
    e.preventDefault()
    try {
      await pastasAPI.registrarRetorno(id, {
        responsavelRetorno,
        observacoesRetorno
      })
      setShowRetornoForm(false)
      setResponsavelRetorno('')
      setObservacoesRetorno('')
      carregarPasta()
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao registrar retorno')
    }
  }

  if (loading) {
    return <div className="loading">Carregando...</div>
  }

  if (error) {
    return (
      <div className="card">
        <div className="error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/pastas')}>
          Voltar
        </button>
      </div>
    )
  }

  if (!pasta) {
    return <div className="loading">Pasta não encontrada</div>
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'ENVIADO': return 'status-enviado'
      case 'RECEBIDO': return 'status-recebido'
      case 'RETORNADO': return 'status-retornado'
      default: return ''
    }
  }

  return (
    <div>
      <div className="card">
        <h2>Detalhes da Pasta</h2>

        <div style={{ marginBottom: '20px' }}>
          <span className={`status-badge ${getStatusClass(pasta.status)}`}>
            {pasta.status}
          </span>
        </div>

        <div className="detail-row">
          <div className="detail-label">Número:</div>
          <div className="detail-value">{pasta.numero}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Descrição:</div>
          <div className="detail-value">{pasta.descricao}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Tipo de Documento:</div>
          <div className="detail-value">{pasta.tipoDocumento}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Quantidade de Documentos:</div>
          <div className="detail-value">{pasta.quantidadeDocumentos}</div>
        </div>

        {pasta.observacoes && (
          <div className="detail-row">
            <div className="detail-label">Observações:</div>
            <div className="detail-value">{pasta.observacoes}</div>
          </div>
        )}

        <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Histórico</h3>

        <div className="detail-row">
          <div className="detail-label">Data de Saída:</div>
          <div className="detail-value">{formatarData(pasta.dataSaida)}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Responsável pela Saída:</div>
          <div className="detail-value">{pasta.responsavelSaida}</div>
        </div>

        <div className="detail-row">
          <div className="detail-label">Data de Recebimento:</div>
          <div className="detail-value">{formatarData(pasta.dataRecebimento)}</div>
        </div>

        {pasta.responsavelRecebimento && (
          <div className="detail-row">
            <div className="detail-label">Responsável Recebimento:</div>
            <div className="detail-value">{pasta.responsavelRecebimento}</div>
          </div>
        )}

        <div className="detail-row">
          <div className="detail-label">Data de Retorno:</div>
          <div className="detail-value">{formatarData(pasta.dataRetorno)}</div>
        </div>

        {pasta.responsavelRetorno && (
          <div className="detail-row">
            <div className="detail-label">Responsável Retorno:</div>
            <div className="detail-value">{pasta.responsavelRetorno}</div>
          </div>
        )}

        {pasta.observacoesRetorno && (
          <div className="detail-row">
            <div className="detail-label">Observações do Retorno:</div>
            <div className="detail-value">{pasta.observacoesRetorno}</div>
          </div>
        )}

        {/* Formulário de Recebimento */}
        {pasta.status === 'ENVIADO' && !showRecebimentoForm && (
          <div className="button-group">
            <button
              className="btn btn-success"
              onClick={() => setShowRecebimentoForm(true)}
            >
              Registrar Recebimento
            </button>
          </div>
        )}

        {showRecebimentoForm && (
          <form onSubmit={handleRecebimento} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Responsável pelo Recebimento *</label>
              <input
                type="text"
                value={responsavelRecebimento}
                onChange={(e) => setResponsavelRecebimento(e.target.value)}
                required
                placeholder="Nome do responsável na NovaGM"
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-success">
                Confirmar Recebimento
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRecebimentoForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Formulário de Retorno */}
        {pasta.status === 'RECEBIDO' && !showRetornoForm && (
          <div className="button-group">
            <button
              className="btn btn-success"
              onClick={() => setShowRetornoForm(true)}
            >
              Registrar Retorno
            </button>
          </div>
        )}

        {showRetornoForm && (
          <form onSubmit={handleRetorno} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>Responsável pelo Retorno *</label>
              <input
                type="text"
                value={responsavelRetorno}
                onChange={(e) => setResponsavelRetorno(e.target.value)}
                required
                placeholder="Nome do responsável"
              />
            </div>
            <div className="form-group">
              <label>Observações do Retorno</label>
              <textarea
                value={observacoesRetorno}
                onChange={(e) => setObservacoesRetorno(e.target.value)}
                placeholder="Informações adicionais sobre o retorno (opcional)"
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-success">
                Confirmar Retorno
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRetornoForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        <div className="button-group" style={{ marginTop: '30px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/pastas')}
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetalhesPasta
