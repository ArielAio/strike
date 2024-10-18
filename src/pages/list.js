import { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import AuthRoute from '../../src/AuthRoute';
import Header from '@/Header';
import { FaTrash, FaEdit, FaChevronDown, FaSearch, FaPlus, FaFilter, FaUserPlus } from 'react-icons/fa';
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { motion, AnimatePresence } from 'framer-motion';

const NoClientsMessage = ({ onAddClient }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-center py-10 bg-white rounded-lg shadow-md"
  >
    <FaUserPlus className="mx-auto text-6xl text-gray-300 mb-4" />
    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhum cliente encontrado</h2>
    <p className="text-gray-500 mb-4">Comece adicionando seu primeiro cliente!</p>
    <button
      onClick={onAddClient}
      className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105 inline-flex items-center"
    >
      <FaUserPlus className="mr-2" /> Adicionar Cliente
    </button>
  </motion.div>
);

export default function List() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedUserId, setExpandedUserId] = useState(null);
    const [paymentFilter, setPaymentFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
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
            } catch (error) {
                console.error('Error fetching users and payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersWithPayments();
    }, []);

    useEffect(() => {
        const filterUsers = () => {
            let filtered = users;

            if (searchTerm) {
                filtered = filtered.filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (paymentFilter) {
                filtered = filtered.filter(user => getPaymentStatus(user.payments) === paymentFilter);
            }

            if (cityFilter) {
                filtered = filtered.filter(user => user.city === cityFilter);
            }

            setFilteredUsers(filtered);
            setCurrentPage(0); // Reset to first page when filters change
        };

        filterUsers();
    }, [searchTerm, paymentFilter, cityFilter, users]);

    const getPaymentStatus = (payments) => {
        if (!payments || payments.length === 0) return 'nenhum';
        const lastPayment = payments[0];
        const expiration = new Date(lastPayment.expirationDate);
        const daysRemaining = Math.ceil((expiration - new Date()) / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) return 'atrasado';
        if (daysRemaining <= 5) return 'proximo';
        return 'emDia';
    };

    const toggleExpand = (userId) => {
        setExpandedUserId(expandedUserId === userId ? null : userId);
    };

    const deleteUser = async (userId, userName) => {
        if (window.confirm(`Tem certeza que deseja deletar o usuário ${userName}?`)) {
            try {
                await deleteDoc(doc(db, 'users', userId));
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
                setFilteredUsers(prevFiltered => prevFiltered.filter(user => user.id !== userId));
                alert('Usuário deletado com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar usuário:', error);
                alert('Erro ao deletar o usuário.');
            }
        }
    };

    const deletePayment = async (paymentId, userId) => {
        if (window.confirm('Tem certeza que deseja deletar esse pagamento?')) {
            try {
                await deleteDoc(doc(db, 'payments', paymentId));
                const updatedUsers = users.map(user => {
                    if (user.id === userId) {
                        return {
                            ...user,
                            payments: user.payments.filter(payment => payment.id !== paymentId),
                        };
                    }
                    return user;
                });
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
                alert('Pagamento deletado com sucesso!');
            } catch (error) {
                console.error('Erro ao deletar pagamento:', error);
                alert('Erro ao deletar o pagamento.');
            }
        }
    };

    const paymentFilterOptions = [
        { value: '', label: 'Todos os pagamentos' },
        { value: 'atrasado', label: 'Atrasados' },
        { value: 'proximo', label: 'Próximos ao vencimento' },
        { value: 'emDia', label: 'Em dia' },
        { value: 'nenhum', label: 'Sem pagamentos' },
    ];

    const cityFilterOptions = [
        { value: '', label: 'Todas as cidades' },
        { value: 'São João das Duas Pontes', label: 'São João das Duas Pontes' },
        { value: 'Pontalinda', label: 'Pontalinda' },
    ];

    const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentPageUsers = filteredUsers.slice(offset, offset + itemsPerPage);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
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
                        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Lista de Clientes</h1>
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 transform hover:scale-105 flex items-center justify-center"
                            >
                                <FaPlus className="mr-2" /> Adicionar Cliente
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                                <div className="flex-grow mb-4 md:mb-0">
                                    <div className="relative">
                                        <FaSearch className="absolute top-3 left-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Buscar cliente..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                                    <Select
                                        options={paymentFilterOptions}
                                        value={paymentFilterOptions.find(option => option.value === paymentFilter)}
                                        onChange={(selectedOption) => {
                                            setPaymentFilter(selectedOption.value);
                                            setCurrentPage(0); // Reset to first page when filter changes
                                        }}
                                        placeholder="Filtrar por pagamento"
                                        className="react-select-container w-full md:w-48"
                                        classNamePrefix="react-select"
                                    />
                                    <Select
                                        options={cityFilterOptions}
                                        value={cityFilterOptions.find(option => option.value === cityFilter)}
                                        onChange={(selectedOption) => {
                                            setCityFilter(selectedOption.value);
                                            setCurrentPage(0); // Reset to first page when filter changes
                                        }}
                                        placeholder="Filtrar por cidade"
                                        className="react-select-container w-full md:w-48"
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-10"
                            >
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                                <p className="mt-4 text-gray-600 text-lg">Carregando clientes...</p>
                            </motion.div>
                        ) : filteredUsers.length > 0 ? (
                            <>
                                <AnimatePresence>
                                    {currentPageUsers.map((user) => (
                                        <motion.div
                                            key={user.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className={`mb-4 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg user-card-transition ${getPaymentStatus(user.payments) === 'atrasado' ? 'border-l-4 border-red-500' :
                                                    getPaymentStatus(user.payments) === 'proximo' ? 'border-l-4 border-yellow-500' :
                                                        getPaymentStatus(user.payments) === 'emDia' ? 'border-l-4 border-green-500' :
                                                            'border-l-4 border-gray-300'
                                                }`}
                                        >
                                            <div className="p-4 md:p-6">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 md:mb-0">
                                                        {user.name} 
                                                        {user.payments.length > 0 && (
                                                            <span className="text-sm text-gray-500">
                                                                {' '} {/* Adicionado espaço aqui */}
                                                                {(() => {
                                                                    const daysRemaining = Math.ceil((new Date(user.payments[0].expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                                                                    if (daysRemaining < 0) {
                                                                        return '(Atrasado)';
                                                                    } else if (daysRemaining === 0) {
                                                                        return '(Hoje)';
                                                                    } else {
                                                                        return `(Vence em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'})`;
                                                                    }
                                                                })()}
                                                            </span>
                                                        )}
                                                    </h2>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/edit/user/${user.id}`)}
                                                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-200 transform hover:scale-110"
                                                            title="Editar cliente"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user.id, user.name)}
                                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                                                            title="Deletar cliente"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                        <button
                                                            onClick={() => toggleExpand(user.id)}
                                                            className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-all duration-200 transform hover:scale-110"
                                                            title="Expandir detalhes"
                                                        >
                                                            <FaChevronDown className={`transform transition-transform duration-200 ${expandedUserId === user.id ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base text-gray-600">
                                                    <p><span className="font-semibold">Email:</span> {user.email || 'Não informado'}</p>
                                                    <p><span className="font-semibold">Telefone:</span> {user.phone || 'Não informado'}</p>
                                                    <p><span className="font-semibold">Cidade:</span> {user.city}</p>
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {expandedUserId === user.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="px-4 md:px-6 pb-4 md:pb-6"
                                                    >
                                                        <h3 className="font-semibold text-lg mb-4">Histórico de Pagamentos</h3>
                                                        {user.payments.length > 0 ? (
                                                            <ul className="space-y-4">
                                                                {user.payments.map((payment) => {
                                                                    const expiration = new Date(payment.expirationDate);
                                                                    const daysRemaining = Math.ceil((expiration - new Date()) / (1000 * 60 * 60 * 24));
                                                                    return (
                                                                        <li key={payment.id} className="bg-gray-50 p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center">
                                                                            <div className="mb-2 md:mb-0">
                                                                                <p className="font-semibold">Data de Pagamento: {new Date(payment.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                                                                <p>Data de Vencimento: {new Date(payment.expirationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                                                                <p>Método: {payment.paymentMethod}</p>
                                                                                <p className="font-semibold">Dias restantes: {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'}</p> {/* Adicionado aqui */}
                                                                            </div>
                                                                            <div className="flex space-x-2">
                                                                                <button
                                                                                    onClick={() => router.push(`/edit/payment/${payment.id}`)}
                                                                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                                                                                    title="Editar pagamento"
                                                                                >
                                                                                    <FaEdit size={14} />
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => deletePayment(payment.id, user.id)}
                                                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                                                                                    title="Deletar pagamento"
                                                                                >
                                                                                    <FaTrash size={14} />
                                                                                </button>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-500">Nenhum pagamento registrado.</p>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <ReactPaginate
                                    previousLabel={'Anterior'}
                                    nextLabel={'Próximo'}
                                    breakLabel={'...'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination flex flex-wrap justify-center mt-8 space-x-2'}
                                    pageClassName={'pagination-item'}
                                    pageLinkClassName={'w-full h-full flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'}
                                    previousClassName={'pagination-item'}
                                    previousLinkClassName={'w-full h-full flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-l-md'}
                                    nextClassName={'pagination-item'}
                                    nextLinkClassName={'w-full h-full flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-r-md'}
                                    breakClassName={'pagination-item'}
                                    breakLinkClassName={'w-full h-full flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'}
                                    activeClassName={'active'}
                                    activeLinkClassName={'bg-orange-500 border-orange-500 hover:bg-orange-600'}
                                />
                            </>
                        ) : (
                            <NoClientsMessage onAddClient={() => router.push('/register')} />
                        )}
                    </div>
                </main>
            </motion.div>

            <style jsx global>{`
                .pagination-item {
                    display: inline-block;
                    user-select: none;
                }

                .pagination-item a {
                    cursor: pointer;
                    border-radius: 0.375rem;
                    transition: all 0.2s ease-in-out;
                }

                .pagination-item.active a {
                    font-weight: 600;
                }

                .pagination-item:not(.break) a:hover {
                    z-index: 2;
                    color: #fff;
                    background-color: #f97316;
                    border-color: #f97316;
                }

                .pagination-item.disabled a {
                    color: #9ca3af;
                    pointer-events: none;
                    background-color: #fff;
                    border-color: #e5e7eb;
                }

                .pagination-item:first-child a {
                    border-top-left-radius: 0.375rem;
                    border-bottom-left-radius: 0.375rem;
                }

                .pagination-item:last-child a {
                    border-top-right-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                }

                .user-card-transition {
                    transition: all 0.3s ease-in-out;
                }
            `}</style>
        </AuthRoute>
    );
}
