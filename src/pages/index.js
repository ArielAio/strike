import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '../../src/Header';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleRegisterClick = () => {
    router.push('/register');
  };

  const handleListClick = () => {
    router.push('/list');
  };

  const handlePaymentsClick = () => {
    router.push('/payments');
  };

  return (
    <AuthRoute>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 text-center space-y-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-black"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Bem-vindo ao Strike System
          </motion.h2>
          <div className="w-full max-w-sm space-y-4">
            <motion.button
              onClick={handleRegisterClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Cadastrar Cliente
            </motion.button>
            <motion.button
              onClick={handlePaymentsClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Registrar Pagamento
            </motion.button>
            <motion.button
              onClick={handleListClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              Listar Clientes
            </motion.button>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
