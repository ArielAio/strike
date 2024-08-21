import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '../../src/Header'; // Importa o componente Header

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
          <h2 className="text-2xl md:text-3xl font-bold text-black">Bem-vindo ao Strike System</h2>
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={handleRegisterClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
            >
              Cadastrar Cliente
            </button>
            <button
              onClick={handlePaymentsClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
            >
              Registrar Pagamento
            </button>
            <button
              onClick={handleListClick}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
            >
              Listar Clientes
            </button>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
