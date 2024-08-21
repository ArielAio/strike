import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import Header from '@/Header';
import { motion } from 'framer-motion';

Modal.setAppElement('#__next');

export default function List() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
                setFilteredUsers(usersList);
                updateCalendarEvents(usersList);

            } catch (error) {
                console.error('Error fetching users and payments:', error);
            }
        };

        fetchUsersWithPayments();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleBackClick = () => {
        router.push('/');
    };

    const handleAddPaymentClick = () => {
        router.push('/payments');
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

        if (daysRemaining < 0) {
            return 'bg-red-500';
        } else if (daysRemaining <= 5) {
            return 'bg-yellow-300';
        } else {
            return 'bg-green-300'; 
        }
    };

    const deleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'users', userId));
            alert('Usuário deletado com sucesso!');
            setUsers(users.filter(user => user.id !== userId));
            setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            alert('Erro ao deletar o usuário.');
        }
    };

    const deletePayment = async (paymentId) => {
        try {
            await deleteDoc(doc(db, 'payments', paymentId));
            alert('Pagamento deletado com sucesso!');
            const updatedUsers = users.map(user => ({
                ...user,
                payments: user.payments.filter(payment => payment.id !== paymentId),
            }));
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
            updateCalendarEvents(updatedUsers);
        } catch (error) {
            console.error('Erro ao deletar pagamento:', error);
            alert('Erro ao deletar o pagamento.');
        }
    };

    const redirectToEditPage = (type, id) => {
        router.push(`/edit/${type}/${id}`);
    };

    return (
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow flex flex-col items-center p-4">
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 text-center">Usuários e Pagamentos</h2>
                        <motion.input
                            type="text"
                            placeholder="Pesquisar usuário por nome"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                        <motion.button
                            onClick={handleAddPaymentClick}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            Cadastrar Pagamento
                        </motion.button>
                        {filteredUsers.length > 0 ? (
                            <motion.ul
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {filteredUsers.map(user => (
                                    <motion.li
                                        key={user.id}
                                        className={`p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${getCardColor(user.payments)}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div onClick={() => toggleExpand(user.id)} className="cursor-pointer mb-2">
                                            <strong className="text-gray-700">Nome:</strong> {user.name} <br />
                                            <strong className="text-gray-700">Email:</strong> {user.email} <br />
                                            <strong className="text-gray-700">Telefone:</strong> {user.phone}
                                        </div>
                                        <div className="flex justify-end space-x-2 mt-2">
                                            <motion.button
                                                onClick={() => redirectToEditPage('user', user.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                Editar
                                            </motion.button>
                                            <motion.button
                                                onClick={() => deleteUser(user.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                Deletar
                                            </motion.button>
                                        </div>
                                        {expandedUserId === user.id && (
                                            <motion.div
                                                className="mt-4"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <h3 className="text-lg font-semibold mb-2">Pagamentos:</h3>
                                                {user.payments.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {user.payments.map(payment => (
                                                            <li key={payment.id} className="p-2 border border-gray-200 rounded-md">
                                                                <strong className="text-gray-700">Data do Pagamento:</strong> {new Date(payment.paymentDate).toLocaleDateString('pt-BR')} <br />
                                                                <strong className="text-gray-700">Data de Vencimento:</strong> {new Date(payment.expirationDate).toLocaleDateString('pt-BR')}
                                                                <div className="flex justify-end space-x-2 mt-2">
                                                                    <motion.button
                                                                        onClick={() => redirectToEditPage('payment', payment.id)}
                                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        Editar
                                                                    </motion.button>
                                                                    <motion.button
                                                                        onClick={() => deletePayment(payment.id)}
                                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        transition={{ duration: 0.3 }}
                                                                    >
                                                                        Deletar
                                                                    </motion.button>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500">Nenhum pagamento registrado.</p>
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.li>
                                ))}
                            </motion.ul>
                        ) : (
                            <p className="text-gray-500">Nenhum usuário encontrado.</p>
                        )}
                    </motion.div>

                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mt-8 flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Calendário</h2>
                        <Calendar
                            onChange={handleDateChange}
                            value={date}
                            tileContent={({ date, view }) => view === 'month' && getEventTitle(date) && (
                                <div className="flex items-center justify-center w-full h-full">
                                    <div
                                        className="bg-yellow-400 rounded-full w-6 h-4 cursor-pointer mb-2"
                                        onClick={() => openModal(date)}
                                    />
                                </div>
                            )}
                            className="rounded-lg border border-gray-300"
                        />
                    </motion.div>

                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        contentLabel="Detalhes do Evento"
                        className="fixed inset-0 flex items-center justify-center p-4"
                        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-75"
                    >
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detalhes do Evento</h2>
                            {modalEvents.length > 0 ? (
                                <ul className="space-y-4">
                                    {modalEvents.map((event, index) => (
                                        <motion.li
                                            key={index}
                                            className="p-4 border border-gray-200 rounded-md"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                                            <ul className="space-y-2">
                                                {event.details.map((payment, idx) => (
                                                    <li key={idx} className="text-gray-700">
                                                        <strong>Data de Vencimento:</strong> {new Date(payment.expirationDate).toLocaleDateString('pt-BR')}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Nenhum evento para esta data.</p>
                            )}
                            <motion.button
                                onClick={() => setModalIsOpen(false)}
                                className="mt-6 bg-yellow-500 text-black py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                Fechar
                            </motion.button>
                        </motion.div>
                    </Modal>
                </main>
                <motion.button
                    onClick={handleBackClick}
                    className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    Voltar
                </motion.button>
            </div>
        </AuthRoute>
    );
}
