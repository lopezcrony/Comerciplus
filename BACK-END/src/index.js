const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const dotenv = require('dotenv'); // Para cargar variables de entorno

// Cargar archivo .env
dotenv.config(); 

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;;
        //Middlewares
        this.middlewares();
        //Rutas
        this.routers();
    };

    middlewares(){
        //CORS
        this.app.use(cors());
        //Parseo a json
        this.app.use(express.json());
        //file uploads-carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    };

    routers(){
        this.app.use('/proveedores', require('./routers/providers.routers.js'));
        this.app.use('/clientes', require('./routers/clients.routers.js'));
        this.app.use('/detallecredito', require('./routers/detailCredit.routers.js'));
        this.app.use('/creditos', require('./routers/credits.routers.js'));
        this.app.use('/abonos', require('./routers/installments.routers.js'));
        this.app.use('/ventas', require('./routers/sales.routers.js'));
        this.app.use('/detalleVenta', require('./routers/detailSales.routers.js'));
        this.app.use('/devolucionLocal', require('./routers/returnProvider.router.js'));
        this.app.use('/devolucionVentas', require('./routers/returnSales.router.js'));
        this.app.use('/perdida', require('./routers/returnLoss.router.js'));
        this.app.use('/productos', require('./routers/products.routers.js'));
        this.app.use('/codigo_barra', require('./routers/Barcode.routers.js')); 
        this.app.use('/categorias', require('./routers/categories.routers.js'));
        this.app.use('/roles', require('./routers/roles.routers.js'));
        this.app.use('/permisos', require('./routers/permissions.routers.js'));
        this.app.use('/usuarios', require('./routers/users.routers.js'));
        this.app.use('/compras', require('./routers/shopping.routers.js'));
        this.app.use('/detallecompras', require('./routers/shoppingdetails.routers.js'));
        this.app.use('/uploads', require('./routers/uploads.js'));

        // Ruta para login (autenticación con JWT)
        this.app.use('/login', require('./routers/auth.routes.js'));
        this.app.use('/recover', require('./routers/recover.routers.js'));
        this.app.use('/restore', require('./routers/restore.routers.js'));
        
        
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`\nhttp://localhost:${this.port}`);
        });
    };

}

module.exports = Server;