import "@/global.css";
import { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Brawlers from "@/components/Brawlers";
import GenAI from "@/components/GenAI";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const Index = () => {
  const [vistaActual, setVistaActual] = useState<'brawlers' | 'ai'>('brawlers');

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header con navegación */}
      <View className="bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-700">
        <Text className="text-white text-2xl font-bold text-center mb-4">
          Brawl Stars App
        </Text>
        
        <View className="flex-row justify-center gap-3">
          <TouchableOpacity
            onPress={() => setVistaActual('brawlers')}
            className={`flex-row items-center px-6 py-3 rounded-lg ${
              vistaActual === 'brawlers' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="grid" 
              size={20} 
              color="white" 
            />
            <Text className="text-white font-semibold ml-2">
              Brawlers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVistaActual('ai')}
            className={`flex-row items-center px-6 py-3 rounded-lg ${
              vistaActual === 'ai' ? 'bg-blue-600' : 'bg-gray-700'
            }`}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons 
              name="robot" 
              size={20} 
              color="white" 
            />
            <Text className="text-white font-semibold ml-2">
              IA Asistente
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido */}
      {vistaActual === 'brawlers' ? <Brawlers /> : <GenAI />}
    </View>
  );
};

export default Index;