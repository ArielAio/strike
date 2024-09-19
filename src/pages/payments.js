import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '@/Header';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

export default function Payments() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [paymentDate, setPaymentDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersList = querySnapshot.docs.map(doc => ({ value: doc.id, label: doc.data().name }));
                setUsers(usersList);
            } catch (error) {
                console.error('Erro ao buscar usuários:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (paymentDate) {
            const date = new Date(paymentDate);
            date.setMonth(date.getMonth() + 1);
            setExpirationDate(date.toISOString().split('T')[0]);
        }
    }, [paymentDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            alert('Por favor, selecione um usuário.');
            return;
        }

        try {
            await addDoc(collection(db, 'payments'), {
                userId: selectedUser.value,
                paymentDate,
                expirationDate,
                paymentMethod,
            });
            alert('Pagamento registrado com sucesso!');
            router.push('/');
        } catch (error) {
            console.error('Erro ao registrar pagamento:', error);
            alert('Erro ao registrar o pagamento.');
        }
    };

    const paymentMethods = [
        { value: 'Dinheiro', label: 'Dinheiro' },
        { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
        { value: 'Cartão de Débito', label: 'Cartão de Débito' },
        { value: 'Pix', label: 'Pix' },
    ];

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
                            Registrar Pagamento
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <Select
                                    options={users}
                                    value={selectedUser}
                                    onChange={setSelectedUser}
                                    placeholder="Selecione um cliente"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label>
                                <FaCalendarAlt className="absolute top-9 left-3 text-gray-400" />
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                                <FaCalendarAlt className="absolute top-9 left-3 text-gray-400" />
                                <input
                                    type="date"
                                    value={expirationDate}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
                                <Select
                                    options={paymentMethods}
                                    value={paymentMethods.find(method => method.value === paymentMethod)}
                                    onChange={(selectedOption) => setPaymentMethod(selectedOption.value)}
                                    placeholder="Selecione o método de pagamento"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>
                            <motion.button
                                type="submit"
                                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-md shadow-md hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Registrar Pagamento
                            </motion.button>
                        </form>
                    </motion.div>
                </main>
            </div>
        </AuthRoute>
    );
}