import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '../../src/Header';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaUserPlus, FaMoneyCheckAlt, FaListAlt } from 'react-icons/fa';

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
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center space-y-8 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-black space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold">Bem-vindo ao Strike System</h1>
            <p className="text-lg md:text-xl">
              Gerencie seus clientes e pagamentos de forma eficiente.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer" 
              onClick={handleRegisterClick}
            >
              <FaUserPlus size={50} className="text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Cadastrar Cliente</h2>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer" 
              onClick={handlePaymentsClick}
            >
              <FaMoneyCheckAlt size={50} className="text-yellow-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Registrar Pagamento</h2>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer" 
              onClick={handleListClick}
            >
              <FaListAlt size={50} className="text-orange-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">Listar Clientes</h2>
            </motion.div>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
