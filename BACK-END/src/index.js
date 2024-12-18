const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { createServer } = require('http');
const { Server: SocketServer } = require('socket.io');

const dotenv = require('dotenv');
dotenv.config();

class Server {

    constructor() {
        this.app = express();
        this.host = process.env.DB_HOST || 'localhost';
        this.port = process.env.PORT;
        // Crear servidor HTTP
        this.httpServer = createServer(this.app);
        // Configurar Socket.IO
        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: "*",  // O especifícalo con la URL del frontend si es localhost
                methods: ["GET", "POST"],
                allowedHeaders: ["Content-Type"],
                credentials: true
            }
        });
        // Inicializar websockets
        this.initializeWebSockets();

        //Middlewares
        this.middlewares();
        //Rutas
        this.routers();
    };

    initializeWebSockets() {
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado', socket.id);

            socket.on('disconnect', () => {
                console.log('Cliente desconectado', socket.id);
            });
        });
    };

    middlewares() {
        //CORS
        this.app.use(cors({ origin: '*' }));
        //Parseo a json
        this.app.use(express.json());
        //file uploads-carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
        // Middleware para hacer disponible io en los requests
        this.app.use((req, res, next) => {
            req.io = this.io;
            next();
        });
    };

    routers() {

        this.app.use('/roles', require('./routers/roles.routes.js'));
        this.app.use('/permisos', require('./routers/permissions.routes.js'));
        this.app.use('/usuarios', require('./routers/users.routes.js'));

        this.app.use('/compras', require('./routers/shopping.routes.js'));
        this.app.use('/detallecompras', require('./routers/shoppingdetails.routes.js'));
        this.app.use('/proveedores', require('./routers/providers.routes.js'));
        this.app.use('/categorias', require('./routers/categories.routes.js'));
        this.app.use('/productos', require('./routers/products.routes.js'));
        this.app.use('/codigo_barra', require('./routers/barcodes.routes.js'));

        this.app.use('/ventas', require('./routers/sales.routes.js'));
        this.app.use('/detalleVenta', require('./routers/detailSales.routes.js'));
        this.app.use('/devolucionLocal', require('./routers/returnProvider.routes.js'));
        this.app.use('/devolucionVentas', require('./routers/returnSales.routes.js'));
        this.app.use('/perdida', require('./routers/returnLoss.routes.js'));

        this.app.use('/clientes', require('./routers/clients.routes.js'));
        this.app.use('/creditos', require('./routers/credits.routes.js'));
        this.app.use('/detallecredito', require('./routers/detailCredit.routes.js'));
        this.app.use('/abonos', require('./routers/installments.routes.js'));

        this.app.use('/login', require('./routers/auth.routes.js'));
        this.app.use('/recover', require('./routers/recover.routes.js'));
        this.app.use('/restore', require('./routers/restore.routes.js'));

        this.app.use('/uploads', require('./routers/uploads.js'));
        this.app.use('/escaner', require('./routers/scanner.routes.js'));
    };

    start() {
        return new Promise((resolve, reject) => {
            try {
                this.httpServer.listen(this.port, () => {
                    console.log(`\nhttp://${this.host}:${this.port}`);
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    };

}

module.exports = Server;