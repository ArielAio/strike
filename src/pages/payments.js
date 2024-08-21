import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '@/Header';
import { motion } from 'framer-motion';

export default function Payments() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersList);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (paymentDate) {
            const paymentDateObj = new Date(paymentDate);
            paymentDateObj.setDate(paymentDateObj.getDate() + 30);
            setExpirationDate(paymentDateObj.toISOString().split('T')[0]);
        }
    }, [paymentDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'payments'), {
                userId,
                paymentDate,
                expirationDate,
            });
            alert('Pagamento registrado com sucesso!');
        } catch (error) {
            console.error('Erro ao registrar pagamento:', error);
            alert('Erro ao registrar o pagamento.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    return (
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                         <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black">
                            Registrar Pagamento
                        </h1>
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <option value="">Selecione um Usuário</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </motion.select>
                            <motion.input
                                type="date"
                                placeholder="Data de Pagamento"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            />
                            <motion.input
                                type="date"
                                placeholder="Data de Vencimento"
                                value={expirationDate}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-gray-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            />
                            <motion.button
                                type="submit"
                                className="w-full py-2 px-4 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                Registrar Pagamento
                            </motion.button>
                        </motion.form>
                    </motion.div>
                </main>
            </div>
        </AuthRoute>
    );
}
