import { auth } from '../src/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Logout realizado com sucesso!');
      router.push('/signIn');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout.');
    }
  };

  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  );
}
