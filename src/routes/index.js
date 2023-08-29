const { Router } = require('express');
const pokemonRouter =  require('./pokemonsRouter')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons',pokemonRouter);


module.exports = router;
