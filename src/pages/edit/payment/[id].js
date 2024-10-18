import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../../src/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import AuthRoute from '../../../../src/AuthRoute';
import { motion } from 'framer-motion';
import Header from '@/Header';
import { FaUser, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

export default function EditPayment() {
    const router = useRouter();
    const { id } = router.query;
    const [payment, setPayment] = useState(null);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

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
        if (id) {
            const fetchPayment = async () => {
                try {
                    const paymentDoc = doc(db, 'payments', id);
                    const paymentSnapshot = await getDoc(paymentDoc);
                    if (paymentSnapshot.exists()) {
                        const paymentData = paymentSnapshot.data();
                        setPayment(paymentData);
                        setUserId(paymentData.userId);
                        setPaymentDate(new Date(paymentData.paymentDate).toISOString().split('T')[0]);
                        setExpirationDate(new Date(paymentData.expirationDate).toISOString().split('T')[0]);
                        setPaymentMethod(paymentData.paymentMethod || '');
                    }
                } catch (error) {
                    console.error('Erro ao buscar pagamento:', error);
                }
            };

            fetchPayment();
        }
    }, [id]);

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
            const paymentDocRef = doc(db, 'payments', id);
            await updateDoc(paymentDocRef, {
                userId,
                paymentDate,
                expirationDate,
                paymentMethod,
            });
            alert('Pagamento atualizado com sucesso!');
            router.push('/list');
        } catch (error) {
            console.error('Erro ao atualizar pagamento:', error);
            alert('Erro ao atualizar o pagamento.');
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
                            Editar Pagamento
                        </h1>
                        {payment ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <FaUser className="absolute top-3 left-3 text-gray-400" />
                                    <select
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="">Selecione um Usuário</option>
                                        {users.map(user => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                                    <input
                                        type="date"
                                        placeholder="Data de Pagamento"
                                        value={paymentDate}
                                        onChange={(e) => setPaymentDate(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                                    <input
                                        type="date"
                                        placeholder="Data de Vencimento"
                                        value={expirationDate}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-200"
                                    />
                                </div>
                                <div className="relative">
                                    <FaCreditCard className="absolute top-3 left-3 text-gray-400" />
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    >
                                        <option value="">Selecione o Meio de Pagamento</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="Pix">Pix</option>
                                        <option value="Cartão">Cartão</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                                <motion.button
                                    type="submit"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-md shadow-md hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Atualizar Pagamento
                                </motion.button>
                            </form>
                        ) : (
                            <p className="text-center text-gray-600">Carregando...</p>
                        )}
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
