// Configuração da API
const API_URL = '/api/pastas';

// Estado da aplicação
let pastas = [];
let pastaAtual = null;

// Navegação entre páginas
function navegarPara(pagina) {
    // Remover active de todas as páginas e botões
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Ativar página e botão correspondente
    document.getElementById('page-' + pagina).classList.add('active');
    document.querySelector(`[data-page="${pagina}"]`)?.classList.add('active');

    // Carregar dados se necessário
    if (pagina === 'lista') {
        carregarPastas();
    }
}

// Configurar botões de navegação
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pagina = btn.getAttribute('data-page');
        navegarPara(pagina);
    });
});

// Formatar data
function formatarData(data) {
    if (!data) return '-';
    const d = new Date(data);
    return d.toLocaleString('pt-BR');
}

// Carregar lista de pastas
async function carregarPastas() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const container = document.getElementById('lista-container');

    loading.style.display = 'block';
    error.style.display = 'none';
    container.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar pastas');

        pastas = await response.json();
        loading.style.display = 'none';

        if (pastas.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #757575; padding: 20px;">Nenhuma pasta registrada ainda.</p>';
            return;
        }

        // Criar tabela
        let html = `
            <div class="table-container">
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
        `;

        pastas.forEach(pasta => {
            html += `
                <tr>
                    <td>${pasta.numero}</td>
                    <td>${pasta.descricao}</td>
                    <td>${pasta.tipoDocumento}</td>
                    <td>${formatarData(pasta.dataSaida)}</td>
                    <td><span class="status-badge status-${pasta.status}">${pasta.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="verDetalhes(${pasta.id})">Ver Detalhes</button>
                            <button class="btn btn-danger" onclick="deletarPasta(${pasta.id})">Deletar</button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;

    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = 'Erro ao carregar pastas: ' + err.message;
    }
}

// Ver detalhes da pasta
async function verDetalhes(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Pasta não encontrada');

        pastaAtual = await response.json();
        mostrarDetalhes();

    } catch (err) {
        alert('Erro ao carregar detalhes: ' + err.message);
    }
}

// Mostrar detalhes
function mostrarDetalhes() {
    const container = document.getElementById('detalhes-container');
    const pasta = pastaAtual;

    let html = `
        <div style="margin-bottom: 20px;">
            <span class="status-badge status-${pasta.status}">${pasta.status}</span>
        </div>

        <div class="detail-row">
            <div class="detail-label">Número:</div>
            <div class="detail-value">${pasta.numero}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Descrição:</div>
            <div class="detail-value">${pasta.descricao}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Tipo de Documento:</div>
            <div class="detail-value">${pasta.tipoDocumento}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Quantidade de Documentos:</div>
            <div class="detail-value">${pasta.quantidadeDocumentos}</div>
        </div>
    `;

    if (pasta.observacoes) {
        html += `
            <div class="detail-row">
                <div class="detail-label">Observações:</div>
                <div class="detail-value">${pasta.observacoes}</div>
            </div>
        `;
    }

    html += `
        <h3 style="margin-top: 30px; margin-bottom: 15px;">Histórico</h3>

        <div class="detail-row">
            <div class="detail-label">Data de Saída:</div>
            <div class="detail-value">${formatarData(pasta.dataSaida)}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Responsável pela Saída:</div>
            <div class="detail-value">${pasta.responsavelSaida}</div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Data de Recebimento:</div>
            <div class="detail-value">${formatarData(pasta.dataRecebimento)}</div>
        </div>
    `;

    if (pasta.responsavelRecebimento) {
        html += `
            <div class="detail-row">
                <div class="detail-label">Responsável Recebimento:</div>
                <div class="detail-value">${pasta.responsavelRecebimento}</div>
            </div>
        `;
    }

    html += `
        <div class="detail-row">
            <div class="detail-label">Data de Retorno:</div>
            <div class="detail-value">${formatarData(pasta.dataRetorno)}</div>
        </div>
    `;

    if (pasta.responsavelRetorno) {
        html += `
            <div class="detail-row">
                <div class="detail-label">Responsável Retorno:</div>
                <div class="detail-value">${pasta.responsavelRetorno}</div>
            </div>
        `;
    }

    if (pasta.observacoesRetorno) {
        html += `
            <div class="detail-row">
                <div class="detail-label">Observações do Retorno:</div>
                <div class="detail-value">${pasta.observacoesRetorno}</div>
            </div>
        `;
    }

    // Botões de ação
    if (pasta.status === 'ENVIADO') {
        html += `
            <div class="button-group">
                <button class="btn btn-success" onclick="mostrarFormRecebimento()">Registrar Recebimento</button>
            </div>
            <div id="form-recebimento" style="display: none; margin-top: 20px;">
                <div class="form-group">
                    <label>Responsável pelo Recebimento *</label>
                    <input type="text" id="resp-recebimento" placeholder="Nome do responsável na NovaGM">
                </div>
                <div class="button-group">
                    <button class="btn btn-success" onclick="registrarRecebimento()">Confirmar Recebimento</button>
                    <button class="btn btn-secondary" onclick="esconderFormRecebimento()">Cancelar</button>
                </div>
            </div>
        `;
    } else if (pasta.status === 'RECEBIDO') {
        html += `
            <div class="button-group">
                <button class="btn btn-success" onclick="mostrarFormRetorno()">Registrar Retorno</button>
            </div>
            <div id="form-retorno" style="display: none; margin-top: 20px;">
                <div class="form-group">
                    <label>Responsável pelo Retorno *</label>
                    <input type="text" id="resp-retorno" placeholder="Nome do responsável">
                </div>
                <div class="form-group">
                    <label>Observações do Retorno</label>
                    <textarea id="obs-retorno" placeholder="Informações adicionais sobre o retorno (opcional)"></textarea>
                </div>
                <div class="button-group">
                    <button class="btn btn-success" onclick="registrarRetorno()">Confirmar Retorno</button>
                    <button class="btn btn-secondary" onclick="esconderFormRetorno()">Cancelar</button>
                </div>
            </div>
        `;
    }

    html += `
        <div class="button-group" style="margin-top: 30px;">
            <button class="btn btn-secondary" onclick="navegarPara('lista')">Voltar para Lista</button>
        </div>
    `;

    container.innerHTML = html;
    navegarPara('detalhes');
}

// Forms de recebimento e retorno
function mostrarFormRecebimento() {
    document.getElementById('form-recebimento').style.display = 'block';
}

function esconderFormRecebimento() {
    document.getElementById('form-recebimento').style.display = 'none';
}

function mostrarFormRetorno() {
    document.getElementById('form-retorno').style.display = 'block';
}

function esconderFormRetorno() {
    document.getElementById('form-retorno').style.display = 'none';
}

// Registrar recebimento
async function registrarRecebimento() {
    const responsavel = document.getElementById('resp-recebimento').value;

    if (!responsavel) {
        alert('Por favor, informe o responsável pelo recebimento');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${pastaAtual.id}/recebimento`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responsavelRecebimento: responsavel })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao registrar recebimento');
        }

        pastaAtual = await response.json();
        mostrarDetalhes();

    } catch (err) {
        alert('Erro: ' + err.message);
    }
}

// Registrar retorno
async function registrarRetorno() {
    const responsavel = document.getElementById('resp-retorno').value;
    const observacoes = document.getElementById('obs-retorno').value;

    if (!responsavel) {
        alert('Por favor, informe o responsável pelo retorno');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${pastaAtual.id}/retorno`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                responsavelRetorno: responsavel,
                observacoesRetorno: observacoes || null
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao registrar retorno');
        }

        pastaAtual = await response.json();
        mostrarDetalhes();

    } catch (err) {
        alert('Erro: ' + err.message);
    }
}

// Deletar pasta
async function deletarPasta(id) {
    if (!confirm('Tem certeza que deseja deletar esta pasta?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar pasta');

        carregarPastas();

    } catch (err) {
        alert('Erro ao deletar: ' + err.message);
    }
}

// Form de registro de saída
document.getElementById('form-saida').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formError = document.getElementById('form-error');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    formError.style.display = 'none';
    formSuccess.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registrando...';

    const dados = {
        numero: document.getElementById('numero').value,
        descricao: document.getElementById('descricao').value,
        tipoDocumento: document.getElementById('tipoDocumento').value,
        quantidadeDocumentos: parseInt(document.getElementById('quantidadeDocumentos').value),
        responsavelSaida: document.getElementById('responsavelSaida').value,
        observacoes: document.getElementById('observacoes').value || null
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao registrar saída');
        }

        formSuccess.style.display = 'block';
        formSuccess.textContent = 'Saída registrada com sucesso! Redirecionando...';

        e.target.reset();

        setTimeout(() => {
            navegarPara('lista');
        }, 2000);

    } catch (err) {
        formError.style.display = 'block';
        formError.textContent = 'Erro: ' + err.message;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrar Saída';
    }
});

// Carregar pastas ao iniciar
carregarPastas();
