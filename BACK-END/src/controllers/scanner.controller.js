const scannerController = async (req, res) => {
    try {
        const { barcode, timestamp, idUsuario } = req.body;

        console.log(`Datos recibidos: barcode=${barcode}, timestamp=${timestamp}, idUsuario=${idUsuario}`); // Log para verificar datos

        // Emitir el código de barras solo al cliente específico
        req.io.emit('newBarcode', { barcode, timestamp, scanTime: new Date().toISOString() });

        res.json({ ok: true, message: 'Código de barras procesado correctamente' });

    } catch (error) {
        console.error('Error en el controlador de escáner:', error); // Log de error
        res.status(500).json({ ok: false, message: 'Error al procesar el código de barras' });
    }
}

module.exports = {
    scannerController
};
