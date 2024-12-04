const scannerController = async (req, res) => {
    try {
        const { barcode, timestamp, idUsuario } = req.body;

        console.log(`Datos recibidos: barcode=${barcode}, timestamp=${timestamp}, idUsuario=${idUsuario}`); // Log para verificar datos

        // Emitir el código de barras solo al cliente específico
        req.io.emit('newBarcode', { barcode, timestamp, scanTime: new Date().toISOString(), idUsuario });

        // Configurar un temporizador para borrar el código de barras después de 3-4 segundos
        setTimeout(() => {
            req.io.emit('clearBarcode', { message: 'Código de barras borrado automáticamente' });
            console.log('Código de barras borrado automáticamente después de 3-4 segundos');
        }, 3000); // Cambia el valor (4000ms = 4 segundos) según tus necesidades

        res.json({ ok: true, message: 'Código de barras procesado correctamente' });

    } catch (error) {
        console.error('Error en el controlador de escáner:', error); // Log de error
        res.status(500).json({ ok: false, message: 'Error al procesar el código de barras' });
    }
};

module.exports = {
    scannerController
};
