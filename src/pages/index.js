import { useRouter } from 'next/router';

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-500 p-4 text-white shadow-md">
        <h1 className="text-xl font-bold text-center">Strike System</h1>
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
  );
}
