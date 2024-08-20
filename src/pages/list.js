import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

export default function List() {
    const [users, setUsers] = useState([]);
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalEvents, setModalEvents] = useState([]);
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
                    const payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    return { id: userDoc.id, ...userDoc.data(), payments };
                }));

                setUsers(usersList);
                updateCalendarEvents(usersList);
            } catch (error) {
                console.error('Error fetching users and payments:', error);
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

    const updateCalendarEvents = (usersList) => {
        const events = usersList.flatMap(user =>
            user.payments.map(payment => ({
                date: new Date(payment.expirationDate),
                title: `${user.name} - Vencimento`,
                details: user.payments.filter(p => new Date(p.expirationDate).toDateString() === new Date(payment.expirationDate).toDateString())
            }))
        );
        setEvents(events);
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const getEventTitle = (date) => {
        const event = events.find(event => event.date.toDateString() === date.toDateString());
        return event ? event.title : null;
    };

    const openModal = (date) => {
        const filteredEvents = events.filter(event => event.date.toDateString() === date.toDateString());
        setModalEvents(filteredEvents);
        setModalIsOpen(true);
    };

    const getCardColor = (payments) => {
        if (!payments || payments.length === 0) return 'bg-white';

        const currentDate = new Date();
        const lastPayment = payments[0];
        const expiration = new Date(lastPayment.expirationDate);
        const daysRemaining = Math.ceil((expiration - currentDate) / (1000 * 60 * 60 * 24));

        console.log("pagamentos: ", daysRemaining)

        if (daysRemaining < 0) {
            return 'bg-red-500'; // Atrasado
        } else if (daysRemaining <= 5) {
            return 'bg-yellow-300'; // Faltando 5 dias ou menos
        } else if (daysRemaining > 5) {
            return 'bg-green-300'; // Mais de 25 dias restantes
        } else {
            return 'bg-white'; // Neutro
        }
    };

    const deletePayment = async (paymentId) => {
        try {
            await deleteDoc(doc(db, 'payments', paymentId));
            alert('Pagamento deletado com sucesso!');
            // Atualizar a lista de usuários após a exclusão
            const updatedUsers = users.map(user => ({
                ...user,
                payments: user.payments.filter(payment => payment.id !== paymentId),
            }));
            setUsers(updatedUsers);
            updateCalendarEvents(updatedUsers);
        } catch (error) {
            console.error('Erro ao deletar pagamento:', error);
            alert('Erro ao deletar o pagamento.');
        }
    };

    return (
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <header className="bg-blue-600 text-white py-4 shadow-md flex justify-center items-center relative">
                    <button
                        onClick={handleBackClick}
                        className="absolute left-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Voltar
                    </button>
                    <h1 className="text-2xl font-bold">Strike System</h1>
                </header>
                <main className="flex-grow flex flex-col items-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Usuários e Pagamentos</h2>
                        {users.length > 0 ? (
                            <ul className="space-y-4">
                                {users.map(user => (
                                    <li key={user.id} className={`p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${getCardColor(user.payments)}`}>
                                        <div onClick={() => toggleExpand(user.id)} className="cursor-pointer mb-2">
                                            <strong className="text-gray-700">Nome:</strong> {user.name} <br />
                                            <strong className="text-gray-700">Email:</strong> {user.email} <br />
                                            <strong className="text-gray-700">Telefone:</strong> {user.phone}
                                        </div>
                                        {expandedUserId === user.id && (
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">Pagamentos:</h3>
                                                {user.payments.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {user.payments.map((payment, index) => (
                                                            <li key={index} className="p-2 border border-gray-200 rounded-md">
                                                                <strong className="text-gray-700">Data do Pagamento:</strong> {new Date(payment.paymentDate).toLocaleDateString('pt-BR')} <br />
                                                                <strong className="text-gray-700">Data de Vencimento:</strong> {new Date(payment.expirationDate).toLocaleDateString('pt-BR')}
                                                                <button
                                                                    onClick={() => deletePayment(payment.id)}
                                                                    className="ml-4 text-red-600 hover:text-red-800"
                                                                >
                                                                    Deletar
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500">Nenhum pagamento registrado.</p>
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mt-8 flex flex-col items-center">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Calendário de Vencimentos</h2>
                        <div className="w-full flex justify-center">
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                tileContent={({ date, view }) => view === 'month' && getEventTitle(date) && (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <div
                                            className="bg-red-400 rounded-full w-3 h-3 cursor-pointer mb-2"
                                            onClick={() => openModal(date)}
                                        />
                                    </div>
                                )}
                                className="rounded-lg border border-gray-300"
                            />
                        </div>
                    </div>
                </main>

                {/* Modal para Detalhes do Evento */}
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    contentLabel="Detalhes do Evento"
                    className="fixed inset-0 flex items-center justify-center p-4"
                    overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detalhes do Evento</h2>
                        {modalEvents.length > 0 ? (
                            <ul className="space-y-4">
                                {modalEvents.map((event, index) => (
                                    <li key={index} className="p-4 border border-gray-200 rounded-md">
                                        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                                        <ul className="space-y-2">
                                            {event.details.map((payment, idx) => (
                                                <li key={idx} className="text-gray-700">
                                                    <strong>Data de Vencimento:</strong> {new Date(payment.expirationDate).toLocaleDateString('pt-BR')}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Nenhum evento para esta data.</p>
                        )}
                        <button onClick={() => setModalIsOpen(false)} className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                            Fechar
                        </button>
                    </div>
                </Modal>
            </div>
        </AuthRoute>
    );
}
