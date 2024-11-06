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
        this.app.use('/dashboard', require('./routers/dashboard.routes.js'));

        this.app.use('/roles', require('./routers/roles.routes.js'));
        this.app.use('/permisos', require('./routers/permissions.routes.js'));
        this.app.use('/usuarios', require('./routers/users.routes.js'));

        this.app.use('/compras', require('./routers/shopping.routes.js'));
        this.app.use('/detallecompras', require('./routers/shoppingdetails.routes.js'));
        this.app.use('/proveedores', require('./routers/providers.routes.js'));
        this.app.use('/categorias', require('./routers/categories.routes.js'));
        this.app.use('/productos', require('./routers/products.routes.js'));
        this.app.use('/codigo_barra', require('./routers/Barcode.routes.js')); 

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
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`\nhttp://localhost:${this.port}`);
        });
    };

}

module.exports = Server;