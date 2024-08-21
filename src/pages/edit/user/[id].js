import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../../src/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AuthRoute from '../../../../src/AuthRoute';
import Header from '@/Header';

export default function EditUser() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const userDoc = doc(db, 'users', id);
                    const userSnapshot = await getDoc(userDoc);
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        setName(userData.name);
                        setEmail(userData.email);
                        setPhone(userData.phone);
                    }
                } catch (error) {
                    console.error('Erro ao buscar usuário:', error);
                }
            };

            fetchUser();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userDocRef = doc(db, 'users', id);
            await updateDoc(userDocRef, {
                name,
                email,
                phone,
            });
            alert('Usuário atualizado com sucesso!');
            router.push('/list'); 
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            alert('Erro ao atualizar o usuário.');
        }
    };

    const handleBackClick = () => {
        router.push('/');
    };

    return (
        <AuthRoute>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-black">Editar Usuário</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <input
                                type="tel"
                                placeholder="Telefone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            >
                                Atualizar Usuário
                            </button>
                        </form>
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
