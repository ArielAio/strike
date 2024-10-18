import { useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DateInput = ({ paymentDate, setPaymentDate, setExpirationDate, expirationDate }) => {
    useEffect(() => {
        if (paymentDate) {
            const date = new Date(paymentDate);
            // Corrigindo a lógica para garantir que a data de vencimento seja 30 dias após a data de pagamento
            const expirationDate = new Date(date);
            expirationDate.setDate(expirationDate.getDate() + 30); // Alterado para 30 dias
            setExpirationDate(expirationDate.toISOString().split('T')[0]);
        }
    }, [paymentDate, setExpirationDate]);

    return (
        <>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Pagamento</label>
                <FaCalendarAlt className="absolute top-9 left-3 text-gray-400" />
                <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
            </div>
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                <FaCalendarAlt className="absolute top-9 left-3 text-gray-400" />
                <input
                    type="date"
                    value={expirationDate}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
            </div>
        </>
    );
};

export default DateInput;
