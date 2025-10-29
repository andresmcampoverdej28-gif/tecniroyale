import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface StarPower {
  name: string;
  description: string;
  imageUrl: string;
}

interface Gadget {
  name: string;
  description: string;
  imageUrl: string;
}

interface Brawler {
  id: number;
  name: string;
  description: string;
  imageUrl2: string;
  imageUrl3: string;
  class: {
    name: string;
  };
  rarity: {
    name: string;
    color: string;
  };
  starPowers: StarPower[];
  gadgets: Gadget[];
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
          <MaterialCommunityIcons name="star-shooting" size={50} color="white" />
          <Text className="text-6xl font-bold text-white mb-2 mt-2">
            Brawl Stars
          </Text>
          <Text className="text-white text-lg">
            Busca tu Brawler favorito
          </Text>
        </View>
        
        {/* Search Bar */}
        <View className="w-full mb-8">
          <View className="bg-white rounded-3xl overflow-hidden shadow-lg flex-row items-center px-4">
            <Ionicons name="search" size={24} color="#9CA3AF" />
            <TextInput
              className="flex-1 px-4 py-5 text-lg text-gray-800"
              placeholder="Nombre o ID del Brawler..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity 
            className="bg-yellow-400 rounded-3xl py-4 items-center mt-4 shadow-lg flex-row justify-center"
            onPress={handleSearch}
          >
            <Ionicons name="search-sharp" size={24} color="#1F2937" />
            <Text className="text-gray-800 text-xl font-bold ml-2">
              Buscar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Brawler Card */}
        <View className="items-center px-4">
          {loading ? (
            <View className="bg-white rounded-3xl p-10 shadow-xl items-center">
              <Image 
                source={require('../../assets/images/dropCarga.png')} 
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
              <Text className="text-2xl text-gray-700 font-bold mt-4">Buscando a tu main...</Text>
            </View>
          ) : error ? (
            <View className="bg-white rounded-3xl p-10 shadow-xl items-center">
              <Ionicons name="alert-circle" size={50} color="#DC2626" />
              <Text className="text-xl text-red-600 text-center font-bold mt-4">{error}</Text>
            </View>
          ) : selectedBrawler && (
            <View className="bg-white rounded-3xl p-8 w-full shadow-xl">
              {/* Brawler ID con Pin */}
              <View className="flex-row items-center justify-end mb-4">
                <View className="bg-gray-800 px-4 py-2 rounded-full flex-row items-center">
                  <Image 
                    source={{uri: selectedBrawler.imageUrl3}} 
                    style={{ width: 30, height: 30, marginRight: 8 }}
                    resizeMode="contain"
                  />
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
              <Text className="text-5xl font-bold capitalize text-center mb-4 text-gray-900" numberOfLines={2} adjustsFontSizeToFit>
                {selectedBrawler.name}
              </Text>
              
              {/* Description */}
              <View className="bg-gray-100 rounded-2xl p-4 mb-6">
                <Text className="text-base text-gray-600 text-center px-2">
                  {selectedBrawler.description}
                </Text>
              </View>
              
              {/* Class and Rarity */}
              <View className="flex-row justify-center flex-wrap gap-3 mb-6">
                <View className="bg-blue-600 px-6 py-3 rounded-full shadow-md flex-row items-center">
                  <MaterialCommunityIcons name="shield-sword" size={20} color="white" />
                  <Text className="text-white font-bold text-base ml-2" numberOfLines={1}>
                    {selectedBrawler.class.name}
                  </Text>
                </View>
                <View className={`${getRarityColor(selectedBrawler.rarity.name)} px-6 py-3 rounded-full shadow-md flex-row items-center flex-shrink`}>
                  <Ionicons name="diamond" size={20} color="white" />
                  <Text className="text-white font-bold text-base ml-2" numberOfLines={1}>
                    {selectedBrawler.rarity.name}
                  </Text>
                </View>
              </View>

              {/* Star Powers */}
              {selectedBrawler.starPowers?.length > 0 && (
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="star" size={24} color="#EAB308" />
                    <Text className="text-2xl font-bold text-gray-800 ml-2">
                      Habilidades Estelares
                    </Text>
                  </View>
                  {selectedBrawler.starPowers.map((sp, index) => (
                    <View key={index} className="bg-yellow-50 rounded-2xl p-4 mb-3 flex-row">
                      <Image 
                        source={{uri: sp.imageUrl}} 
                        style={{ width: 50, height: 50, marginRight: 12 }}
                        resizeMode="contain"
                      />
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {sp.name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {sp.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Gadgets */}
              {selectedBrawler.gadgets?.length > 0 && (
                <View className="mb-4">
                  <View className="flex-row items-center mb-3">
                    <MaterialCommunityIcons name="wrench" size={24} color="#8B5CF6" />
                    <Text className="text-2xl font-bold text-gray-800 ml-2">
                      Gadgets
                    </Text>
                  </View>
                  {selectedBrawler.gadgets.map((gadget, index) => (
                    <View key={index} className="bg-purple-50 rounded-2xl p-4 mb-3 flex-row">
                      <Image 
                        source={{uri: gadget.imageUrl}} 
                        style={{ width: 50, height: 50, marginRight: 12 }}
                        resizeMode="contain"
                      />
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                          {gadget.name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {gadget.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Total Brawlers */}
              <View className="bg-gray-100 rounded-2xl p-3 mt-4 flex-row items-center justify-center">
                <MaterialCommunityIcons name="account-group" size={20} color="#6B7280" />
                <Text className="text-center text-gray-500 text-sm ml-2 font-semibold">
                  Total de Brawlers: {brawlers.length}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Brawlers;