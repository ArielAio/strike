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
      <header className="bg-blue-500 p-4 text-white shadow-md flex items-center justify-between">
        <h1 className="text-xl font-bold">Strike System</h1>
        <div className="space-x-4">
          <button
            onClick={handleRegisterClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Cadastrar Cliente
          </button>
          <button
            onClick={handleListClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Listar Clientes
          </button>
          <button
            onClick={handlePaymentsClick}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Registrar Pagamento
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <h2 className="text-3xl font-bold text-gray-800">Bem-vindo ao Strike System</h2>
      </main>
    </div>
  );
}
