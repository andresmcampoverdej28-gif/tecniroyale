import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Pokemon {
  name: string;
  image: string;
  id: number;
  types: string[];
}

const Pokedex = () => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-600',
      poison: 'bg-purple-500',
      ground: 'bg-amber-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-stone-600',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-slate-500',
      fairy: 'bg-pink-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getBackgroundColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-300',
      fire: 'bg-orange-400',
      water: 'bg-blue-400',
      electric: 'bg-yellow-300',
      grass: 'bg-green-400',
      ice: 'bg-cyan-300',
      fighting: 'bg-red-500',
      poison: 'bg-purple-400',
      ground: 'bg-amber-500',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-400',
      bug: 'bg-lime-400',
      rock: 'bg-stone-500',
      ghost: 'bg-purple-600',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-slate-400',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-red-500';
  };

  const fetchPokemon = (nameOrId: string) => {
    setLoading(true);
    setError('');
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Pokémon no encontrado');
        }
        return response.json();
      })
      .then(data => {
        const imageUrl = data.sprites.other['official-artwork'].front_default || 
                        data.sprites.front_default;
        
        setPokemon({
          name: data.name,
          image: imageUrl,
          id: data.id,
          types: data.types.map((t: any) => t.type.name),
        });
        setLoading(false);
      })
      .catch(() => {
        setError('Pokémon no encontrado. Intenta con otro nombre o número.');
        setLoading(false);
        setPokemon(null);
      });
  };

  useEffect(() => {
    fetchPokemon('25'); // Pikachu por defecto
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      fetchPokemon(searchText.trim());
      setSearchText('');
    }
  };

  const bgColor = pokemon ? getBackgroundColor(pokemon.types[0]) : 'bg-red-500';

  return (
    <ScrollView className={`flex-1 ${bgColor}`}>
      <View className="min-h-screen p-6 pb-12">
        {/* Header */}
        <View className="items-center mt-12 mb-8">
          <Text className="text-6xl font-bold text-white mb-2">
            Pokédex
          </Text>
          <Text className="text-white text-lg">
            Busca tu Pokémon favorito
          </Text>
        </View>
        
        {/* Search Bar */}
        <View className="w-full mb-8">
          <View className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <TextInput
              className="px-6 py-5 text-lg text-gray-800"
              placeholder="Número del Pokémon..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity 
            className="bg-yellow-400 rounded-3xl py-4 items-center mt-4 shadow-lg"
            onPress={handleSearch}
          >
            <Text className="text-gray-800 text-xl font-bold">
              🔍 Buscar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pokemon Card */}
        <View className="items-center px-4">
          {loading ? (
            <View className="bg-white rounded-3xl p-10 shadow-xl">
              <Text className="text-2xl text-gray-700 font-bold">⚡ Cargando...</Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-3xl p-10 shadow-xl">
              <Text className="text-xl text-red-600 text-center font-bold">{error}</Text>
            </View>
          ) : pokemon ? (
            <View className="bg-white rounded-3xl p-8 w-full shadow-xl">
              {/* Pokemon ID */}
              <View className="items-end mb-2">
                <View className="bg-gray-800 px-4 py-2 rounded-full">
                  <Text className="text-white text-base font-bold">
                    #{String(pokemon.id).padStart(3, '0')}
                  </Text>
                </View>
              </View>
              
              {/* Pokemon Image */}
              <View className="items-center bg-gray-50 rounded-3xl p-8 mb-6">
                <Image 
                  source={{uri: pokemon.image}} 
                  style={{ width: 220, height: 220 }}
                  resizeMode="contain"
                />
              </View>
              
              {/* Pokemon Name */}
              <Text className="text-5xl font-bold capitalize text-center mb-6 text-gray-900">
                {pokemon.name}
              </Text>
              
              {/* Pokemon Types */}
              <View className="flex-row justify-center gap-3">
                {pokemon.types.map((type, index) => (
                  <View 
                    key={index}
                    className={`${getTypeColor(type)} px-8 py-3 rounded-full shadow-md`}
                  >
                    <Text className="text-white font-bold capitalize text-lg">
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default Pokedex;