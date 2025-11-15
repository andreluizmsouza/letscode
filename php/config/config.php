<?php
/**
 * Configuração do Banco de Dados SQL Server
 * Ajuste as configurações de acordo com seu ambiente
 */

// Configurações do SQL Server
define('DB_SERVER', 'localhost');  // ou IP do servidor
define('DB_NAME', 'CEHAB_Controle_Documentos');
define('DB_USER', 'sa');  // seu usuário SQL Server
define('DB_PASS', 'SuaSenha123');  // sua senha

// Configurações da aplicação
define('TIMEZONE', 'America/Sao_Paulo');
date_default_timezone_set(TIMEZONE);

// Configurações de CORS (permitir requisições do frontend)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Se for requisição OPTIONS (preflight), retornar 200 OK
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
