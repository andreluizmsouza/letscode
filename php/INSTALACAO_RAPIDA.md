# ⚡ Instalação Rápida - 5 Minutos

## Passo 1: Copiar Arquivos
Copie a pasta `php` para seu servidor web:
- XAMPP: `C:\xampp\htdocs\cehab\`
- Outros: pasta do Apache/IIS

## Passo 2: Criar Banco de Dados
1. Abra SQL Server Management Studio
2. Execute o arquivo `database.sql`
3. Pronto! Banco criado com tabelas e procedures

## Passo 3: Configurar Conexão
Edite `config/config.php` linha 8-11:

```php
define('DB_SERVER', 'localhost');  // ou localhost\SQLEXPRESS
define('DB_NAME', 'CEHAB_Controle_Documentos');
define('DB_USER', 'sa');  // seu usuário
define('DB_PASS', 'SuaSenha123');  // sua senha
```

## Passo 4: Acessar Sistema
Abra no navegador:
```
http://localhost/cehab/public/
```

## Pronto! ✅

Se der erro, veja o arquivo `README_PHP.md` com troubleshooting completo.

---

## Checklist Rápido

- [ ] PHP 8.3 instalado
- [ ] SQL Server 2022 rodando
- [ ] Driver `pdo_sqlsrv` instalado no PHP
- [ ] Arquivos copiados para pasta do servidor
- [ ] Banco de dados criado (executou database.sql)
- [ ] Configuração ajustada em config/config.php
- [ ] mod_rewrite habilitado (Apache)

**Tudo OK?** Acesse o sistema!

---

## Comandos Úteis

**Verificar se extensão está instalada:**
```bash
php -m | findstr sqlsrv
```

**Habilitar mod_rewrite (Apache):**
```bash
# No httpd.conf, descomente:
LoadModule rewrite_module modules/mod_rewrite.so
```

**Reiniciar Apache:**
```bash
# XAMPP
C:\xampp\apache_stop.bat
C:\xampp\apache_start.bat
```

---

## Problemas Comuns

### ❌ Erro: "Could not find driver"
✅ Instale driver SQL Server para PHP:
https://learn.microsoft.com/en-us/sql/connect/php/download-drivers-php-sql-server

### ❌ Erro: "Login failed"
✅ Verifique usuário/senha no config.php

### ❌ Erro: 404 na API
✅ Verifique mod_rewrite do Apache ou acesse:
`http://localhost/cehab/api/pastas.php`

---

**Precisa de ajuda?** Consulte `README_PHP.md`
