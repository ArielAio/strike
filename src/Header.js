import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function Header() {
    return (
        <header className="bg-orange-500 p-4 text-black shadow-md flex items-center justify-between" style={{ height: '80px' }}>
            <div className="flex-grow">
                <Link href="/" passHref>
                    <Image
                        src="/images/strike-logo.png"
                        alt="Logo"
                        width={200}
                        height={50}
                        className="object-contain cursor-pointer"
                    />
                </Link>
            </div>
            <div className="flex-none">
                <LogoutButton />
            </div>
        </header>
    );
}
