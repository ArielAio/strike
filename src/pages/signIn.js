import { useState } from 'react';
import { auth } from '../../src/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import Header from '@/Header';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login bem-sucedido!');
            router.push('/');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login de Administrador</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </main>
            <button
                onClick={handleBackClick}
                className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600"
            >
                Voltar
            </button>
        </div>
    );
}
