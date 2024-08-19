import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';


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
                <header className="bg-blue-500 p-4 text-white shadow-md relative">
                    <button
                        onClick={handleBackClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 absolute left-4 top-1/2 transform -translate-y-1/2"
                    >
                        Voltar
                    </button>
                    <h1 className="text-xl font-bold text-center">Strike System</h1>
                </header>
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione um Usuário</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                placeholder="Data de Pagamento"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="date"
                                placeholder="Data de Vencimento"
                                value={expirationDate}
                                readOnly
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200"
                            />
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Registrar Pagamento
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </AuthRoute>

    );
}
