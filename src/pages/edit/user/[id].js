import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../../src/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AuthRoute from '../../../../src/AuthRoute';
import { motion } from 'framer-motion';
import ReactInputMask from 'react-input-mask';
import Header from '@/Header';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function EditUser() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const userDoc = doc(db, 'users', id);
                    const userSnapshot = await getDoc(userDoc);
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        setName(userData.name);
                        setEmail(userData.email || '');
                        setPhone(userData.phone || '');
                        setCity(userData.city || '');
                    }
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            };

            fetchUser();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userDocRef = doc(db, 'users', id);
            await updateDoc(userDocRef, {
                name,
                email: email || null,
                phone: phone || null,
                city,
            });
            alert('Usuário atualizado com sucesso!');
            router.push('/list');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar o usuário.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    return (
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4 py-8 bg-gradient-to-b from-orange-50 to-red-50">
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                            Editar Usuário
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <FaUser className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Nome completo *"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="relative">
                                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email (opcional)"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="relative">
                                <FaPhone className="absolute top-3 left-3 text-gray-400" />
                                <ReactInputMask
                                    mask="(99) 99999-9999"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    {(inputProps) => <input {...inputProps} type="tel" 
                                    placeholder="Telefone (opcional)" />}
                                </ReactInputMask>
                            </div>
                            <div className="relative">
                                <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                >
                                    <option value="" disabled>Selecione a cidade *</option>
                                    <option value="São João das Duas Pontes">São João das Duas Pontes</option>
                                    <option value="Pontalinda">Pontalinda</option>
                                </select>
                            </div>
                            <motion.button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-md shadow-md hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Atualizar Usuário
                            </motion.button>
                        </form>
                    </motion.div>
                </main>
                <motion.button
                    onClick={handleBackClick}
                    className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-red-700 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Voltar
                </motion.button>
            </div>
        </AuthRoute>
    );
}
