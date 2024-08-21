import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../../src/firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import AuthRoute from '../../../../src/AuthRoute';
import Header from '@/Header';

export default function EditPayment() {
    const router = useRouter();
    const { id } = router.query;
    const [payment, setPayment] = useState(null);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');

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
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                        {payment ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <select
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
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
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                />
                                <input
                                    type="date"
                                    placeholder="Data de Vencimento"
                                    value={expirationDate}
                                    readOnly
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 bg-gray-200"
                                />
                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                >
                                    Atualizar Pagamento
                                </button>
                            </form>
                        ) : (
                            <p>Carregando...</p>
                        )}
                    </div>
                </main>
                <button
                    onClick={handleBackClick}
                    className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                >
                    Voltar
                </button>
            </div>
        </AuthRoute>
    );
}
