const axios = require('axios');
const express = require('express');
const URL ='https://pokeapi.co/api/v2/pokemon'
const {Pokemon} = require("../db")



const getAllPokemons = async(req,res)=>{
    try {
        const response = await axios(`${URL}?limit=50`);
        const allPokemons = response.data;

        const pokemonPromises = allPokemons.results.map(async (pokemon) =>{
            const response = await axios(`${URL}/${pokemon.name}`);
            const poke = response.data

            const attack = poke.stats.find((obj)=> obj.stat.name ==='attack');
            const defense = poke.stats.find((obj)=> obj.stat.name ==='defense');
            const hp = poke.stats.find((obj)=> obj.stat.name ==='hp');
            return{
                id : poke.id,
                name : poke.name,
                image : poke.sprites.front_default,
                health: hp.base_stat,
                attack : attack.base_stat,
                defense : defense.base_stat,
            };
        });
        const pokemons = await Promise.all(pokemonPromises);

        res.status(200).json(pokemons)

    } catch (error) {
        res.status(500).json({message : "Hubo un error al obtener al personajel" , error: error.message});
    }
}

module.exports = {
    getAllPokemons
}

