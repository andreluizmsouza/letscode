# Sistema de Controle de Documentos CEHAB-RJ
## Versão PHP 8.3 + SQL Server 2022

Sistema para controlar a saída de pastas com documentos (contratos) para digitalização, registrando o fluxo completo: saída do Depósito CEHAB-RJ → NovaGM → recebimento → retorno.

## 🚀 Tecnologias

- **Backend**: PHP 8.3
- **Banco de Dados**: SQL Server 2022
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Servidor Web**: Apache/IIS com mod_rewrite

## 📁 Estrutura do Projeto

```
php/
├── api/
│   └── pastas.php          # Endpoint principal da API REST
├── classes/
│   ├── Database.php        # Conexão com SQL Server
│   └── Pasta.php           # Model da Pasta
├── config/
│   └── config.php          # Configurações do sistema
├── public/
│   ├── css/
│   │   └── style.css       # Estilos
│   ├── js/
│   │   └── app.js          # Lógica do frontend
│   └── index.html          # Página principal
├── .htaccess               # Configuração Apache
├── database.sql            # Script de criação do banco
└── README_PHP.md           # Este arquivo
```

## ⚙️ Pré-requisitos

1. **PHP 8.3** instalado
2. **SQL Server 2022** (ou versão compatível)
3. **Servidor Web**: Apache com mod_rewrite OU IIS
4. **Extensão PHP**: `pdo_sqlsrv` (driver SQL Server para PHP)

### Instalar Driver SQL Server para PHP no Windows

1. Baixe os drivers Microsoft: https://learn.microsoft.com/en-us/sql/connect/php/download-drivers-php-sql-server
2. Copie os arquivos `.dll` para a pasta de extensões do PHP (ex: `C:\php\ext\`)
3. Adicione no `php.ini`:
   ```ini
   extension=php_pdo_sqlsrv_83_ts.dll
   extension=php_sqlsrv_83_ts.dll
   ```
4. Reinicie o servidor web

## 📦 Instalação

### Passo 1: Clonar/Copiar arquivos

Coloque a pasta `php` no diretório do seu servidor web:
- Apache: `C:\xampp\htdocs\cehab\` ou `/var/www/html/cehab/`
- IIS: `C:\inetpub\wwwroot\cehab\`

### Passo 2: Configurar Banco de Dados

1. Abra o SQL Server Management Studio (SSMS)
2. Execute o script `database.sql`
3. Isso criará:
   - Banco de dados `CEHAB_Controle_Documentos`
   - Tabela `Pastas`
   - Stored Procedures
   - Triggers
   - Índices

### Passo 3: Configurar Conexão

Edite o arquivo `config/config.php`:

```php
// Configurações do SQL Server
define('DB_SERVER', 'localhost');  // ou IP do servidor (ex: 192.168.1.100)
define('DB_NAME', 'CEHAB_Controle_Documentos');
define('DB_USER', 'sa');  // seu usuário SQL Server
define('DB_PASS', 'SuaSenha123');  // sua senha
```

**Importante para SQL Server Express:**
```php
define('DB_SERVER', 'localhost\SQLEXPRESS');
```

### Passo 4: Configurar Servidor Web

#### Apache (.htaccess já configurado)

Certifique-se que `mod_rewrite` está habilitado:

```apache
# No httpd.conf ou apache2.conf
LoadModule rewrite_module modules/mod_rewrite.so

# Permitir .htaccess
<Directory "C:/xampp/htdocs">
    AllowOverride All
</Directory>
```

#### IIS

Crie um arquivo `web.config` na raiz do projeto:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="API" stopProcessing="true">
                    <match url="^api/pastas(.*)$" />
                    <action type="Rewrite" url="api/pastas.php{R:1}" />
                </rule>
                <rule name="Public" stopProcessing="true">
                    <match url="^(.*)$" />
                    <conditions>
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                        <add input="{REQUEST_URI}" pattern="^/public/" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="public/{R:1}" />
                </rule>
            </rules>
        </rewrite>
    </system.webServer>
</configuration>
```

### Passo 5: Testar Instalação

1. Acesse: `http://localhost/cehab/public/`
2. Ou configure um VirtualHost:

**Apache (httpd-vhosts.conf):**
```apache
<VirtualHost *:80>
    ServerName cehab.local
    DocumentRoot "C:/xampp/htdocs/cehab/php"
    <Directory "C:/xampp/htdocs/cehab/php">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Adicione no arquivo hosts (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1   cehab.local
```

Acesse: `http://cehab.local`

## 🎯 Uso do Sistema

### 1. Registrar Saída de Pasta

1. Clique em "Registrar Saída"
2. Preencha:
   - Número da pasta (ex: P-2024-001)
   - Descrição
   - Tipo de documento
   - Quantidade de documentos
   - Responsável pela saída
   - Observações (opcional)
3. Clique em "Registrar Saída"

**Status**: ENVIADO

### 2. Registrar Recebimento

1. Na lista, clique em "Ver Detalhes"
2. Clique em "Registrar Recebimento"
3. Informe o responsável pelo recebimento na NovaGM
4. Confirme

**Status**: RECEBIDO

### 3. Registrar Retorno

1. Na página de detalhes
2. Clique em "Registrar Retorno"
3. Informe o responsável e observações
4. Confirme

**Status**: RETORNADO

## 📡 API REST

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pastas` | Listar todas as pastas |
| GET | `/api/pastas/{id}` | Buscar pasta específica |
| POST | `/api/pastas` | Registrar saída de pasta |
| PATCH | `/api/pastas/{id}/recebimento` | Registrar recebimento |
| PATCH | `/api/pastas/{id}/retorno` | Registrar retorno |
| DELETE | `/api/pastas/{id}` | Deletar pasta |

### Exemplos de Requisições

**Listar Pastas:**
```http
GET /api/pastas
```

**Registrar Saída:**
```http
POST /api/pastas
Content-Type: application/json

{
  "numero": "P-2024-001",
  "descricao": "Contratos de locação",
  "tipoDocumento": "Contrato",
  "quantidadeDocumentos": 50,
  "responsavelSaida": "João Silva",
  "observacoes": "Documentos urgentes"
}
```

**Registrar Recebimento:**
```http
PATCH /api/pastas/1/recebimento
Content-Type: application/json

{
  "responsavelRecebimento": "Maria Santos"
}
```

**Registrar Retorno:**
```http
PATCH /api/pastas/1/retorno
Content-Type: application/json

{
  "responsavelRetorno": "João Silva",
  "observacoesRetorno": "Documentos digitalizados com sucesso"
}
```

## 🗄️ Banco de Dados

### Tabela Pastas

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT IDENTITY | Chave primária |
| numero | NVARCHAR(50) | Número único da pasta |
| descricao | NVARCHAR(500) | Descrição da pasta |
| tipoDocumento | NVARCHAR(100) | Tipo do documento |
| quantidadeDocumentos | INT | Quantidade de documentos |
| observacoes | NVARCHAR(MAX) | Observações gerais |
| dataSaida | DATETIME2 | Data/hora de saída |
| responsavelSaida | NVARCHAR(200) | Responsável pela saída |
| dataRecebimento | DATETIME2 | Data/hora de recebimento |
| responsavelRecebimento | NVARCHAR(200) | Responsável pelo recebimento |
| dataRetorno | DATETIME2 | Data/hora de retorno |
| responsavelRetorno | NVARCHAR(200) | Responsável pelo retorno |
| observacoesRetorno | NVARCHAR(MAX) | Observações do retorno |
| status | NVARCHAR(20) | ENVIADO, RECEBIDO, RETORNADO |
| createdAt | DATETIME2 | Data de criação |
| updatedAt | DATETIME2 | Data de atualização |

### Stored Procedures

- `sp_ListarPastas` - Lista todas as pastas
- `sp_BuscarPasta` - Busca por ID
- `sp_RegistrarSaida` - Registra nova saída
- `sp_RegistrarRecebimento` - Registra recebimento
- `sp_RegistrarRetorno` - Registra retorno
- `sp_DeletarPasta` - Deleta pasta

## 🔧 Troubleshooting

### Erro: "Could not find driver"

**Solução**: Instale o driver SQL Server para PHP (pdo_sqlsrv)

### Erro: "Login failed for user"

**Solução**: Verifique usuário/senha no `config/config.php`

### Erro: 404 na API

**Solução**:
1. Verifique se mod_rewrite está ativo (Apache)
2. Verifique se URL Rewrite está instalado (IIS)
3. Teste acessar diretamente: `/api/pastas.php`

### Erro: CORS

**Solução**: Já está configurado no `config.php`. Se persistir, adicione no Apache:

```apache
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS"
```

### SQL Server não conecta

**Soluções**:
1. Verifique se SQL Server está rodando
2. Verifique se TCP/IP está habilitado (SQL Server Configuration Manager)
3. Para SQL Server Express use: `localhost\SQLEXPRESS`
4. Verifique firewall (porta 1433)

## 📊 Performance

O sistema usa:
- **Stored Procedures** para melhor performance
- **Índices** em campos mais consultados
- **Triggers** para auditoria automática
- **PDO Prepared Statements** para segurança

## 🔒 Segurança

- PDO com prepared statements (proteção contra SQL Injection)
- Validação de dados no backend
- CORS configurado
- Conexão via PDO com error handling

## 📝 Licença

MIT

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique a seção Troubleshooting
2. Consulte os logs do PHP (`php_error.log`)
3. Consulte os logs do SQL Server

---

**Desenvolvido para CEHAB-RJ**
Controle de Documentos - Sistema de Gestão de Pastas
