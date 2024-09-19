import Image from 'next/image';
import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-orange-500 p-4 text-black shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <Link href="/" passHref>
                    <Image
                        src="/images/strike-logo.png"
                        alt="Logo"
                        width={200}
                        height={50}
                        className="object-contain cursor-pointer"
                    />
                </Link>
                <div className="hidden md:flex items-center space-x-4">
                    <LogoutButton className="bg-white text-orange-500 px-4 py-2 rounded-full font-semibold hover:bg-orange-100 transition-colors duration-300 flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Sair
                    </LogoutButton>
                </div>
                <button 
                    className="md:hidden text-white"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden mt-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LogoutButton className="w-full text-center py-2 bg-white text-orange-500 rounded-full font-semibold hover:bg-orange-100 transition-colors duration-300 flex items-center justify-center">
                            <FaSignOutAlt className="mr-2" />
                            Sair
                        </LogoutButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
