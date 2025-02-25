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
  types: [];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchPokemon, setSearchPokemon] = useState("");

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
        if (!res.ok) {
          console.error("Error fetching Pokémon data:", res.statusText);
          return;
        }

        const data = await res.json();
        if (!data || !data.results) {
          console.error("Invalid data structure:", data);
          return;
        }

        const pokemonData = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const response = await fetch(pokemon.url);
            if (!response.ok) {
              console.error(`Failed to fetch details for ${pokemon.name}`);
              return null;
            }

            const details = await response.json();
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other.dream_world.front_default,
              types: details.types.map(
                (t: { type: { name: string } }) => t.type.name
              ),
            };
          })
        );
        setPokemons(pokemonData.filter(Boolean));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  const filteringPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchPokemon.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white">
          Pokémon Researcher
        </h1>
        <div className="relative max-w-md w-full mx-auto mt-6">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <div className="absolute mt-1 ml-1 left-8 h-8 w-0.5 bg-gray-300"></div>
          <input
            type="text"
            placeholder="Search your favorite Pokémon"
            className="w-full pl-12 rounded-lg border border-gray-200 bg-white text-gray-800 py-2 px-2"
            value={searchPokemon}
            onChange={(e) => setSearchPokemon(e.target.value)}
          />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
            {filteringPokemons.map((pokemon) => (
              <Link
                href={`/pokemon/${pokemon.id}`}
                key={pokemon.id}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-4">
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain"
                    />
                    <h2 className="text-xl font-semibold text-center mt-4 capitalize text-gray-800 dark:text-white">
                      {pokemon.name}
                    </h2>
                    <div className="flex justify-center mt-2 space-x-2">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`px-2 py-1 text-sm rounded-full ${
                            type === "fire"
                              ? "bg-red-500 text-white"
                              : type === "water"
                              ? "bg-blue-500 text-white"
                              : type === "grass"
                              ? "bg-green-500 text-white"
                              : type === "electric"
                              ? "bg-yellow-500 text-black"
                              : type === "flying"
                              ? "bg-blue-700 text-white"
                              : type === "ghost"
                              ? "bg-purple-600 text-white"
                              : type === "psychic"
                              ? "bg-pink-500 text-white"
                              : type === "rock"
                              ? " text-white bg-[#A38c21]"
                              : type === "fighting"
                              ? "bg-red-700 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
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
