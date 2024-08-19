import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function List() {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUsersWithPayments = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersList = await Promise.all(usersSnapshot.docs.map(async (userDoc) => {
                    const paymentsSnapshot = await getDocs(
                        query(
                            collection(db, 'payments'),
                            where('userId', '==', userDoc.id),
                            orderBy('paymentDate', 'desc')
                        )
                    );
                    const payments = paymentsSnapshot.docs.map(doc => doc.data());
                    return { id: userDoc.id, ...userDoc.data(), payments };
                }));
                setUsers(usersList);
            } catch (error) {
                console.error('Erro ao buscar usuários e pagamentos:', error);
            }
        };

        fetchUsersWithPayments();
    }, []);

    const handleBackClick = () => {
        router.push('/');
    };

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    return (
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
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                    <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Lista de Usuários e Pagamentos</h1>
                    {users.length > 0 ? (
                        <ul className="space-y-4 md:space-y-6">
                            {users.map(user => (
                                <li key={user.id} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                                    <div
                                        onClick={() => toggleExpand(user.id)}
                                        className="cursor-pointer mb-4"
                                    >
                                        <strong className="text-gray-700">Nome:</strong> {user.name} <br />
                                        <strong className="text-gray-700">Email:</strong> {user.email} <br />
                                        <strong className="text-gray-700">Telefone:</strong> {user.phone}
                                    </div>
                                    {expandedUserId === user.id && (
                                        <div>
                                            <h3 className="text-lg md:text-xl font-semibold mb-2">Pagamentos:</h3>
                                            {user.payments.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {user.payments.map((payment, index) => (
                                                        <li key={index} className="p-2 border border-gray-200 rounded-md">
                                                            <strong className="text-gray-700">Data de Pagamento:</strong> {new Date(payment.paymentDate).toLocaleDateString('pt-BR')} <br />
                                                            <strong className="text-gray-700">Data de Vencimento:</strong> {new Date(payment.expirationDate).toLocaleDateString('pt-BR')}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500">Sem pagamentos registrados.</p>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center">Nenhum usuário encontrado.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
