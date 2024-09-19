import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { db } from '../../src/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import AuthRoute from '../../src/AuthRoute';
import Header from '@/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaCreditCard, FaUserAlt, FaTimes } from 'react-icons/fa';

moment.locale('pt-BR');
const localizer = momentLocalizer(moment);

export default function PaymentCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

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

                const calendarEvents = usersList.flatMap(user => 
                    user.payments.map(payment => ({
                        id: payment.id,
                        title: user.name,
                        start: moment(payment.expirationDate).toDate(),
                        end: moment(payment.expirationDate).toDate(),
                        allDay: true,
                        resource: user,
                        paymentMethod: payment.paymentMethod,
                        expirationDate: payment.expirationDate,
                    }))
                );

                setEvents(calendarEvents);
            } catch (error) {
                console.error('Error fetching users and payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersWithPayments();
    }, []);

    const getPaymentStatus = (expirationDate) => {
        const daysRemaining = Math.ceil((new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) return 'atrasado';
        if (daysRemaining <= 5) return 'proximo';
        return 'emDia';
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const status = getPaymentStatus(event.expirationDate);
        let backgroundColor, borderColor;

        switch (status) {
            case 'atrasado':
                backgroundColor = 'rgba(239, 68, 68, 0.9)'; // Vermelho
                borderColor = '#DC2626';
                break;
            case 'proximo':
                backgroundColor = 'rgba(249, 115, 22, 0.9)'; // Laranja
                borderColor = '#EA580C';
                break;
            case 'emDia':
                backgroundColor = 'rgba(34, 197, 94, 0.9)'; // Verde
                borderColor = '#16A34A';
                break;
            default:
                backgroundColor = 'rgba(156, 163, 175, 0.9)'; // Cinza
                borderColor = '#6B7280';
        }

        const style = {
            backgroundColor,
            borderColor,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderRadius: '8px',
            color: 'white',
            display: 'block',
            fontWeight: '600',
            fontSize: '0.85em',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
        };
        return { style };
    };

    const onSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closeEventDetails = () => {
        setSelectedEvent(null);
    };

    return (
        <AuthRoute>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen flex flex-col bg-gray-50"
            >
                <Header />
                <main className="flex-grow p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 flex items-center">
                            <FaCalendarAlt className="mr-3 text-orange-500" />
                            Calendário de Vencimentos
                        </h1>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                                <Calendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: 'calc(100vh - 250px)' }}
                                    eventPropGetter={eventStyleGetter}
                                    views={['month', 'week', 'day']}
                                    messages={{
                                        next: "Próximo",
                                        previous: "Anterior",
                                        today: "Hoje",
                                        month: "Mês",
                                        week: "Semana",
                                        day: "Dia"
                                    }}
                                    onSelectEvent={onSelectEvent}
                                    popup
                                    tooltipAccessor={event => `${event.title}`}
                                />
                            </div>
                        )}
                    </div>
                </main>
            </motion.div>

            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                        onClick={closeEventDetails}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800">Detalhes do Pagamento</h2>
                                <button
                                    onClick={closeEventDetails}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center">
                                    <FaUserAlt className="text-orange-500 mr-3" size={24} />
                                    <p className="text-gray-700 text-lg"><span className="font-semibold">Cliente:</span> {selectedEvent.resource.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="text-orange-500 mr-3" size={24} />
                                    <p className="text-gray-700 text-lg"><span className="font-semibold">Data de Vencimento:</span> {moment(selectedEvent.start).format('DD/MM/YYYY')}</p>
                                </div>
                                <div className="flex items-center">
                                    <FaCreditCard className="text-orange-500 mr-3" size={24} />
                                    <p className="text-gray-700 text-lg"><span className="font-semibold">Método de Pagamento:</span> {selectedEvent.paymentMethod}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeEventDetails}
                                className="mt-8 w-full bg-orange-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-orange-600 transition-colors duration-300 flex items-center justify-center"
                            >
                                <FaTimes className="mr-2" /> Fechar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .rbc-calendar {
                    @apply font-sans bg-white rounded-2xl overflow-hidden shadow-lg;
                }
                .rbc-header {
                    @apply bg-gray-100 py-4 font-bold uppercase tracking-wide text-gray-700;
                }
                .rbc-today {
                    @apply bg-yellow-50;
                }
                .rbc-event {
                    @apply p-2 text-sm shadow-md transition-all duration-300 ease-in-out;
                }
                .rbc-event:hover {
                    @apply transform -translate-y-0.5 shadow-lg;
                }
                .rbc-event-content {
                    @apply overflow-hidden text-ellipsis;
                }
                .rbc-toolbar {
                    @apply mb-6 flex flex-wrap justify-between items-center;
                }
                .rbc-toolbar button {
                    @apply bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ease-in-out shadow-sm;
                }
                .rbc-toolbar button:hover {
                    @apply bg-gray-50 border-gray-400;
                }
                .rbc-toolbar button.rbc-active {
                    @apply bg-orange-500 text-white border-orange-500;
                }
                .rbc-toolbar-label {
                    @apply text-2xl font-bold text-gray-800;
                }
                .rbc-month-view {
                    @apply border-none shadow-inner rounded-xl overflow-hidden;
                }
                .rbc-day-bg {
                    @apply transition-colors duration-200;
                }
                .rbc-day-bg:hover {
                    @apply bg-gray-50;
                }
                .rbc-off-range-bg {
                    @apply bg-gray-100;
                }
                .rbc-date-cell {
                    @apply p-2 text-right;
                }
                .rbc-date-cell > a {
                    @apply font-medium text-gray-700;
                }
                @media (max-width: 640px) {
                    .rbc-toolbar {
                        @apply flex-col items-stretch space-y-4;
                    }
                    .rbc-toolbar-label {
                        @apply text-center;
                    }
                }
            `}</style>
        </AuthRoute>
    );
}
