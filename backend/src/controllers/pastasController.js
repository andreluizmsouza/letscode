const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todas as pastas
exports.listarPastas = async (req, res) => {
  try {
    const pastas = await prisma.pasta.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(pastas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pastas', details: error.message });
  }
};

// Buscar pasta específica
exports.buscarPasta = async (req, res) => {
  try {
    const { id } = req.params;
    const pasta = await prisma.pasta.findUnique({
      where: { id }
    });

    if (!pasta) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    res.json(pasta);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pasta', details: error.message });
  }
};

// Registrar saída de pasta
exports.registrarSaida = async (req, res) => {
  try {
    const {
      numero,
      descricao,
      tipoDocumento,
      quantidadeDocumentos,
      observacoes,
      responsavelSaida
    } = req.body;

    // Validação
    if (!numero || !descricao || !tipoDocumento || !quantidadeDocumentos || !responsavelSaida) {
      return res.status(400).json({
        error: 'Campos obrigatórios: numero, descricao, tipoDocumento, quantidadeDocumentos, responsavelSaida'
      });
    }

    const pasta = await prisma.pasta.create({
      data: {
        numero,
        descricao,
        tipoDocumento,
        quantidadeDocumentos: parseInt(quantidadeDocumentos),
        observacoes,
        responsavelSaida,
        dataSaida: new Date(),
        status: 'ENVIADO'
      }
    });

    res.status(201).json(pasta);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Número da pasta já existe' });
    }
    res.status(500).json({ error: 'Erro ao registrar saída', details: error.message });
  }
};

// Registrar recebimento
exports.registrarRecebimento = async (req, res) => {
  try {
    const { id } = req.params;
    const { responsavelRecebimento } = req.body;

    if (!responsavelRecebimento) {
      return res.status(400).json({ error: 'responsavelRecebimento é obrigatório' });
    }

    const pasta = await prisma.pasta.findUnique({ where: { id } });

    if (!pasta) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    if (pasta.status !== 'ENVIADO') {
      return res.status(400).json({ error: 'Pasta já foi recebida' });
    }

    const pastaAtualizada = await prisma.pasta.update({
      where: { id },
      data: {
        responsavelRecebimento,
        dataRecebimento: new Date(),
        status: 'RECEBIDO'
      }
    });

    res.json(pastaAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar recebimento', details: error.message });
  }
};

// Registrar retorno
exports.registrarRetorno = async (req, res) => {
  try {
    const { id } = req.params;
    const { responsavelRetorno, observacoesRetorno } = req.body;

    if (!responsavelRetorno) {
      return res.status(400).json({ error: 'responsavelRetorno é obrigatório' });
    }

    const pasta = await prisma.pasta.findUnique({ where: { id } });

    if (!pasta) {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }

    if (pasta.status === 'RETORNADO') {
      return res.status(400).json({ error: 'Pasta já foi retornada' });
    }

    const pastaAtualizada = await prisma.pasta.update({
      where: { id },
      data: {
        responsavelRetorno,
        dataRetorno: new Date(),
        observacoesRetorno,
        status: 'RETORNADO'
      }
    });

    res.json(pastaAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar retorno', details: error.message });
  }
};

// Deletar pasta
exports.deletarPasta = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.pasta.delete({
      where: { id }
    });

    res.json({ message: 'Pasta deletada com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pasta não encontrada' });
    }
    res.status(500).json({ error: 'Erro ao deletar pasta', details: error.message });
  }
};
