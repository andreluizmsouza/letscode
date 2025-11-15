<?php
/**
 * API REST - Controle de Documentos CEHAB-RJ
 * Endpoint principal
 */

require_once '../config/config.php';
require_once '../classes/Database.php';
require_once '../classes/Pasta.php';

// Instanciar conexão
$database = new Database();
$db = $database->getConnection();
$pasta = new Pasta($db);

// Obter método HTTP e parâmetros
$method = $_SERVER['REQUEST_METHOD'];
$request_uri = $_SERVER['REQUEST_URI'];

// Extrair o path da API
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api/pastas', '', $path);
$segments = array_filter(explode('/', $path));

try {
    switch ($method) {
        case 'GET':
            if (empty($segments)) {
                // Listar todas as pastas
                $pastas = $pasta->listar();
                echo json_encode($pastas);
            } else {
                // Buscar pasta específica
                $id = (int)$segments[0];
                $resultado = $pasta->buscarPorId($id);

                if (!$resultado) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Pasta não encontrada']);
                } else {
                    echo json_encode($resultado);
                }
            }
            break;

        case 'POST':
            // Registrar saída de pasta
            $dados = json_decode(file_get_contents('php://input'), true);

            // Validação
            $camposObrigatorios = ['numero', 'descricao', 'tipoDocumento', 'quantidadeDocumentos', 'responsavelSaida'];
            foreach ($camposObrigatorios as $campo) {
                if (empty($dados[$campo])) {
                    http_response_code(400);
                    echo json_encode(['error' => "Campo obrigatório: $campo"]);
                    exit;
                }
            }

            $resultado = $pasta->registrarSaida($dados);
            http_response_code(201);
            echo json_encode($resultado);
            break;

        case 'PATCH':
            if (empty($segments)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID da pasta não fornecido']);
                exit;
            }

            $id = (int)$segments[0];
            $action = $segments[1] ?? '';
            $dados = json_decode(file_get_contents('php://input'), true);

            if ($action === 'recebimento') {
                // Registrar recebimento
                if (empty($dados['responsavelRecebimento'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'responsavelRecebimento é obrigatório']);
                    exit;
                }

                $resultado = $pasta->registrarRecebimento($id, $dados['responsavelRecebimento']);
                echo json_encode($resultado);

            } elseif ($action === 'retorno') {
                // Registrar retorno
                if (empty($dados['responsavelRetorno'])) {
                    http_response_code(400);
                    echo json_encode(['error' => 'responsavelRetorno é obrigatório']);
                    exit;
                }

                $resultado = $pasta->registrarRetorno(
                    $id,
                    $dados['responsavelRetorno'],
                    $dados['observacoesRetorno'] ?? null
                );
                echo json_encode($resultado);

            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Ação inválida']);
            }
            break;

        case 'DELETE':
            if (empty($segments)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID da pasta não fornecido']);
                exit;
            }

            $id = (int)$segments[0];
            $pasta->deletar($id);
            echo json_encode(['message' => 'Pasta deletada com sucesso']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
            break;
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro no servidor',
        'message' => $e->getMessage()
    ]);
}
