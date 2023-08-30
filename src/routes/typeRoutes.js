const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getAllTypes} = require('../handlers/Typeshandler')

const typeRouter = Router();


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

typeRouter.get("/", getAllTypes);

module.exports = typeRouter;