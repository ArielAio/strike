import React from 'react';
import { motion } from 'framer-motion';
import Modal from 'react-modal';

const EventDetailsModal = ({ modalIsOpen, setModalIsOpen, modalEvents = [] }) => {
    return (
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
                {modalEvents?.length > 0 ? (
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
                                            <strong className="text-gray-700">Data de Vencimento:</strong> {new Date(new Date(payment.expirationDate).setDate(new Date(payment.expirationDate).getDate() + 1)).toLocaleDateString('pt-BR')}
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
    );
};

export default EventDetailsModal;
