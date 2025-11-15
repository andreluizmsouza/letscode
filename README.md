# Sistema de Controle de Documentos - CEHAB-RJ

Sistema para controlar a saída de pastas com documentos (contratos) para digitalização, registrando o fluxo de saída do Depósito CEHAB-RJ para a NovaGM, o recebimento e o retorno dos documentos.

## Funcionalidades

- **Registrar Saída**: Registro completo de pastas enviadas para digitalização
- **Registrar Recebimento**: Confirmação de recebimento pela NovaGM
- **Registrar Retorno**: Registro do retorno dos documentos digitalizados
- **Listar Pastas**: Visualização de todas as pastas com seus status
- **Detalhes**: Visualização completa do histórico de cada pasta

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL (produção) / SQLite (desenvolvimento)

### Frontend
- React
- Vite
- React Router DOM
- Axios

## Estrutura do Projeto

```
letscode/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma    # Modelo de dados
│   ├── src/
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── routes/          # Rotas da API
│   │   └── server.js        # Servidor Express
│   ├── .env                 # Variáveis de ambiente
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── App.jsx          # Componente principal
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passo 1: Instalar dependências do Backend

```bash
cd backend
npm install
```

### Passo 2: Configurar banco de dados

```bash
# Ainda no diretório backend
npx prisma generate
npx prisma migrate dev --name init
```

### Passo 3: Instalar dependências do Frontend

```bash
cd ../frontend
npm install
```

## Como Executar

### Executar o Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3001`

### Executar o Frontend

Em outro terminal:

```bash
cd frontend
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Uso do Sistema

### 1. Registrar Saída de Pasta

1. Clique em "Registrar Saída" no menu
2. Preencha os dados:
   - Número da pasta
   - Descrição
   - Tipo de documento
   - Quantidade de documentos
   - Responsável pela saída
   - Observações (opcional)
3. Clique em "Registrar Saída"

A pasta será registrada com status **ENVIADO**.

### 2. Registrar Recebimento

1. Na lista de pastas, clique em "Ver Detalhes" na pasta desejada
2. Clique em "Registrar Recebimento"
3. Informe o responsável pelo recebimento na NovaGM
4. Confirme

O status da pasta mudará para **RECEBIDO**.

### 3. Registrar Retorno

1. Na página de detalhes da pasta
2. Clique em "Registrar Retorno"
3. Informe:
   - Responsável pelo retorno
   - Observações sobre o retorno (opcional)
4. Confirme

O status da pasta mudará para **RETORNADO**.

## Status das Pastas

- **ENVIADO**: Pasta foi enviada para a NovaGM
- **RECEBIDO**: NovaGM confirmou o recebimento
- **RETORNADO**: Pasta foi devolvida após digitalização

## API Endpoints

### GET /api/pastas
Lista todas as pastas

### GET /api/pastas/:id
Busca uma pasta específica

### POST /api/pastas
Registra saída de uma nova pasta

Body:
```json
{
  "numero": "P-2024-001",
  "descricao": "Contratos de locação",
  "tipoDocumento": "Contrato",
  "quantidadeDocumentos": 50,
  "responsavelSaida": "João Silva",
  "observacoes": "Documentos urgentes"
}
```

### PATCH /api/pastas/:id/recebimento
Registra recebimento da pasta

Body:
```json
{
  "responsavelRecebimento": "Maria Santos"
}
```

### PATCH /api/pastas/:id/retorno
Registra retorno da pasta

Body:
```json
{
  "responsavelRetorno": "João Silva",
  "observacoesRetorno": "Documentos digitalizados com sucesso"
}
```

### DELETE /api/pastas/:id
Deleta uma pasta

## Deploy em Produção

### 🚀 Qual plataforma escolher?

| Plataforma | Facilidade | Gratuito | Melhor Para |
|------------|-----------|----------|-------------|
| **Railway** ⭐ | ⭐⭐⭐⭐⭐ | $5/mês grátis | Iniciantes - Mais fácil! |
| **Render** | ⭐⭐⭐ | ✅ Sim | Quem quer 100% gratuito |
| **Vercel + Railway** | ⭐⭐⭐⭐ | Parcial | Performance máxima |

**Recomendação**: Use **Railway** se está começando - é muito mais simples!

---

### Opção 1: Railway (MAIS FÁCIL) ⭐

Railway detecta tudo automaticamente e é super simples!

**Método Rápido:**
1. Acesse https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Configure **Root Directory**: `backend`
4. "Add PostgreSQL" no mesmo projeto
5. Criar novo serviço → GitHub → Root Directory: `frontend`
6. Pronto! ✨

**Instruções Detalhadas:** [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md)

**Custo**: $5 gratuitos/mês, depois ~$5-10/mês

---

### Opção 2: Render (100% Gratuito)

Render é totalmente gratuito mas requer configuração manual.

**Método Blueprint:**
1. Acesse https://dashboard.render.com
2. "New +" → "Blueprint"
3. Conecte seu repositório GitHub
4. "Apply"

**⚠️ Importante**: Você precisa configurar a variável `DATABASE_URL` manualmente.

**Instruções Detalhadas:**
- [DEPLOY_RENDER.md](DEPLOY_RENDER.md)
- [RESOLVER_ERRO_DATABASE_URL.md](RESOLVER_ERRO_DATABASE_URL.md) - Se tiver erro

**Custo**: 100% gratuito (com limitações)

---

### Outras Opções

- **Vercel** (frontend) + **Railway** (backend) - Melhor performance
- **Cyclic**: https://cyclic.sh - Simples mas limitado
- **Fly.io**: https://fly.io - Para usuários avançados

## Desenvolvimento

### Scripts Disponíveis

Backend:
- `npm start`: Inicia o servidor
- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Build para produção (gera Prisma Client e migrations)
- `npx prisma studio`: Abre interface visual do banco de dados

Frontend:
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm run preview`: Visualiza build de produção

## Licença

MIT
