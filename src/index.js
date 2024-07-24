const express = require('express');
const cors = require('cors');

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
    };

    routers(){
        this.app.use('/proveedores', require('./routers/providers.routers'));
        this.app.use('/clientes', require('./routers/clients.routers'));
        this.app.use('/ventas', require('./routers/sales.routers'));
        this.app.use('/devolucionVentas', require('./routers/returnSales.router'));
        this.app.use('/perdida', require('./routers/returnLoss.router'))
        this.app.use('/productos', require('./routers/products.routers'));
        this.app.use('/perdida', require('./routers/returnLoss.router'));
        this.app.use('/categorias', require('./routers/categories.routers'));
    };

    listen(){
        this.app.listen(this.port, () => {
            console.log(`http://localhost:${this.port}`);
        });
    };

}

module.exports = Server;