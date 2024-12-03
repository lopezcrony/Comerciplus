
const scannerController = async (req, res) => {
    try {
        const { barcode, timestamp, userId } = req.body; // Añadimos userId

        // Emitir el código de barras solo al cliente específico
        req.io.to(userId).emit('newBarcode', { barcode, timestamp, scanTime: new Date().toISOString() });

        res.json({ ok: true, message: 'Código de barras procesado correctamente' });

    } catch (error) {
        res.status(500).json({ ok: false, message: 'Error al procesar el código de barras' });
    }
}

module.exports = {
    scannerController
};
