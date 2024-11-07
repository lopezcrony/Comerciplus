const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const dashboardRepository = require('../repositories/dashboard.repository');

const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

const generateDailyReport = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const salesToday = await dashboardRepository.getSalesOfTheDay(today);
  const purchasesToday = await dashboardRepository.getPurchasesOfTheDay(today);

  // Calculate total sales and purchases
  const totalSales = salesToday.reduce((acc, sale) => acc + sale.totalVenta, 0);
  const totalPurchases = purchasesToday.reduce((acc, purchase) => acc + purchase.valorCompra, 0);

  // Chart configuration
  const configuration = {
    type: 'bar',
    data: {
      labels: ['Sales', 'Purchases'],
      datasets: [
        {
          label: 'Daily Report',
          data: [totalSales, totalPurchases],
          backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  // Generate chart image as buffer
  return await chartJSNodeCanvas.renderToBuffer(configuration);
};

module.exports = {
    generateDailyReport,
    };
