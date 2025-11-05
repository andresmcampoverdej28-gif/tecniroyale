import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GoogleGenAI } from '@google/genai';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

interface Brawler {
  id: number;
  name: string;
  starPowers: Array<{ name: string }>;
  gadgets: Array<{ name: string }>;
  class: { name: string };
}

const GenAI = () => {
  const [pregunta, setPregunta] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [brawlers, setBrawlers] = useState<Brawler[]>([]);

  useEffect(() => {
    cargarBrawlers();
  }, []);

  const cargarBrawlers = async () => {
    try {
      const res = await fetch('https://api.brawlify.com/v1/brawlers');
      const data = await res.json();
      setBrawlers(data.list || []);
    } catch (err) {
      console.error('Error al cargar brawlers:', err);
    }
  };

  const consultarGemini = async (preguntaUsuario: string) => {
    if (!preguntaUsuario.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      // Crear contexto con información de brawlers
      const contextoBrawlers = brawlers.map(b => 
        `${b.name} (Clase: ${b.class?.name || 'N/A'})`
      ).join(', ');

      const promptCompleto = `Eres un asistente experto en Brawl Stars. Aquí están todos los brawlers disponibles: ${contextoBrawlers}.

Pregunta del usuario: ${preguntaUsuario}

Responde de manera clara y concisa en español. Si te preguntan sobre brawlers para un mapa específico, considera:
- El tipo de mapa (Gema y Garra, Brawl Ball, Cazarrecompensas, etc.)
- Las clases de brawlers (Tank, Damage Dealer, Support, etc.)
- Estrategias generales

Da recomendaciones específicas con nombres de brawlers.`;

      const resultado = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptCompleto,
      });

      if (resultado.text) {
        setResponse(resultado.text);
      } else {
        setResponse('No se pudo obtener una respuesta de la IA');
      }
    } catch (err) {
      console.error('Error:', err);
      setResponse('Error al consultar la IA. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const preguntasEjemplo = [
    { texto: '¿Qué brawlers uso en Hot Zone?', icon: 'fire' },
    { texto: '¿Cuál es el mejor brawler para Brawl Ball?', icon: 'football' },
    { texto: '¿Qué tanques son buenos para Gema y Garra?', icon: 'shield' },
  ];

  const limpiarRespuesta = () => {
    setResponse('');
    setPregunta('');
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6 items-center">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="robot" size={40} color="#3b82f6" />
            <Text className="text-3xl font-bold text-white ml-2">
              Asistente Brawl Stars
            </Text>
          </View>
          <Text className="text-gray-400 text-base text-center">
            Pregúntame sobre estrategias, brawlers y mapas
          </Text>
          {brawlers.length > 0 && (
            <View className="flex-row items-center mt-2 bg-gray-800 px-3 py-1 rounded-full">
              <FontAwesome5 name="database" size={12} color="#10b981" />
              <Text className="text-green-400 text-xs ml-2">
                {brawlers.length} brawlers cargados
              </Text>
            </View>
          )}
        </View>

        {/* Preguntas de ejemplo */}
        {!response && (
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bulb" size={20} color="#fbbf24" />
              <Text className="text-white font-semibold ml-2">
                Preguntas de ejemplo:
              </Text>
            </View>
            {preguntasEjemplo.map((ejemplo, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setPregunta(ejemplo.texto);
                  consultarGemini(ejemplo.texto);
                }}
                className="bg-blue-600 rounded-lg p-3 mb-2 flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name={ejemplo.icon as any} size={18} color="white" />
                <Text className="text-white text-sm ml-3 flex-1">{ejemplo.texto}</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Respuesta */}
        {response && (
          <View className="bg-gray-800 rounded-lg p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="chat-processing" size={20} color="#10b981" />
                <Text className="text-green-400 font-semibold ml-2">
                  Respuesta:
                </Text>
              </View>
              <TouchableOpacity onPress={limpiarRespuesta}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
            <Text className="text-white text-base leading-6">{response}</Text>
          </View>
        )}

        {/* Loading */}
        {isLoading && (
          <View className="items-center py-8 bg-gray-800 rounded-lg">
            <ActivityIndicator size="large" color="#3b82f6" />
            <View className="flex-row items-center mt-3">
              <MaterialCommunityIcons name="brain" size={20} color="#9ca3af" />
              <Text className="text-gray-400 ml-2">Consultando IA...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Section */}
      <View className="pt-4 border-t border-gray-700">
        <View className="relative">
          <TextInput
            className="bg-gray-800 text-white rounded-lg p-4 pr-12 mb-3 text-base"
            placeholder="Escribe tu pregunta aquí..."
            placeholderTextColor="#9ca3af"
            value={pregunta}
            onChangeText={setPregunta}
            multiline
            maxLength={200}
          />
          {pregunta.length > 0 && (
            <TouchableOpacity
              onPress={() => setPregunta('')}
              className="absolute right-3 top-4"
            >
              <Ionicons name="close-circle" size={24} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => consultarGemini(pregunta)}
          disabled={isLoading || !pregunta.trim()}
          className={`rounded-lg p-4 items-center flex-row justify-center ${
            isLoading || !pregunta.trim() ? 'bg-gray-700' : 'bg-blue-600'
          }`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
          <Text className="text-white font-bold text-base ml-2">
            {isLoading ? 'Consultando...' : 'Preguntar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GenAI;