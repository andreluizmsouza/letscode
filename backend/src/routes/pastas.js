const express = require('express');
const router = express.Router();
const pastasController = require('../controllers/pastasController');

// Listar todas as pastas
router.get('/', pastasController.listarPastas);

// Buscar pasta específica
router.get('/:id', pastasController.buscarPasta);

// Registrar saída de pasta
router.post('/', pastasController.registrarSaida);

// Registrar recebimento
router.patch('/:id/recebimento', pastasController.registrarRecebimento);

// Registrar retorno
router.patch('/:id/retorno', pastasController.registrarRetorno);

// Deletar pasta
router.delete('/:id', pastasController.deletarPasta);

module.exports = router;
