const axios = require("axios");

class WeatherUtils {
  static async getPrevisaoTempo(cidade, dataAgendamento) {
    try {
      const API_KEY = process.env.OPENWEATHER_API_KEY;

      if (!API_KEY) {
        throw new Error("Chave da API OpenWeather não configurada");
      }

      // Busca coordenadas da cidade
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          cidade
        )},BR&limit=1&appid=${API_KEY}`
      );

      if (!geoResponse.data || geoResponse.data.length === 0) {
        throw new Error("Cidade não encontrada");
      }

      const { lat, lon } = geoResponse.data[0];

      // Busca previsão para os próximos dias
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      const dataTarget = new Date(dataAgendamento);
      const previsoes = response.data.list;

      const previsaoMaisProxima = previsoes.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.dt * 1000) - dataTarget);
        const currDiff = Math.abs(new Date(curr.dt * 1000) - dataTarget);
        return prevDiff < currDiff ? prev : curr;
      });

      const vaiChover = previsaoMaisProxima.weather.some(
        (cond) =>
          cond.main.toLowerCase().includes("rain") ||
          cond.main.toLowerCase().includes("drizzle")
      );

      return {
        descricao: previsaoMaisProxima.weather[0].description,
        temperatura: previsaoMaisProxima.main.temp,
        chuva: vaiChover,
        umidade: previsaoMaisProxima.main.humidity,
      };
    } catch (error) {
      console.error("Erro ao buscar previsão do tempo:", error.message);
      throw new Error("Não foi possível obter a previsão do tempo");
    }
  }
}

module.exports = WeatherUtils;
