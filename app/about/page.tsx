import React from "react";
import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanityClient";
import { urlFor } from "@/lib/imageUrl";
import { MessageCircle } from "lucide-react";

// ====== TIPE DATA BERDASARKAN SKEMA SANITY ======
type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: string };
};

type ServiceItem = {
  title: string;
  detail?: string;
};

type AboutData = {
  photo?: SanityImage;
  slogan: string;
  description: string;
  services: ServiceItem[];
};

// ====== FETCH DATA DARI SANITY ======
async function getAboutData(): Promise<AboutData> {
  const query = `
    *[_type == "about"][0]{
      photo,
      slogan,
      description,
      services[]{ title, detail }
    }
  `;
  return await sanityClient.fetch<AboutData>(query);
}

// ====== HALAMAN ABOUT ======
export default async function AboutPage() {
  const data = await getAboutData();

  const photoUrl = data.photo
    ? urlFor(data.photo).width(1200).height(1200).url()
    : "/images/profile-placeholder.png";

  return (
    <div className="relative">
      {/* Page Content */}
      <div className="px-6 md:px-10 py-20 md:py-32 space-y-32 container mx-auto max-w-7xl">
        
        {/* HERO SECTION - Foto Bulat di Tengah */}
        <section className="text-center space-y-12">
          {/* Foto Profil Bulat */}
          <div className="flex justify-center">
            <div className="relative group">
              {/* Animated Glow Ring */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
              
              {/* Secondary Ring */}
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 animate-spin-slow" 
                style={{ animationDuration: '10s' }}
              />
              
              {/* Main Photo Circle */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white dark:border-neutral-900 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <Image
                  src={photoUrl}
                  alt="Foto Tentang Kami"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-full shadow-xl font-semibold text-sm md:text-base animate-bounce-slow">
                ✨ Active
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-full text-sm font-semibold mb-4">
              Tentang Kami
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-[var(--foreground)] tracking-tight">
              {data.slogan}
            </h1>

            <div className="flex justify-center">
              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full" />
            </div>

            <p className="text-lg md:text-xl text-[var(--foreground)]/70 leading-relaxed max-w-3xl mx-auto">
              {data.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="https://t.me/evcorpofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hubungi Kami</span>
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="https://t.me/sadapwhatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-10 py-4 bg-white dark:bg-neutral-900 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Kirim Pesan</span>
            </Link>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="flex justify-center">
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-neutral-700 to-transparent" />
        </div>

        {/* SERVICES SECTION */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              Layanan
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)]">
              Layanan Kami
            </h2>
            
            <p className="text-lg md:text-xl text-[var(--foreground)]/60 max-w-2xl mx-auto">
              Solusi profesional yang disesuaikan dengan kebutuhan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.services.map((service, i) => (
              <div
                key={i}
                className="group relative p-8 bg-white/30 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/50 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-purple-400/10 dark:from-cyan-400/5 dark:via-blue-400/5 dark:to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
                
                {/* Number Badge */}
                <div className="relative mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-200 to-blue-200 dark:from-cyan-800 dark:to-blue-800 text-cyan-700 dark:text-cyan-300 font-bold text-xl rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Content */}
                <div className="relative space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-[var(--foreground)]/70 text-sm md:text-base leading-relaxed">
                    {service.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
