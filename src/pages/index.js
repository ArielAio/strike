import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '../../src/Header';
import { motion } from 'framer-motion';
import { FaUserPlus, FaMoneyCheckAlt, FaListAlt, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [dailyTip, setDailyTip] = useState('');

  const menuItems = [
    { icon: FaUserPlus, title: "Novo Cliente", color: "from-green-400 to-green-600", onClick: () => router.push('/register') },
    { icon: FaMoneyCheckAlt, title: "Pagamento", color: "from-blue-400 to-blue-600", onClick: () => router.push('/payments') },
    { icon: FaListAlt, title: "Listar Clientes", color: "from-purple-400 to-purple-600", onClick: () => router.push('/list') },
    { icon: FaCalendarAlt, title: "Calendário", color: "from-red-400 to-red-600", onClick: () => router.push('/calendar') },
  ];

  useEffect(() => {
    const fetchAndTranslateDailyTip = async () => {
      try {
        const adviceResponse = await axios.get('https://api.adviceslip.com/advice');
        const englishTip = adviceResponse.data.slip.advice;

        const translateResponse = await axios.post('https://libretranslate.de/translate', {
          q: englishTip,
          source: 'en',
          target: 'pt'
        }, {
          headers: { 'Content-Type': 'application/json' }
        });

        setDailyTip(translateResponse.data.translatedText);
      } catch (error) {
        console.error('Erro ao buscar ou traduzir a dica diária:', error);
        setDailyTip('Mantenha-se hidratado e faça exercícios regularmente para uma vida saudável.');
      }
    };

    fetchAndTranslateDailyTip();
  }, []);

  return (
    <AuthRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-red-50">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Painel de Controle
            </motion.h1>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  className={`bg-gradient-to-r ${item.color} rounded-lg shadow-md p-3 flex flex-col items-center justify-center cursor-pointer text-white`}
                  onClick={item.onClick}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon size={24} className="mb-2" />
                  <span className="text-sm font-medium text-center">{item.title}</span>
                </motion.button>
              ))}
            </div>

            <motion.div 
              className="bg-white rounded-lg shadow-md p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <FaLightbulb className="text-yellow-400 mr-2" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Dica do dia</h2>
              </div>
              <p className="text-gray-600 italic text-sm">
                "{dailyTip || 'Carregando dica...'}"
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
