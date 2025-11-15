-- =============================================
-- Sistema de Controle de Documentos CEHAB-RJ
-- SQL Server 2022
-- =============================================

-- Criar banco de dados
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CEHAB_Controle_Documentos')
BEGIN
    CREATE DATABASE CEHAB_Controle_Documentos;
END
GO

USE CEHAB_Controle_Documentos;
GO

-- Tabela de Pastas
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Pastas')
BEGIN
    CREATE TABLE Pastas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numero NVARCHAR(50) NOT NULL UNIQUE,
        descricao NVARCHAR(500) NOT NULL,
        tipoDocumento NVARCHAR(100) NOT NULL,
        quantidadeDocumentos INT NOT NULL,
        observacoes NVARCHAR(MAX) NULL,

        -- Controle de saída
        dataSaida DATETIME2 NOT NULL DEFAULT GETDATE(),
        responsavelSaida NVARCHAR(200) NOT NULL,

        -- Controle de recebimento
        dataRecebimento DATETIME2 NULL,
        responsavelRecebimento NVARCHAR(200) NULL,

        -- Controle de retorno
        dataRetorno DATETIME2 NULL,
        responsavelRetorno NVARCHAR(200) NULL,
        observacoesRetorno NVARCHAR(MAX) NULL,

        -- Status: ENVIADO, RECEBIDO, RETORNADO
        status NVARCHAR(20) NOT NULL DEFAULT 'ENVIADO',

        -- Auditoria
        createdAt DATETIME2 NOT NULL DEFAULT GETDATE(),
        updatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

-- Índices para performance
CREATE NONCLUSTERED INDEX IX_Pastas_Status ON Pastas(status);
CREATE NONCLUSTERED INDEX IX_Pastas_DataSaida ON Pastas(dataSaida DESC);
GO

-- Trigger para atualizar updatedAt automaticamente
CREATE OR ALTER TRIGGER TR_Pastas_UpdateTimestamp
ON Pastas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Pastas
    SET updatedAt = GETDATE()
    FROM Pastas p
    INNER JOIN inserted i ON p.id = i.id;
END
GO

-- Procedure para listar pastas
CREATE OR ALTER PROCEDURE sp_ListarPastas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        id,
        numero,
        descricao,
        tipoDocumento,
        quantidadeDocumentos,
        observacoes,
        dataSaida,
        responsavelSaida,
        dataRecebimento,
        responsavelRecebimento,
        dataRetorno,
        responsavelRetorno,
        observacoesRetorno,
        status,
        createdAt,
        updatedAt
    FROM Pastas
    ORDER BY createdAt DESC;
END
GO

-- Procedure para buscar pasta por ID
CREATE OR ALTER PROCEDURE sp_BuscarPasta
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        id,
        numero,
        descricao,
        tipoDocumento,
        quantidadeDocumentos,
        observacoes,
        dataSaida,
        responsavelSaida,
        dataRecebimento,
        responsavelRecebimento,
        dataRetorno,
        responsavelRetorno,
        observacoesRetorno,
        status,
        createdAt,
        updatedAt
    FROM Pastas
    WHERE id = @id;
END
GO

-- Procedure para registrar saída
CREATE OR ALTER PROCEDURE sp_RegistrarSaida
    @numero NVARCHAR(50),
    @descricao NVARCHAR(500),
    @tipoDocumento NVARCHAR(100),
    @quantidadeDocumentos INT,
    @responsavelSaida NVARCHAR(200),
    @observacoes NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar se número já existe
    IF EXISTS (SELECT 1 FROM Pastas WHERE numero = @numero)
    BEGIN
        RAISERROR('Número da pasta já existe', 16, 1);
        RETURN;
    END

    INSERT INTO Pastas (
        numero,
        descricao,
        tipoDocumento,
        quantidadeDocumentos,
        responsavelSaida,
        observacoes,
        status
    )
    VALUES (
        @numero,
        @descricao,
        @tipoDocumento,
        @quantidadeDocumentos,
        @responsavelSaida,
        @observacoes,
        'ENVIADO'
    );

    -- Retornar registro inserido
    SELECT * FROM Pastas WHERE id = SCOPE_IDENTITY();
END
GO

-- Procedure para registrar recebimento
CREATE OR ALTER PROCEDURE sp_RegistrarRecebimento
    @id INT,
    @responsavelRecebimento NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar se existe e se está no status correto
    IF NOT EXISTS (SELECT 1 FROM Pastas WHERE id = @id)
    BEGIN
        RAISERROR('Pasta não encontrada', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Pastas WHERE id = @id AND status != 'ENVIADO')
    BEGIN
        RAISERROR('Pasta já foi recebida', 16, 1);
        RETURN;
    END

    UPDATE Pastas
    SET
        responsavelRecebimento = @responsavelRecebimento,
        dataRecebimento = GETDATE(),
        status = 'RECEBIDO'
    WHERE id = @id;

    SELECT * FROM Pastas WHERE id = @id;
END
GO

-- Procedure para registrar retorno
CREATE OR ALTER PROCEDURE sp_RegistrarRetorno
    @id INT,
    @responsavelRetorno NVARCHAR(200),
    @observacoesRetorno NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar se existe
    IF NOT EXISTS (SELECT 1 FROM Pastas WHERE id = @id)
    BEGIN
        RAISERROR('Pasta não encontrada', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM Pastas WHERE id = @id AND status = 'RETORNADO')
    BEGIN
        RAISERROR('Pasta já foi retornada', 16, 1);
        RETURN;
    END

    UPDATE Pastas
    SET
        responsavelRetorno = @responsavelRetorno,
        dataRetorno = GETDATE(),
        observacoesRetorno = @observacoesRetorno,
        status = 'RETORNADO'
    WHERE id = @id;

    SELECT * FROM Pastas WHERE id = @id;
END
GO

-- Procedure para deletar pasta
CREATE OR ALTER PROCEDURE sp_DeletarPasta
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Pastas WHERE id = @id)
    BEGIN
        RAISERROR('Pasta não encontrada', 16, 1);
        RETURN;
    END

    DELETE FROM Pastas WHERE id = @id;
END
GO

-- Dados de exemplo (opcional - comentar se não quiser)
/*
EXEC sp_RegistrarSaida
    @numero = 'P-2024-001',
    @descricao = 'Contratos de locação janeiro 2024',
    @tipoDocumento = 'Contrato',
    @quantidadeDocumentos = 50,
    @responsavelSaida = 'João Silva',
    @observacoes = 'Documentos urgentes';
*/

PRINT 'Banco de dados criado com sucesso!';
GO
