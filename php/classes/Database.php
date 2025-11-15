<?php
/**
 * Classe para conexão com SQL Server
 * Usando PDO com driver sqlsrv
 */

class Database {
    private $conn = null;

    public function getConnection() {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            // String de conexão para SQL Server
            $dsn = "sqlsrv:Server=" . DB_SERVER . ";Database=" . DB_NAME;

            $this->conn = new PDO(
                $dsn,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );

            return $this->conn;

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Erro de conexão com banco de dados',
                'message' => $e->getMessage()
            ]);
            exit;
        }
    }

    public function close() {
        $this->conn = null;
    }
}
