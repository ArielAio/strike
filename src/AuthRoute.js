import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Oval } from 'react-loader-spinner';

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
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Oval
                    height={80}
                    width={80}
                    color="#FFD700"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel='oval-loading'
                    secondaryColor="#FFA500"
                    strokeWidth={5}
                    strokeWidthSecondary={5}
                />
            </div>
        );
    }

    return user ? children : null;
};

export default AuthRoute;
