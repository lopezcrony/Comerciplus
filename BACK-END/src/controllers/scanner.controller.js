const tempBarcodes = new Map(); // Almacenar códigos temporalmente: { idUsuario: { barcode, timestamp } }

const scannerController = async (req, res) => {
    try {
        const { barcode, timestamp, idUsuario } = req.body;

        console.log(`Datos recibidos: barcode=${barcode}, timestamp=${timestamp}, idUsuario=${idUsuario}`);

        // Guardar el código temporalmente
        tempBarcodes.set(idUsuario, { barcode, timestamp });

        // Emitir el código de barras al cliente específico
        req.io.emit('newBarcode', { barcode, timestamp, scanTime: new Date().toISOString(), idUsuario });

        // Programar la eliminación del código después de 3 segundos
        setTimeout(() => {
            tempBarcodes.delete(idUsuario);
            req.io.emit('clearBarcode', { idUsuario }); // Notificar al cliente que se eliminó el código
            console.log(`Código de barras eliminado para idUsuario=${idUsuario}`);
        }, 3000); // 3000 milisegundos = 3 segundos

        res.json({ ok: true, message: 'Código de barras procesado correctamente' });
    } catch (error) {
        console.error('Error en el controlador de escáner:', error);
        res.status(500).json({ ok: false, message: 'Error al procesar el código de barras' });
    }
};

module.exports = {
    scannerController,
};
