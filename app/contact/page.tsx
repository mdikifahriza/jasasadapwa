"use client";

import React from "react";
import Link from "next/link";
import { Send, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const contacts = [
    {
      id: 1,
      title: "Telegram Official",
      description: "Hubungi kami melalui channel resmi Telegram",
      icon: Send,
      link: "https://t.me/evcorpofficial",
      linkText: "@evcorpofficial",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      title: "Telegram Support",
      description: "Dapatkan dukungan teknis melalui Telegram",
      icon: Send,
      link: "https://t.me/sadapwhatsapp",
      linkText: "@sadapwhatsapp",
      gradient: "from-cyan-500 to-teal-500",
    },
  ];

  return (
    <div className="relative">
      {/* Page Content */}
      <div className="px-6 md:px-10 py-20 md:py-32 space-y-16 container mx-auto max-w-7xl">
        {/* HERO SECTION */}
        <section className="text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-[var(--foreground)] tracking-tight">
              Hubungi Kami
            </h1>

            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
            </div>

            <p className="text-lg md:text-xl text-[var(--foreground)]/70 leading-relaxed max-w-3xl mx-auto">
              Kami siap membantu Anda. Pilih channel komunikasi yang paling
              nyaman untuk Anda.
            </p>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <Link
                  key={contact.id}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="h-full flex flex-col bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden p-8 space-y-6">

                    {/* Icon */}
                    <div className="flex justify-center">
                      <div
                        className={`relative w-20 h-20 bg-[var(--foreground)]/10 dark:bg-[var(--foreground)]/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                      >
                        <Icon
                          className="w-10 h-10 text-[var(--foreground)]/80 group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors"
                          strokeWidth={2}
                        />

                        {/* Gradient overlay */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${contact.gradient} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-3 flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors duration-300">
                        {contact.title}
                      </h3>

                      <p className="text-[var(--foreground)]/70 dark:text-[var(--foreground)]/60 text-sm leading-relaxed">
                        {contact.description}
                      </p>

                      {/* Link Display */}
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 
                        bg-[var(--foreground)]/10 dark:bg-[var(--foreground)]/20 
                        text-[var(--foreground)] rounded-full text-sm font-semibold 
                        transition-all duration-300 group-hover:scale-105"
                      >
                        <Phone className="w-4 h-4 text-[var(--foreground)]/80" />
                        <span>{contact.linkText}</span>
                      </div>
                    </div>

                    {/* Hover Effect Arrow */}
                    <div className="flex justify-center pt-2">
                      <div
                        className="flex items-center gap-2 text-[var(--foreground)]/80 dark:text-[var(--foreground)]/70 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <span>Buka Chat</span>
                        <div className="w-0 group-hover:w-4 transition-all duration-300">
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ADDITIONAL INFO SECTION */}
        <section className="max-w-3xl mx-auto text-center space-y-6">
          <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-xl p-8 md:p-12 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" strokeWidth={2} />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
              Waktu Operasional
            </h2>

            <div className="space-y-3 text-[var(--foreground)]/70">
              <p className="text-lg">
                Setiap Hari:{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  24 Jam
                </span>
              </p>
            </div>

            <div className="pt-4">
              <p className="text-sm text-[var(--foreground)]/60 italic">
                * Untuk pertanyaan mendesak di luar jam operasional, silakan
                kirim pesan dan kami akan merespons secepatnya pada hari kerja
                berikutnya.
              </p>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">
            Ada Pertanyaan Lain?
          </h2>
          <p className="text-lg text-[var(--foreground)]/70 max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami melalui salah satu channel di
            atas. Tim kami siap membantu Anda!
          </p>
        </section>
      </div>
    </div>
  );
}

