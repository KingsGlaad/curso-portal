"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center shadow-md fixed top-0 z-50 bg-transparent backdrop-blur-md border-b border-gray-200 dark:border-gray-700/30">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        Portal Cursos
      </h1>
      <nav className="flex items-center gap-4">
        <a
          href="#sobre"
          className="text-black dark:text-gray-200 hover:text-gray-500 dark:hover:text-white"
        >
          Sobre
        </a>
        <a
          href="#cursos"
          className="text-black dark:text-gray-200 hover:text-gray-500 dark:hover:text-white"
        >
          Cursos
        </a>
        <a
          href="#depoimentos"
          className="text-black dark:text-gray-200 hover:text-gray-500 dark:hover:text-white"
        >
          Depoimentos
        </a>
        <a
          href="#contato"
          className="text-black dark:text-gray-200 hover:text-gray-500 dark:hover:text-white"
        >
          Contato
        </a>
        <Link
          href="/login"
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc]  text-sm sm:text-base sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Entrar
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}
      </nav>
    </header>
  );
}
