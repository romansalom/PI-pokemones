const axios = require('axios');
const express = require('express');
const URL ='https://pokeapi.co/api/v2/pokemon'
const {Pokemon , Type } = require("../db");
const { UUID } = require('sequelize');


const getAllPokemons = async (req, res) => {
  try {
    const response = await axios(`${URL}?limit=50`);
    const allPokemons = response.data;

    const pokemonPromises = allPokemons.results.map(async (pokemon) => {
      const response = await axios(`${URL}/${pokemon.name}`);
      const poke = response.data;

      const attack = poke.stats.find((obj) => obj.stat.name === 'attack');
      const defense = poke.stats.find((obj) => obj.stat.name === 'defense');
      const hp = poke.stats.find((obj) => obj.stat.name === 'hp');

      // Get types for the Pokémon
      const types = [];
      for (const typeData of poke.types) {
        const typeResponse = await axios.get(typeData.type.url);
        const typeName = typeResponse.data.names.find((type) => type.language.name === 'en').name;

        // Buscar o crear el tipo en la base de datos
        const [typeInstance, created] = await Type.findOrCreate({
          where: { name: typeName },
          defaults: { name: typeName },
        });

        types.push({
          id: typeInstance.id,
          name: typeName,
        });
      }

      // Crear el nuevo Pokémon en la tabla de Pokemons si no existe
      const [newPokemon, isNewPokemon] = await Pokemon.findOrCreate({
        where: { name: poke.name },
        defaults: {
          name: poke.name,
          image: poke.sprites.front_default,
          health: hp.base_stat,
          attack: attack.base_stat,
          defense: defense.base_stat,
        },
      });

      // Asociar los tipos al Pokémon
      const typesInstances = await Type.findAll({ where: { name: types.map(type => type.name) } });
      await newPokemon.setTypes(typesInstances);

      return {
        id: newPokemon.id,
        name: newPokemon.name,
        image: newPokemon.image,
        health: newPokemon.health,
        attack: newPokemon.attack,
        defense: newPokemon.defense,
        types: types, // Include types in the result
      };
    });

    const pokemons = await Promise.all(pokemonPromises);

    res.status(200).json(pokemons);
  } catch (error) {
    res.status(500).json({ message: "Hubo un error al obtener a los personajes", error: error.message });
  }
};


const getPokemonsById = async(req,res)=>
{
    const idPokemon = req.params.idPokemon;
    try {
        // Buscar el Pokémon en la base de datos
       
        if (!UUID(idPokemon)) {
            // Si encontramos el Pokémon en la base de datos, lo devolvemos
            const pokemonTypes = await dbPokemon.getTypes();

            const dbPokemon = await Pokemon.findOne({ where: { id: idPokemon } });

            res.status(200).json(dbPokemon);
        } else {
            // Si no encontramos el Pokémon en la base de datos, buscamos en la PokeAPI
            const pokeApiResponse = await axios.get(`${URL}/${idPokemon}`);
            const poke = pokeApiResponse.data;
            const typeResponse = await axios.get(poke.types[0].type.url);
      const spanisTypeName = typeResponse.data.names.find((types) => types.language.name === 'es').name;

            const attack = poke.stats.find(obj => obj.stat.name === 'attack');
            const defense = poke.stats.find(obj => obj.stat.name === 'defense');
            const hp = poke.stats.find(obj => obj.stat.name === 'hp');

            const newPokemon = await Pokemon.create({
                name: poke.name,
                image: poke.sprites.front_default,
                health: hp.base_stat,
                attack: attack.base_stat,
                defense: defense.base_stat,
                types: spanisTypeName
            });

            res.status(200).json(newPokemon);
        }
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al obtener al Pokémon", error: error.message });
    }
}



const getPokemonsByName = async(req,res)=>{ 
    const name = req.query.name;

  // Convertir el nombre a minúsculas para comparación insensible a mayúsculas
  const lowercaseName = name.toLowerCase();

  try {
    // Buscar el pokémon en la API
    const apiPokemon = await Pokemon.search(lowercaseName);

    // Buscar el pokémon en la base de datos
    const dbPokemon = await Pokemon.findAll({
      where: {
        name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), lowercaseName)
      }
    });

    // Combinar los resultados
    const pokemons = apiPokemon.concat(dbPokemon);

    // Filtrar los resultados que no existen
    const existingIds = new Set();
    const uniquePokemons = pokemons.filter((pokemon) => {
      if (!existingIds.has(pokemon.id)) {
        existingIds.add(pokemon.id);
        return true;
      }
      return false;
    });

    // Si no hay resultados, mostrar un mensaje de error
    if (uniquePokemons.length === 0) {
      res.status(404).send("No se encontró ningún pokémon con ese nombre.");
    } else {
      res.status(200).json(uniquePokemons);
    }
  } catch (error) {
    // Manejar el error
    res.status(500).send("Error al buscar el pokémon: " + error.message);
  }
}


 // Asegúrate de importar tus modelos correctamente

 const createPokemon = async (req, res) => {
  try {
    const { name, image, health, attack, defense, typeIds } = req.body;

    // Crear el nuevo Pokémon en la tabla de Pokemons
    const newPokemon = await Pokemon.create({
      name: name,
      image: image,
      health: health,
      attack: attack,
      defense: defense,
      types: ''
    });

    // Asociar los tipos al Pokémon
    if (Array.isArray(typeIds)) {
      const types = await Type.findAll({ where: { id: typeIds } });
      await newPokemon.setTypes(types);
    }

    res.status(201).json({ message: 'Pokémon creado exitosamente', pokemon: newPokemon });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el Pokémon', error: error.message });
  }
};

 

module.exports = {
    getAllPokemons,
    getPokemonsById,
    getPokemonsByName,
    createPokemon
}