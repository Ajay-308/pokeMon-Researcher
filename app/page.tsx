"use client";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// on front page i have to show
// name of the pokemon + image + type (fire, water, grass, electric, fly or rest)

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: {
    type: {
      name: string;
    };
  }[]; // we have lot of type so we make an array
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
    };
  };
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPokemon, setSearchPokemon] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
        if (!res.ok) {
          console.log("error in fetching pokemon data", res.statusText);
        }
        const data = await res.json();
        if (!data) {
          console.log("error in data ", data);
        }
        const pokemonData = await Promise.all(
          data.result.map(async (pokemon: { url: string }) => {
            const response = await fetch(pokemon.url);
            //directly return kar raha hu to Serializing big string error aa raha ( pokemon have huge data)
            return response.json();
          })
        );
        setPokemons(pokemonData);
        // data aa gye
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPokemons();
  }, []);

  const filteringPokemon = pokemons.filter((pokemons) => {
    return pokemons.name.toLowerCase().includes(searchPokemon.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-700 ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">Pokémon Researcher</h1>
        <div className="relative max-w-md border-solid-white w-full mx-auto mt-6 rounded-full">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <div className="absolute top-1.9 left-8 h-10 w-0.5 bg-gray-300"></div>
          <input
            type="text"
            placeholder="search your fav pokemon"
            className="w-full pl-10 rounded-lg border border-gray-200 bg-white text-white py-2 px-2"
            value={searchPokemon}
            onChange={(e) => setSearchPokemon(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1  lg:grid-col-4 md:grid-col-3 sm:grid-col-2 gap-4 mt-8">
            {filteringPokemon.map((pokemons) => (
              <Link
                href={`/pokemon/${pokemons.id}`}
                key={pokemons.id}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4">
                    <Image
                      src={pokemons.sprites.other.dream_world.front_default}
                      alt={pokemons.name}
                      className="w-full h-48 object-contain"
                    />
                    <h2 className="text-xl font-semibold text-center mt-4 capitalize text-gray-800 dark:text-white">
                      {pokemons.name}
                    </h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
