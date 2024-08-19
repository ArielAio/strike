import { useState } from 'react';
import { db } from '../../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userRef = await addDoc(collection(db, 'users'), {
                name,
                email,
                phone,
            });
            alert('Usuário cadastrado com sucesso! ID: ' + userRef.id);
        } catch (error) {
            console.error('Erro ao salvar usuário:', error);
            alert('Erro ao salvar o usuário.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="bg-blue-500 p-4 text-white shadow-md relative">
                <button
                    onClick={handleBackClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 absolute left-4 top-1/2 transform -translate-y-1/2"
                >
                    Voltar
                </button>
                <h1 className="text-xl font-bold text-center">Strike System</h1>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastro de Usuário</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="tel"
                            placeholder="Telefone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cadastrar Usuário
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
