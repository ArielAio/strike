import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push('/signIn');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return user ? children : null;
};

export default AuthRoute;
