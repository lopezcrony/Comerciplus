const informeService = require('../services/dashboard.service');

const getDailyReport = async (req, res) => {
  try {
    const image = await informeService.generateDailyReport();
    res.set('Content-Type', 'image/png');
    res.send(image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al generar el informe diario');
  }
};

module.exports = {
    getDailyReport    
};