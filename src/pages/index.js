import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '../../src/Header';
import { motion } from 'framer-motion';
import { FaUserPlus, FaMoneyCheckAlt, FaListAlt, FaCalendarAlt } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();

  const menuItems = [
    { icon: FaUserPlus, title: "Novo Cliente", color: "from-green-400 to-green-600", onClick: () => router.push('/register') },
    { icon: FaMoneyCheckAlt, title: "Pagamento", color: "from-blue-400 to-blue-600", onClick: () => router.push('/payments') },
    { icon: FaListAlt, title: "Listar Clientes", color: "from-purple-400 to-purple-600", onClick: () => router.push('/list') },
    { icon: FaCalendarAlt, title: "Calendário", color: "from-red-400 to-red-600", onClick: () => router.push('/calendar') },
  ];

  return (
    <AuthRoute>
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Painel de Controle
            </motion.h1>

            <div className="grid grid-cols-2 gap-6">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  className={`bg-gradient-to-r ${item.color} rounded-lg shadow-md p-6 flex flex-col items-center justify-center cursor-pointer text-white`}
                  onClick={item.onClick}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon size={32} className="mb-3" />
                  <span className="text-lg font-medium text-center">{item.title}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
