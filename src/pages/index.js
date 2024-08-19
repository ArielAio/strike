import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import LogoutButton from '../../src/LogoutButton';

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
        <header className="bg-blue-500 p-4 text-white shadow-md relative flex items-center" style={{ height: '80px' }}>
          <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
            Strike System
          </h1>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <LogoutButton />
          </div>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center px-4 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Bem-vindo ao Strike System</h2>
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={handleRegisterClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            >
              Cadastrar Cliente
            </button>
            <button
              onClick={handlePaymentsClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            >
              Registrar Pagamento
            </button>
            <button
              onClick={handleListClick}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
            >
              Listar Clientes
            </button>
          </div>
        </main>
      </div>
    </AuthRoute>
  );
}
