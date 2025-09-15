const axios = require('axios');

class CEPUtils {
  static async buscarPorCEP(cep) {
    try {
      // Remove caracteres não numéricos
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        throw new Error('CEP deve ter 8 dígitos');
      }

      // URL corretamente formatada - sem espaços antes de https
      const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
      
      const response = await axios.get(url);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        cep: response.data.cep,
        logradouro: response.data.logradouro || '',
        complemento: response.data.complemento || '',
        bairro: response.data.bairro || '',
        cidade: response.data.localidade || '',
        estado: response.data.uf || '',
        uf: response.data.uf || ''
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error.message);
      throw new Error(`Não foi possível buscar o CEP: ${error.message}`);
    }
  }

  static validarCEP(cep) {
    const cepLimpo = cep.replace(/\D/g, '');
    return /^[0-9]{8}$/.test(cepLimpo);
  }
}

module.exports = CEPUtils;