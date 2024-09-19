import { useState } from 'react';
import { auth } from '../../src/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-yellow-100 to-yellow-300">
            <Header />
            <motion.main 
                className="flex-grow flex items-center justify-center p-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.h2 
                        className="text-3xl font-bold mb-6 text-center text-gray-800"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        Login de Administrador
                    </motion.h2>
                    <motion.form 
                        onSubmit={handleLogin} 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <motion.input
                                id="email"
                                type="email"
                                placeholder="Seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                            <motion.input
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                whileFocus={{ scale: 1.02 }}
                            />
                        </div>
                        <motion.button
                            type="submit"
                            className="w-full py-3 px-4 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-300"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Entrar
                        </motion.button>
                    </motion.form>
                    <motion.button
                        onClick={handleBackClick}
                        className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Voltar
                    </motion.button>
                </motion.div>
            </motion.main>
        </div>
    );
}
