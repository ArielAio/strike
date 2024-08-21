import { useState } from 'react';
import { db } from '../../src/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '@/Header';
import { motion } from 'framer-motion';

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
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4">
                    <motion.div
                        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black">
                            Cadastro de Usuário
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <motion.input
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                            <motion.input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                            />
                            <motion.input
                                type="tel"
                                placeholder="Telefone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            />
                            <motion.button
                                type="submit"
                                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                Cadastrar Usuário
                            </motion.button>
                        </form>
                    </motion.div>
                </main>
            </div>
        </AuthRoute>
    );
}
