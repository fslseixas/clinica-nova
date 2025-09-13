const express = require('express');
const router = express.Router();
const CEPUtils = require('../utils/cep');

// Rota para buscar endereço por CEP
router.get('/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    
    if (!CEPUtils.validarCEP(cep)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Formato de CEP inválido. Use 00000000 ou 00000-000' 
      });
    }

    const endereco = await CEPUtils.buscarPorCEP(cep);
    res.json({ 
      success: true, 
      data: endereco 
    });

  } catch (error) {
    console.error('Erro na rota de CEP:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;