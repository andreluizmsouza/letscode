# Deploy no Railway - Guia Passo a Passo

Railway é mais simples que o Render! Vamos fazer o deploy correto do seu projeto.

## 🚀 Método Correto para Railway (Monorepo)

Como o projeto tem **backend e frontend separados**, você precisa criar **2 serviços diferentes** no Railway.

---

## Passo 1: Criar Banco de Dados

1. Acesse https://railway.app e faça login
2. Clique em **"New Project"**
3. Selecione **"Provision PostgreSQL"**
4. Aguarde o banco ser criado (30 segundos)
5. ✅ O Railway gera a variável `DATABASE_URL` automaticamente!

---

## Passo 2: Deploy do Backend

1. No mesmo projeto, clique em **"New Service"** (botão + ou "Add Service")
2. Selecione **"GitHub Repo"**
3. Escolha o repositório `letscode`
4. **IMPORTANTE**: Clique em **"Settings"** do serviço
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: (deixe vazio, o nixpacks.toml vai cuidar)
   - **Start Command**: (deixe vazio, o nixpacks.toml vai cuidar)

6. **Variables** (aba Variables):
   - Railway já criou `DATABASE_URL` automaticamente!
   - Adicione manualmente:
     - `NODE_ENV` = `production`
     - `PORT` = `${{RAILWAY_PORT}}` (isso é automático, mas pode verificar)

7. Clique em **"Deploy"**

---

## Passo 3: Deploy do Frontend

1. No mesmo projeto, clique em **"New Service"** novamente
2. Selecione **"GitHub Repo"**
3. Escolha o mesmo repositório `letscode`
4. Configure em **"Settings"**:
   - **Root Directory**: `frontend`
   - **Build Command**: (deixe vazio)
   - **Start Command**: (deixe vazio)

5. **Variables**:
   - Copie a URL do backend (ex: `https://backend-production-xxxx.up.railway.app`)
   - Adicione:
     - `VITE_API_URL` = `https://SEU-BACKEND-URL/api` (substitua pela URL do backend)

6. Clique em **"Deploy"**

---

## Passo 4: Conectar os Serviços

Após os 2 deploys:

1. Vá no serviço do **Frontend**
2. Em **Variables**, edite `VITE_API_URL`
3. Cole a URL do backend que o Railway gerou
4. **Re-deploy** o frontend

---

## ✅ Verificação Final

Você deve ter no projeto:
- 🗄️ **PostgreSQL Database** (1 serviço)
- 🔧 **Backend** (1 serviço - Node.js)
- 🎨 **Frontend** (1 serviço - Static)

**Total: 3 serviços no mesmo projeto**

---

## 🎯 Alternativa MAIS FÁCIL: Deploy Separado

Se o método acima está complicado, faça assim:

### Projeto 1: Backend + Banco

1. **"New Project"** → **"Deploy from GitHub repo"**
2. Selecione `letscode`
3. Configure **Root Directory**: `backend`
4. Railway detecta automaticamente!
5. Clique em **"Add Plugin"** → **"PostgreSQL"**
6. Railway conecta tudo sozinho! ✨

### Projeto 2: Frontend

1. **"New Project"** → **"Deploy from GitHub repo"**
2. Selecione `letscode`
3. Configure **Root Directory**: `frontend`
4. Adicione variável `VITE_API_URL` com a URL do backend do Projeto 1
5. Deploy! ✨

---

## 🔧 Comandos do Railway CLI (Opcional)

Se quiser usar a linha de comando:

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# No diretório backend
cd backend
railway init
railway up

# No diretório frontend
cd ../frontend
railway init
railway up
```

---

## 📋 Checklist de Deploy

**Backend:**
- [ ] Root Directory configurado para `backend`
- [ ] PostgreSQL criado e conectado
- [ ] Variável `DATABASE_URL` presente
- [ ] Variável `NODE_ENV` = `production`
- [ ] Deploy bem-sucedido
- [ ] Migrations executadas

**Frontend:**
- [ ] Root Directory configurado para `frontend`
- [ ] Variável `VITE_API_URL` configurada
- [ ] Build executado com sucesso
- [ ] Consegue acessar a URL gerada

---

## ⚠️ Problemas Comuns

### "Error creating build plan with Railpack"

**Causa**: Railway não sabe qual parte do monorepo fazer build

**Solução**: Configure **Root Directory** nas Settings do serviço!

### Frontend não conecta ao Backend

**Causa**: CORS ou URL incorreta

**Soluções**:
1. Verifique se `VITE_API_URL` está correta (deve terminar com `/api`)
2. Verifique CORS no backend
3. Use a URL **pública** do backend (não a interna)

### Migrations não executam

**Causa**: DATABASE_URL não está configurada

**Solução**:
1. Adicione PostgreSQL no mesmo projeto
2. Railway conecta automaticamente

---

## 💰 Custos

Railway oferece:
- **$5 grátis por mês** para novos usuários
- Depois: ~$5-10/mês dependendo do uso
- Pode cancelar quando quiser

**Dica**: Para economizar, delete os serviços quando não estiver usando!

---

## 🆚 Railway vs Render

**Railway:**
- ✅ Mais fácil de configurar
- ✅ Detecta automaticamente tecnologias
- ✅ Interface mais moderna
- ⚠️ Pago após $5 gratuitos

**Render:**
- ✅ Totalmente gratuito
- ✅ Não dorme (no plano pago)
- ⚠️ Configuração mais manual
- ⚠️ Serviços gratuitos "dormem"

---

## 🎓 Resumo Executivo

**Opção Mais Fácil (Railway):**
1. Novo projeto → GitHub repo
2. Root Directory: `backend`
3. Add PostgreSQL
4. Novo serviço no mesmo projeto → GitHub repo
5. Root Directory: `frontend`
6. Adicionar VITE_API_URL
7. Pronto! ✨

**Tempo estimado**: 5-10 minutos

---

## 📞 Precisa de Ajuda?

- Documentação Railway: https://docs.railway.app
- Discord Railway: https://discord.gg/railway
- Suporte: help@railway.app

Boa sorte! 🚀
