
const scannerController = async (req, res) => {
    try {
        const { barcode, timestamp } = req.body;

        // Emitir el código de barras a todos los clientes conectados
        req.io.emit('newBarcode', { barcode, timestamp, scanTime: new Date().toISOString() });

        res.json({ ok: true, message: 'Código de barras procesado correctamente' });

    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al procesar el código de barras' });
    }
}

module.exports = {
    scannerController
};