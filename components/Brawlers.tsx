import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface Brawler {
  id: number;
  name: string;
  description: string;
  imageUrl2: string;
  class: {
    name: string;
  };
  rarity: {
    name: string;
    color: string;
  };
}

const Brawlers = () => {
  const [brawlers, setBrawlers] = useState<Brawler[]>([]);
  const [selectedBrawler, setSelectedBrawler] = useState<Brawler | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getRarityColor = (rarityName: string) => {
    const colors: { [key: string]: string } = {
      'Common': 'bg-gray-500',
      'Rare': 'bg-green-500',
      'Super Rare': 'bg-blue-500',
      'Epic': 'bg-purple-500',
      'Mythic': 'bg-red-500',
      'Legendary': 'bg-yellow-500',
      'Chromatic': 'bg-orange-500',
      'Ultra Legendary': 'bg-lime-500',
    };
    return colors[rarityName] || 'bg-gray-500';
  };

  const getBackgroundColor = (rarityName: string) => {
    const colors: { [key: string]: string } = {
      'Common': 'bg-gray-400',
      'Rare': 'bg-green-400',
      'Super Rare': 'bg-blue-400',
      'Epic': 'bg-purple-400',
      'Mythic': 'bg-red-400',
      'Legendary': 'bg-yellow-400',
      'Chromatic': 'bg-orange-400',
      'Ultra Legendary': 'bg-lime-400',
    };
    return colors[rarityName] || 'bg-purple-500';
  };

  const fetchBrawlers = () => {
    setLoading(true);
    setError('');
    
    fetch('https://api.brawlify.com/v1/brawlers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar los Brawlers');
        }
        return response.json();
      })
      .then(data => {
        setBrawlers(data.list);
        if (data.list.length > 0) {
          setSelectedBrawler(data.list[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al conectar con la API.');
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    fetchBrawlers();
  }, []);

  const handleSearch = () => {
    if (searchText.trim()) {
      const found = brawlers.find(b => 
        b.name.toLowerCase().includes(searchText.toLowerCase()) ||
        b.id.toString() === searchText.trim()
      );
      
      if (found) {
        setSelectedBrawler(found);
        setError('');
      } else {
        setError('Brawler no encontrado. Intenta con otro nombre o ID.');
      }
      setSearchText('');
    }
  };

  const bgColor = selectedBrawler ? getBackgroundColor(selectedBrawler.rarity.name) : 'bg-purple-500';

  return (
    <ScrollView className={`flex-1 ${bgColor}`}>
      <View className="min-h-screen p-6 pb-12">
        {/* Header */}
        <View className="items-center mt-12 mb-8">
          <Text className="text-6xl font-bold text-white mb-2">
            Brawl Stars
          </Text>
          <Text className="text-white text-lg">
            Busca tu Brawler favorito
          </Text>
        </View>
        
        {/* Search Bar */}
        <View className="w-full mb-8">
          <View className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <TextInput
              className="px-6 py-5 text-lg text-gray-800"
              placeholder="Nombre o ID del Brawler..."
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

        {/* Brawler Card */}
        <View className="items-center px-4">
          {loading ? (
            <View className="bg-white rounded-3xl p-10 shadow-xl">
              <Text className="text-2xl text-gray-700 font-bold">⚡ Cargando...</Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-3xl p-10 shadow-xl">
              <Text className="text-xl text-red-600 text-center font-bold">{error}</Text>
            </View>
          ) : selectedBrawler ? (
            <View className="bg-white rounded-3xl p-8 w-full shadow-xl">
              {/* Brawler ID */}
              <View className="items-end mb-2">
                <View className="bg-gray-800 px-4 py-2 rounded-full">
                  <Text className="text-white text-base font-bold">
                    ID: {selectedBrawler.id}
                  </Text>
                </View>
              </View>
              
              {/* Brawler Image */}
              <View className="items-center bg-gray-50 rounded-3xl p-8 mb-6">
                <Image 
                  source={{uri: selectedBrawler.imageUrl2}} 
                  style={{ width: 220, height: 220 }}
                  resizeMode="contain"
                />
              </View>
              
              {/* Brawler Name */}
              <Text className="text-5xl font-bold capitalize text-center mb-4 text-gray-900">
                {selectedBrawler.name}
              </Text>
              
              {/* Description */}
              <Text className="text-base text-gray-600 text-center mb-6 px-2">
                {selectedBrawler.description}
              </Text>
              
              {/* Class and Rarity */}
              <View className="flex-row justify-center gap-3 mb-4">
                <View className="bg-blue-600 px-6 py-3 rounded-full shadow-md">
                  <Text className="text-white font-bold capitalize text-lg">
                    {selectedBrawler.class.name}
                  </Text>
                </View>
                <View className={`${getRarityColor(selectedBrawler.rarity.name)} px-6 py-3 rounded-full shadow-md`}>
                  <Text className="text-white font-bold capitalize text-lg">
                    {selectedBrawler.rarity.name}
                  </Text>
                </View>
              </View>

              {/* Total Brawlers */}
              <Text className="text-center text-gray-500 text-sm mt-4">
                Total de Brawlers: {brawlers.length}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default Brawlers;