# Como Resolver: "Environment variable not found: DATABASE_URL"

Este erro acontece quando você está fazendo deploy no Render e a variável `DATABASE_URL` não está configurada.

## Solução Rápida (Blueprint - Recomendado)

Se você ainda não fez o deploy, use o método **Blueprint** que configura tudo automaticamente:

1. Acesse: https://dashboard.render.com
2. Clique em: **"New +" → "Blueprint"**
3. Conecte seu repositório GitHub
4. Selecione o repositório `letscode`
5. Clique em **"Apply"**

**IMPORTANTE**: O Blueprint vai criar automaticamente o banco de dados E configurar a variável DATABASE_URL para você!

---

## Solução Manual (Se você já tentou fazer deploy)

### Cenário 1: Você criou apenas o Backend (sem banco de dados)

**Passo 1: Criar o Banco de Dados**

1. No dashboard do Render: https://dashboard.render.com
2. Clique em **"New +" → "PostgreSQL"**
3. Configure:
   - **Name**: `cehab-documentos-db`
   - **Database**: `cehab_documentos`
   - **Region**: Oregon (Free)
   - **Plan**: Free
4. Clique em **"Create Database"**
5. Aguarde o banco ser criado (1-2 minutos)

**Passo 2: Copiar a Connection String**

1. Quando o banco estiver pronto, clique nele
2. Role para baixo até **"Connections"**
3. Copie a **"Internal Database URL"** (não a External!)
   - Deve começar com: `postgresql://cehab_user:...`

**Passo 3: Adicionar no Backend**

1. Vá para o seu serviço de backend (cehab-controle-documentos-api)
2. No menu lateral, clique em **"Environment"**
3. Clique em **"Add Environment Variable"**
4. Configure:
   - **Key**: `DATABASE_URL`
   - **Value**: Cole a Internal Database URL que você copiou
5. Clique em **"Save Changes"**

**Passo 4: Re-deploy**

1. No menu lateral, clique em **"Manual Deploy"**
2. Clique em **"Clear build cache & deploy"**

Aguarde 3-5 minutos. O deploy deve funcionar agora!

---

### Cenário 2: Você criou o banco mas não conectou

Se você já criou o banco de dados mas esqueceu de conectar:

1. Vá no seu banco de dados PostgreSQL
2. Copie a **"Internal Database URL"**
3. Vá no seu serviço de backend
4. Clique em **"Environment"** → **"Add Environment Variable"**
5. Adicione:
   - Key: `DATABASE_URL`
   - Value: A URL que você copiou
6. Salve e faça um **"Clear build cache & deploy"**

---

### Cenário 3: Erro ao usar Blueprint

Se você tentou usar o Blueprint e deu erro:

**Possível causa**: O Render pode não ter criado o banco automaticamente.

**Solução**:

1. Verifique se há um banco de dados criado no dashboard
2. Se não houver, crie manualmente (veja Cenário 1)
3. Depois conecte ao backend (veja passos acima)

---

## Verificação Final

Para confirmar que está tudo certo:

1. Vá no serviço de **backend**
2. Clique em **"Environment"** no menu lateral
3. Você deve ver estas variáveis:
   - ✅ `DATABASE_URL` (com um valor longo começando com `postgresql://`)
   - ✅ `NODE_ENV` = `production`
   - ✅ `PORT` = `10000`

Se todas estiverem lá, faça um re-deploy!

---

## Comandos de Build Corretos

Certifique-se que o backend tem estas configurações:

**Build Command:**
```
cd backend && npm install && npx prisma generate && npx prisma migrate deploy
```

**Start Command:**
```
cd backend && npm start
```

**Root Directory:** (deixe em branco ou vazio)

---

## Ainda com Problemas?

### Erro: "Prisma schema validation"

**Causa**: O arquivo `schema.prisma` não consegue encontrar a variável DATABASE_URL

**Solução**: Certifique-se que:
1. A variável `DATABASE_URL` está configurada no Environment
2. O valor não está vazio
3. Você fez um re-deploy após adicionar a variável

### Erro: "Migration failed"

**Causa**: O banco de dados não está acessível ou a URL está incorreta

**Solução**:
1. Verifique se o banco de dados está "Available" (não "Creating")
2. Certifique-se de copiar a **Internal Database URL** (não a External)
3. A URL deve começar com `postgresql://` e terminar com o nome do banco

### Erro: "Connection timeout"

**Causa**: O backend não consegue conectar ao banco

**Solução**:
1. Certifique-se que o banco e o backend estão na **mesma região** (Oregon)
2. Use a **Internal Database URL** (não a External)

---

## Alternativa: Usar outro serviço

Se você continuar tendo problemas com o Render, considere:

### Railway (Mais fácil)

1. Acesse: https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Selecione `letscode`
4. Railway detecta automaticamente e cria tudo!
5. **Vantagem**: Configuração mais automática que o Render

### Vercel + Supabase

1. Frontend no Vercel (gratuito)
2. Backend + Banco no Supabase (gratuito)
3. Muito estável e rápido

---

## TL;DR (Resumo)

1. **Crie um banco PostgreSQL** no Render
2. **Copie a Internal Database URL**
3. **Adicione como variável de ambiente** `DATABASE_URL` no backend
4. **Faça re-deploy**

Pronto! 🚀

---

**Precisa de mais ajuda?**
- Documentação Render: https://render.com/docs/databases
- Documentação Prisma: https://www.prisma.io/docs/guides/deployment
