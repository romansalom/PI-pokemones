const axios = require('axios');
const express = require('express');
const {Type} = require("../db");
const getTypes = async (req, res) => {
    try {
      // Obtener los tipos de la API
      const apiResponse = await axios.get('https://pokeapi.co/api/v2/type');
      const apiTypes = apiResponse.data.results;
  
      // Procesar y almacenar los tipos en la base de datos
      const dbTypes = [];
      for (const apiType of apiTypes) {
        const [dbType, created] = await Type.findOrCreate({
          where: { name: apiType.name },
          defaults: { name: apiType.name }
        });
        dbTypes.push(dbType);
      }
  
      res.status(200).json(dbTypes);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los tipos de Pokémon", error: error.message });
    }
  }



module.exports = {
    getTypes
}