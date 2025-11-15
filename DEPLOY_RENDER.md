# Guia de Deploy no Render

Este guia explica como fazer deploy da aplicação no Render (plataforma gratuita).

## ⚠️ Problema Comum: "Environment variable not found: DATABASE_URL"

Se você receber este erro, consulte o arquivo **[RESOLVER_ERRO_DATABASE_URL.md](RESOLVER_ERRO_DATABASE_URL.md)** com soluções detalhadas.

**Resumo da solução**:
1. Criar banco de dados PostgreSQL no Render
2. Copiar a "Internal Database URL"
3. Adicionar como variável `DATABASE_URL` no backend
4. Fazer re-deploy

---

## Pré-requisitos

1. Conta no GitHub com o código commitado
2. Conta no Render (gratuita): https://render.com

---

## Método 1: Deploy Automático com render.yaml (RECOMENDADO)

### Passo 1: Preparar o Repositório

O arquivo `render.yaml` já está configurado no projeto. Ele cria automaticamente:
- Backend (API Node.js)
- Frontend (Site estático)
- Banco de dados PostgreSQL

### Passo 2: Deploy no Render

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"Blueprint"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `letscode`
5. Clique em **"Apply"**

O Render vai criar automaticamente:
- ✅ Banco de dados PostgreSQL
- ✅ API Backend
- ✅ Frontend

**Pronto!** Aguarde 5-10 minutos para o deploy completar.

---

## Método 2: Deploy Manual (Passo a Passo)

### Passo 1: Criar o Banco de Dados

1. No painel do Render, clique em **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `cehab-documentos-db`
   - **Database**: `cehab_documentos`
   - **User**: `cehab_user`
   - **Region**: Oregon (Free)
   - **Plan**: Free
3. Clique em **"Create Database"**
4. **IMPORTANTE**: Copie a **Internal Database URL** (você vai precisar)

### Passo 2: Deploy do Backend

1. Clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Configure:
   - **Name**: `cehab-api`
   - **Region**: Oregon (Free)
   - **Branch**: `claude/control-folder-document-output-016mHW614E9htP4Ltj7dvd2V`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**:
     ```
     npm install && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command**:
     ```
     npm start
     ```
   - **Plan**: Free

4. **Environment Variables** (clique em "Advanced"):
   - `DATABASE_URL`: Cole a Internal Database URL do Passo 1
   - `PORT`: `10000`
   - `NODE_ENV`: `production`

5. Clique em **"Create Web Service"**

### Passo 3: Deploy do Frontend

1. Clique em **"New +"** → **"Static Site"**
2. Conecte o mesmo repositório
3. Configure:
   - **Name**: `cehab-web`
   - **Branch**: `claude/control-folder-document-output-016mHW614E9htP4Ltj7dvd2V`
   - **Root Directory**: `frontend`
   - **Build Command**:
     ```
     npm install && npm run build
     ```
   - **Publish Directory**:
     ```
     dist
     ```

4. **IMPORTANTE**: Configurar proxy para API
   - Edite `frontend/vite.config.js` e ajuste o proxy para a URL do seu backend
   - OU crie variável de ambiente no frontend

5. Clique em **"Create Static Site"**

### Passo 4: Conectar Frontend ao Backend

Você precisa atualizar o código do frontend para apontar para a URL do backend.

**Opção A: Editar vite.config.js**

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://cehab-api.onrender.com', // Sua URL do backend
        changeOrigin: true
      }
    }
  }
})
```

**Opção B: Criar arquivo de configuração de API**

Edite `frontend/src/services/api.js`:

```javascript
const API_URL = import.meta.env.PROD
  ? 'https://cehab-api.onrender.com'
  : '/api'

const api = axios.create({
  baseURL: API_URL
})
```

---

## Configuração de CORS no Backend

O backend já está configurado com CORS, mas se tiver problemas, edite `backend/src/server.js`:

```javascript
app.use(cors({
  origin: ['https://cehab-web.onrender.com', 'http://localhost:3000'],
  credentials: true
}))
```

---

## URLs Finais

Após o deploy, você terá:

- **Frontend**: `https://cehab-web.onrender.com`
- **Backend API**: `https://cehab-api.onrender.com`
- **Database**: Gerenciado pelo Render

---

## Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"

**Solução**:
1. Vá em **Dashboard** → Seu serviço backend
2. Clique em **"Environment"** no menu lateral
3. Adicione a variável `DATABASE_URL` com a connection string do banco

### Erro: "Prisma migration failed"

**Solução**:
1. Certifique-se que o DATABASE_URL está correto
2. Verifique se o banco de dados está ativo
3. Tente rodar manualmente:
   ```bash
   npx prisma migrate deploy
   ```

### Frontend não conecta ao Backend

**Solução**:
1. Verifique se o CORS está configurado corretamente
2. Verifique se a URL da API no frontend está correta
3. Abra o console do navegador para ver erros

### Serviço fica "spinning down" (dorme)

No plano gratuito do Render, os serviços dormem após 15 minutos de inatividade. A primeira requisição pode demorar ~30 segundos.

**Solução**: Faça upgrade para plano pago ou use serviços como:
- [UptimeRobot](https://uptimerobot.com) para fazer ping a cada 5 minutos
- [Cron-Job.org](https://cron-job.org)

---

## Atualizações Futuras

Quando você fizer mudanças no código:

1. Faça commit e push para o GitHub
2. O Render detectará automaticamente
3. Fará re-deploy automático

Ou force manualmente:
1. Vá no Dashboard do serviço
2. Clique em **"Manual Deploy"** → **"Deploy latest commit"**

---

## Alternativas ao Render

Se tiver problemas com o Render:

- **Railway**: https://railway.app (similar ao Render)
- **Vercel** (frontend) + **Railway** (backend)
- **Cyclic**: https://cyclic.sh
- **Fly.io**: https://fly.io

---

## Suporte

Em caso de dúvidas:
- Documentação Render: https://render.com/docs
- Documentação Prisma: https://www.prisma.io/docs
