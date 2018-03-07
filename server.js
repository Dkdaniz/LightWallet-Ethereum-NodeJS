
'use strict';

const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./utils/routes'); 


class Server{

    constructor(){
        this.port =  process.env.PORT || 1337;
        this.host = `http://localhost`;
        
        this.app = express();
        this.http = http.Server(this.app);
    }

    appConfig(){        
        this.app.use(bodyParser.json({limit: '20mb'}));
        this.app.use(cors());
    }

    /* Including app Routes starts*/
    includeRoutes(){
        new routes(this.app).routesConfig();
    }
    /* Including app Routes ends*/  

    appExecute(){
        this.appConfig();
        this.includeRoutes();

        this.http.listen(this.port, this.port, () => {
            console.log(`Listening on 1337`);
        });

    }

}

const app = new Server();
app.appExecute();
