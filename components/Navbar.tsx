'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import {
  Moon,
  Sun,
  Home,
  User,
  Phone,
  BookOpen,
  Menu,
  X,
  Send,
  Eye,
  MessageCircle, // Mengganti Hand/Zap/Shield dengan MessageCircle untuk WhatsApp
} from 'lucide-react';
import { useEffect, useState } from 'react';

// NAVBAR DATA
const navItems = [
  { label: 'Home', href: '/', icon: <Home size={18} /> },
  { label: 'About', href: '/about', icon: <User size={18} /> },
  { label: 'Contact', href: '/contact', icon: <Phone size={18} /> },
  { label: 'Blog', href: '/blog', icon: <BookOpen size={18} /> },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const cleanPath =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  // Tombol Aksi Kustom (Desktop dan Mobile)
  const ActionButtons = ({ isMobile = false }) => (
    <>
      {/* Tombol WhatsApp (BARU) */}
      <a
        href="https://wa.me/6283846249279"
        target="_blank"
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold
          bg-green-500 hover:bg-green-600 text-white transition-colors
          ${isMobile ? 'w-full' : ''}
        `}
      >
        <MessageCircle size={isMobile ? 18 : 16} />
        <span className={isMobile ? 'flex-1' : 'hidden lg:inline'}>WhatsApp</span>
      </a>

      {/* Tombol Hubungi (Telegram) */}
      <a
        href="https://t.me/evcorpofficial"
        target="_blank"
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold
          bg-blue-500 hover:bg-blue-600 text-white transition-colors
          ${isMobile ? 'w-full' : ''}
        `}
      >
        <Send size={isMobile ? 18 : 16} />
        <span className={isMobile ? 'flex-1' : 'hidden lg:inline'}>Hubungi (Telegram)</span>
      </a>

      {/* Tombol Pesan (Telegram Channel) */}
      <a
        href="https://t.me/sadapwhatsapp"
        target="_blank"
        className={`
          flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold
          bg-purple-500 hover:bg-purple-600 text-white transition-colors
          ${isMobile ? 'w-full' : ''}
        `}
      >
        <Eye size={isMobile ? 18 : 16} />
        <span className={isMobile ? 'flex-1' : 'hidden lg:inline'}>Channel</span>
      </a>
    </>
  );

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className="
        hidden md:flex
        fixed top-0 left-0 right-0 z-50
        items-center justify-between
        px-6 lg:px-12 py-4
        bg-white/80 backdrop-blur-md
        border-b border-white/20 dark:border-white/10
        dark:bg-zinc-900/80
        shadow-lg
      "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700 group-hover:ring-cyan-500 transition-all">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            Jasa Sadap WA
          </span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = cleanPath === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                      : 'text-zinc-700 hover:bg-white/50 dark:text-zinc-300 dark:hover:bg-zinc-800/80'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ActionButtons />

          {/* Theme Toggle */}
          <button
            aria-label="Toggle Theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100/50 dark:text-zinc-300 dark:hover:bg-zinc-800/80 transition-colors"
          >
            {mounted ? (
              theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              <div className="w-[20px] h-[20px]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav
        className="
        md:hidden
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-between
        px-4 py-3
        bg-white/80 backdrop-blur-md
        border-b border-white/20 dark:border-white/10
        dark:bg-zinc-900/80
        shadow-sm
      "
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-700">
            <Image
              src="/images/logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            Jasa Sadap WA
          </span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
        md:hidden
        fixed top-0 right-0 bottom-0 z-50
        w-72 bg-white dark:bg-zinc-900
        border-l border-zinc-200 dark:border-zinc-800
        shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Nav */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = cleanPath === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                        : 'text-zinc-700 hover:bg-zinc-100/80 dark:text-zinc-300 dark:hover:bg-zinc-800/80'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Aksi/Kontak Links */}
            <div className="mt-6 space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <p className="px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Aksi Cepat
              </p>
              <ActionButtons isMobile={true} />
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {mounted ? (
                <>
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </>
              ) : (
                <>
                  <div className="w-[18px] h-[18px]" />
                  <span>Theme</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer to prevent content from being hidden by fixed navbar */}
      <div className="h-14 md:h-16" />
    </>
  );
}