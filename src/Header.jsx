import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function Header() {
    return (
        <header className="bg-orange-600 p-4 text-white shadow-md relative flex items-center" style={{ height: '80px' }}>
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Link href="/" passHref>
                    <Image
                        src="/images/strike-logo.png"
                        alt="Logo"
                        width={250}
                        height={60}
                        className="object-contain cursor-pointer"
                    />
                </Link>
            </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <LogoutButton />
            </div>
        </header>
    );
}
