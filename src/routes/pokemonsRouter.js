const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getAllPokemons} = require('../handlers/pokemonsHandlers.js')

const pokemonRouter = Router();


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

pokemonRouter.get("/", getAllPokemons);

module.exports = pokemonRouter;