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

### Deploy no Render (Recomendado - Gratuito)

Este projeto está configurado para deploy automático no Render.

**Método Rápido (Blueprint):**
1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Blueprint"
3. Conecte seu repositório GitHub
4. Clique em "Apply"

O Render criará automaticamente:
- ✅ Backend (API Node.js)
- ✅ Frontend (Site estático)
- ✅ Banco de dados PostgreSQL

**Instruções Detalhadas:** Veja o arquivo [DEPLOY_RENDER.md](DEPLOY_RENDER.md)

### Outras Opções de Deploy

- **Railway**: https://railway.app
- **Vercel** (frontend) + **Railway** (backend)
- **Cyclic**: https://cyclic.sh
- **Fly.io**: https://fly.io

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
