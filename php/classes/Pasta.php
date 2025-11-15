<?php
/**
 * Classe Pasta - Modelo de dados
 */

class Pasta {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Listar todas as pastas
     */
    public function listar() {
        $stmt = $this->conn->prepare("EXEC sp_ListarPastas");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Buscar pasta por ID
     */
    public function buscarPorId($id) {
        $stmt = $this->conn->prepare("EXEC sp_BuscarPasta @id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch();

        if (!$result) {
            return null;
        }

        return $result;
    }

    /**
     * Registrar saída de pasta
     */
    public function registrarSaida($dados) {
        try {
            $stmt = $this->conn->prepare("
                EXEC sp_RegistrarSaida
                    @numero = ?,
                    @descricao = ?,
                    @tipoDocumento = ?,
                    @quantidadeDocumentos = ?,
                    @responsavelSaida = ?,
                    @observacoes = ?
            ");

            $stmt->execute([
                $dados['numero'],
                $dados['descricao'],
                $dados['tipoDocumento'],
                $dados['quantidadeDocumentos'],
                $dados['responsavelSaida'],
                $dados['observacoes'] ?? null
            ]);

            return $stmt->fetch();

        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'já existe') !== false) {
                throw new Exception('Número da pasta já existe');
            }
            throw $e;
        }
    }

    /**
     * Registrar recebimento
     */
    public function registrarRecebimento($id, $responsavel) {
        try {
            $stmt = $this->conn->prepare("
                EXEC sp_RegistrarRecebimento
                    @id = ?,
                    @responsavelRecebimento = ?
            ");

            $stmt->execute([$id, $responsavel]);
            return $stmt->fetch();

        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'não encontrada') !== false) {
                throw new Exception('Pasta não encontrada');
            }
            if (strpos($e->getMessage(), 'já foi recebida') !== false) {
                throw new Exception('Pasta já foi recebida');
            }
            throw $e;
        }
    }

    /**
     * Registrar retorno
     */
    public function registrarRetorno($id, $responsavel, $observacoes = null) {
        try {
            $stmt = $this->conn->prepare("
                EXEC sp_RegistrarRetorno
                    @id = ?,
                    @responsavelRetorno = ?,
                    @observacoesRetorno = ?
            ");

            $stmt->execute([$id, $responsavel, $observacoes]);
            return $stmt->fetch();

        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'não encontrada') !== false) {
                throw new Exception('Pasta não encontrada');
            }
            if (strpos($e->getMessage(), 'já foi retornada') !== false) {
                throw new Exception('Pasta já foi retornada');
            }
            throw $e;
        }
    }

    /**
     * Deletar pasta
     */
    public function deletar($id) {
        try {
            $stmt = $this->conn->prepare("EXEC sp_DeletarPasta @id = ?");
            $stmt->execute([$id]);
            return true;

        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'não encontrada') !== false) {
                throw new Exception('Pasta não encontrada');
            }
            throw $e;
        }
    }
}
