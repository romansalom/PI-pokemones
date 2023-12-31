
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { getAllPokemons } = require('./src/handlers/pokemonsHandlers.js');
const {loadTypesFromAPI} = require('../api/src/handlers/Typeshandler.js')
const {getAllTypes} = require("./src/handlers/Typeshandler.js")



// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(3001, async () => {
    console.log('%s listening at 3001, estoy escuchando en el puerto 3001');

  });
});
