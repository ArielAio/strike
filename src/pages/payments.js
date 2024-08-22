import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '@/Header';
import { motion } from 'framer-motion';
import Select from 'react-select';

export default function Payments() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
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
        const calculateExpirationDate = (dateString) => {
            const [year, month, day] = dateString.split('-').map(Number);
            const newDate = new Date(year, month - 1, day);
            newDate.setDate(newDate.getDate() + 30);

            const expirationYear = newDate.getUTCFullYear();
            const expirationMonth = String(newDate.getUTCMonth() + 1).padStart(2, '0');
            const expirationDay = String(newDate.getUTCDate()).padStart(2, '0');

            return `${expirationYear}-${expirationMonth}-${expirationDay}`;
        };

        if (paymentDate) {
            setExpirationDate(calculateExpirationDate(paymentDate));
        }
    }, [paymentDate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'payments'), {
                userId,
                paymentDate,
                expirationDate,
                paymentMethod,
            });
            alert('Pagamento registrado com sucesso!');
            router.push('/list');

        } catch (error) {
            console.error('Erro ao registrar pagamento:', error);
            alert('Erro ao registrar o pagamento.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    const userOptions = users.map(user => ({
        value: user.id,
        label: `${user.name} (${user.email || 'nenhum email vinculado'})`
    }));

    const animationProps = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        whileFocus: { scale: 1.05 }
    };

    return (
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow flex items-center justify-center p-4">
                    <motion.div
                        className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md"
                        {...animationProps}
                    >
                        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black">
                            Registrar Pagamento
                        </h1>
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            {...animationProps}
                        >
                            <Select
                                options={userOptions}
                                onChange={(option) => setUserId(option ? option.value : '')}
                                placeholder="Selecione um Usuário"
                                className="basic-single"
                                classNamePrefix="select"
                            />
                            <motion.input
                                type="date"
                                placeholder="Data de Pagamento"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                {...animationProps}
                                transition={{ ...animationProps.transition, delay: 0.1 }}
                            />
                            <motion.input
                                type="date"
                                placeholder="Data de Vencimento"
                                value={expirationDate}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-gray-200"
                                {...animationProps}
                                transition={{ ...animationProps.transition, delay: 0.2 }}
                            />
                            <motion.select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                {...animationProps}
                                transition={{ ...animationProps.transition, delay: 0.3 }}
                            >
                                <option value="">Selecione o Meio de Pagamento</option>
                                <option value="Dinheiro">Dinheiro</option>
                                <option value="Pix">Pix</option>
                                <option value="Cartão">Cartão</option>
                                <option value="Outro">Outro</option>
                            </motion.select>
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
                <motion.button
                    onClick={handleBackClick}
                    className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full hover:bg-yellow-600"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    Voltar
                </motion.button>
            </div>
        </AuthRoute>
    );
}