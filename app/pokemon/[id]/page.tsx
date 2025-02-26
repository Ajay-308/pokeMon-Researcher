"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { FaArrowLeft, FaDumbbell } from "react-icons/fa6";
import { RxHeight } from "react-icons/rx";

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  height: number;
  weight: number;
  abilities: string[];
  stats: { name: string; value: number }[];
  moves: string[];
}

export default function PokemonDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
          next: { revalidate: 0 },
        });
        if (!res.ok) {
          console.error("Error fetching Pokémon details:", res.statusText);
          setLoading(false);
          return;
        }

        const details = await res.json();
        setPokemon({
          id: details.id,
          name: details.name,
          image: details.sprites.other.dream_world.front_default,
          types: details.types.map(
            (t: { type: { name: string } }) => t.type.name
          ),
          height: details.height / 10, // height and weight are more as compared
          weight: details.weight / 10,
          abilities: details.abilities.map(
            (a: { ability: { name: string } }) => a.ability.name
          ),
          stats: details.stats.map(
            (s: { stat: { name: string }; base_stat: number }) => ({
              name: s.stat.name,
              value: s.base_stat,
            })
          ),
          moves: details.moves
            .slice(0, 15)
            .map((m: { move: { name: string } }) => m.move.name),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!pokemon) {
    return <div className="text-center"> pokemon not found</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home page
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-1/2">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={400}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold capitalize mb-4 text-gray-800 dark:text-white">
                {pokemon.name}
              </h1>
              <div className="flex gap-2 mb-6">
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FaDumbbell className="mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Weight: {pokemon.weight} kg
                  </span>
                </div>
                <div className="flex items-center">
                  <RxHeight className="mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Height: {pokemon.height} m
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Abilities
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {pokemon.abilities.map((ability, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm capitalize"
                  >
                    {ability}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                Stats
              </h2>
              <div className="space-y-3">
                {pokemon.stats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">
                        {stat.name}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(stat.value / 255) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">
            Moves
          </h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.moves.map((move, index) => (
              <span
                key={index}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm capitalize"
              >
                {move}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
