const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

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
            tempFileDir : '/tmp/'
        }));
    };

    routers(){
        this.app.use('/proveedores', require('./routers/providers.routers'));
        this.app.use('/clientes', require('./routers/clients.routers'));
        this.app.use('/creditos', require('./routers/credits.routers'));
        this.app.use('/abonos', require('./routers/installments.routers'));
        this.app.use('/ventas', require('./routers/sales.routers'));
        this.app.use('/devolucionVentas', require('./routers/returnSales.router'));
        this.app.use('/perdida', require('./routers/returnLoss.router'));
        this.app.use('/productos', require('./routers/products.routers'));
        this.app.use('/Codigos_barra', require('./routers/Barcode.routers'));
        this.app.use('/categorias', require('./routers/categories.routers'));
        this.app.use('/roles', require('./routers/roles.routers'));
        this.app.use('/permissions', require('./routers/permissions.routers'));
        this.app.use('/users', require('./routers/users.routers'));
        this.app.use('/compras', require('./routers/shopping.routers'));
        this.app.use('/uploads', require('./routers/uploads.js'));
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`\nhttp://localhost:${this.port}`);
        });
    };

}

module.exports = Server;