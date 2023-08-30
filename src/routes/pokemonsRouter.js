const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {getAllPokemons,getPokemonsById} = require('../handlers/pokemonsHandlers.js')

const pokemonRouter = Router();


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

pokemonRouter.get("/", getAllPokemons);
pokemonRouter.get("/:idPokemon", getPokemonsById);


module.exports = pokemonRouter;