import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

export const pastasAPI = {
  listar: () => api.get('/pastas'),
  buscar: (id) => api.get(`/pastas/${id}`),
  registrarSaida: (dados) => api.post('/pastas', dados),
  registrarRecebimento: (id, responsavel) =>
    api.patch(`/pastas/${id}/recebimento`, { responsavelRecebimento: responsavel }),
  registrarRetorno: (id, dados) =>
    api.patch(`/pastas/${id}/retorno`, dados),
  deletar: (id) => api.delete(`/pastas/${id}`)
}

export default api
