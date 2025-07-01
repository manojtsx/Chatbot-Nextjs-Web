import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from './Navbar';

const features = [
  {
    title: 'AI-Powered Conversations',
    description: 'Engage in smart, context-aware chats powered by advanced AI.',
    icon: '🤖',
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and privacy is our top priority.',
    icon: '🔒',
  },
  {
    title: 'Cross-Platform',
    description: 'Use ManojAI on web and mobile seamlessly.',
    icon: '🌐',
  },
  {
    title: '24/7 Availability',
    description: 'Get instant responses anytime, anywhere.',
    icon: '⏰',
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

export default function HomePage() {
  const router = useRouter();
  // Prompt box state
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [showPopout, setShowPopout] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const popoutRef = useRef<HTMLDivElement>(null);
  const [navOpen, setNavOpen] = useState(false);

  // Format response like in ChatPage
  const formatResponseText = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\')
      .replace(/^\s*[-*+]\s+/gm, '• ')
      .replace(/^\s*\d+\.\s+/gm, (match) => match.trim() + ' ')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  };

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setIsLoading(true);
    setShowPopout(true);
    setAnswer('');
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt.trim() }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      let responseText = '';
      if (typeof data === 'string') responseText = data;
      else if (data.reply) responseText = data.reply;
      else if (data.response) responseText = data.response;
      else if (data.message) responseText = data.message;
      else responseText = JSON.stringify(data);
      setAnswer(formatResponseText(responseText));
    } catch (err) {
      setError('Sorry, there was an error connecting to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Popout: close on outside click
  useEffect(() => {
    if (!showPopout) return;
    function handleClick(e: MouseEvent) {
      if (popoutRef.current && !popoutRef.current.contains(e.target as Node)) {
        setShowPopout(false);
        setPrompt('');
        setAnswer('');
        setError('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPopout]);

  return (
    <div className="relative min-h-screen flex flex-col bg-black overflow-x-hidden">
      {/* Overlay for popout */}
      {showPopout && (
        <div className="fixed inset-0 z-40 bg-black/30" />
      )}

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full h-full bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] animate-gradient-move"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[60vw] bg-gradient-radial from-purple-500/40 via-blue-400/20 to-transparent rounded-full blur-3xl"
        />
      </div>
      {/* Prompt Box at Top */}
      <div className="w-full flex justify-center items-center pt-10 pb-6 z-30 relative">
        <form
          onSubmit={handlePromptSubmit}
          className="w-full max-w-2xl flex bg-white/10 border border-white/20 rounded-full shadow-lg overflow-hidden backdrop-blur-md"
        >
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Ask ManojAI anything..."
            className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-300 outline-none text-lg"
            disabled={isLoading}
            maxLength={300}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Typing...' : 'Ask'}
          </button>
        </form>
      </div>
      {/* Popout Answer Box */}
      {showPopout && (
        <motion.div
          ref={popoutRef}
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="fixed top-28 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-xl px-4"
        >
          <div className="relative bg-gradient-to-br from-[#232526] to-[#414345] border border-white/20 rounded-3xl shadow-2xl p-8 text-white text-lg animate-popout z-10">
            <button
              onClick={() => { setShowPopout(false); setPrompt(''); setAnswer(''); setError(''); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl focus:outline-none"
              aria-label="Close"
            >
              ×
            </button>
            {isLoading ? (
              <div className="flex items-center gap-3">
                <span className="animate-pulse">Typing...</span>
                <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></span>
              </div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : (
              <div className="whitespace-pre-line break-words animate-fadeInUp text-xl font-medium">
                {answer}
              </div>
            )}
          </div>
          <style jsx>{`
            .animate-popout {
              animation: popout 0.6s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes popout {
              0% { opacity: 0; transform: scale(0.9) translateY(-30px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-28 md:py-40 px-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-purple-400 via-blue-400 to-white bg-clip-text text-transparent mb-6 drop-shadow-lg"
        >
          The Future of AI Chat<br />is Here: <span className="text-white">ManojAI</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10"
        >
          Smarter, faster, and more secure conversations. Experience the next generation of AI-powered chat, built for everyone.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push('/login')}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-full shadow-xl font-bold text-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
        >
          Get Started
        </motion.button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#232526] to-[#414345] rounded-3xl shadow-xl p-10 flex flex-col items-center text-center hover:scale-105 transition-transform duration-200 border border-white/10"
              >
                <span className="text-5xl mb-4 animate-bounce-slow">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Story Section */}
      <section className="py-20 px-4 bg-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">The Journey of ManojAI</h2>
          <ol className="relative border-l-4 border-blue-400/40">
            {/* Timeline items */}
            <motion.li initial={{opacity:0, x:-40}} whileInView={{opacity:1, x:0}} transition={{duration:0.6}} viewport={{once:true}} className="mb-14 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-purple-600 rounded-full -left-4 ring-4 ring-black text-white font-bold">1</span>
              <h3 className="font-semibold text-lg text-purple-300">Inception</h3>
              <p className="text-gray-200">The idea for ManojAI was born from a passion to make AI accessible and helpful for everyone, everywhere.</p>
              <span className="text-xs text-gray-400">2019</span>
            </motion.li>
            <motion.li initial={{opacity:0, x:-40}} whileInView={{opacity:1, x:0}} transition={{duration:0.6, delay:0.2}} viewport={{once:true}} className="mb-14 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full -left-4 ring-4 ring-black text-white font-bold">2</span>
              <h3 className="font-semibold text-lg text-blue-300">Development</h3>
              <p className="text-gray-200">A small team of innovators and dreamers started building the first prototype, focusing on natural language understanding and user experience.</p>
              <span className="text-xs text-gray-400">2020</span>
            </motion.li>
            <motion.li initial={{opacity:0, x:-40}} whileInView={{opacity:1, x:0}} transition={{duration:0.6, delay:0.4}} viewport={{once:true}} className="mb-14 ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-green-600 rounded-full -left-4 ring-4 ring-black text-white font-bold">3</span>
              <h3 className="font-semibold text-lg text-green-300">Launch</h3>
              <p className="text-gray-200">ManojAI was launched to the public, quickly gaining traction for its reliability, intelligence, and friendly interface.</p>
              <span className="text-xs text-gray-400">2022</span>
            </motion.li>
            <motion.li initial={{opacity:0, x:-40}} whileInView={{opacity:1, x:0}} transition={{duration:0.6, delay:0.6}} viewport={{once:true}} className="ml-6">
              <span className="absolute flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full -left-4 ring-4 ring-black text-white font-bold">4</span>
              <h3 className="font-semibold text-lg text-yellow-200">Today & Beyond</h3>
              <p className="text-gray-200">ManojAI continues to evolve, integrating the latest AI advancements to empower users worldwide.</p>
              <span className="text-xs text-gray-400">2024</span>
            </motion.li>
          </ol>
        </div>
      </section>

      {/* About the CEO Section */}
      <section className="py-20 px-4 bg-transparent">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-white/5 rounded-3xl p-10 border border-white/10 shadow-xl">
          <motion.div initial={{opacity:0, scale:0.8}} whileInView={{opacity:1, scale:1}} transition={{duration:0.7}} viewport={{once:true}} className="flex-shrink-0">
            <Image src="/ceo.jpeg" alt="CEO" width={120} height={120} className="rounded-full shadow-2xl border-4 border-purple-300" />
          </motion.div>
          <motion.div initial={{opacity:0, x:40}} whileInView={{opacity:1, x:0}} transition={{duration:0.7}} viewport={{once:true}}>
            <h2 className="text-2xl font-bold text-white mb-2">About the CEO - Manoj Kumar</h2>
            <p className="text-gray-200 mb-2">Manoj Kumar is the visionary founder and CEO of ManojAI. With a background in computer science and a passion for artificial intelligence, Manoj has dedicated his career to making technology more human-centric and accessible.</p>
            <p className="text-gray-200 mb-2">He has led teams at top tech companies, contributed to open-source AI projects, and is known for his innovative approach to solving real-world problems with technology.</p>
            <p className="text-gray-200 mb-2">Under his leadership, ManojAI has grown from a small startup to a leading AI platform trusted by thousands of users worldwide. Manoj believes in empowering people through technology and fostering a culture of innovation, integrity, and inclusivity.</p>
            <p className="text-gray-200 mb-2">He is a frequent speaker at international tech conferences, a mentor to aspiring entrepreneurs, and an advocate for ethical AI development. Manoj's vision is to bridge the gap between humans and machines, making AI a force for good in society.</p>
            <p className="text-gray-200">In his free time, Manoj enjoys mentoring young developers, exploring new AI trends, and hiking in nature. (You can update this bio as needed.)</p>
          </motion.div>
        </div>
      </section>

      {/* Company Details Section */}
      <section className="py-20 px-4 bg-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}} className="text-2xl md:text-3xl font-bold text-white mb-10">About ManojAI Company</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.7, delay:0.1}} viewport={{once:true}} className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl flex flex-col items-center">
              <span className="text-4xl mb-4">🎯</span>
              <h3 className="text-xl font-semibold text-white mb-2">Our Mission</h3>
              <p className="text-gray-200">To democratize access to artificial intelligence and make everyday interactions smarter, safer, and more enjoyable for everyone.</p>
            </motion.div>
            {/* Values Card */}
            <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.7, delay:0.2}} viewport={{once:true}} className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl flex flex-col items-center">
              <span className="text-4xl mb-4">💎</span>
              <h3 className="text-xl font-semibold text-white mb-2">Our Values</h3>
              <ul className="text-gray-200 text-left space-y-2">
                <li><span className="font-bold text-purple-200">Innovation:</span> We push the boundaries of what AI can do.</li>
                <li><span className="font-bold text-purple-200">Integrity:</span> We are committed to ethical AI and user privacy.</li>
                <li><span className="font-bold text-purple-200">Inclusivity:</span> AI should be accessible to everyone.</li>
                <li><span className="font-bold text-purple-200">Excellence:</span> We deliver high-quality, reliable solutions.</li>
              </ul>
            </motion.div>
            {/* Contact Card */}
            <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.7, delay:0.3}} viewport={{once:true}} className="bg-white/5 rounded-2xl p-8 border border-white/10 shadow-xl flex flex-col items-center">
              <span className="text-4xl mb-4">📬</span>
              <h3 className="text-xl font-semibold text-white mb-2">Contact Us</h3>
              <p className="text-gray-200 mb-2">Email: <a href="mailto:info@manojai.com" className="text-purple-200 underline">info@manojai.com</a></p>
              <p className="text-gray-200">Address: 123 AI Avenue, Innovation City, Country</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-20 px-4 bg-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.7}} viewport={{once:true}} className="text-3xl md:text-4xl font-bold text-white mb-6">Get Started with ManojAI</motion.h2>
          <motion.p initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} transition={{duration:0.7, delay:0.2}} viewport={{once:true}} className="text-gray-200 mb-8 text-lg md:text-xl">
            Download the ManojAI app and experience the power of AI chat on your device. Fast, secure, and always available.
          </motion.p>
          <motion.a
            initial={{opacity:0, scale:0.9}}
            whileInView={{opacity:1, scale:1}}
            transition={{duration:0.7, delay:0.4}}
            viewport={{once:true}}
            href="/download/ManojAI-App.apk" // Update this link to your actual app download URL
            download
            className="inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-full shadow-xl font-bold text-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
          >
            Download App
          </motion.a>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-black/80 border-t border-white/10 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <Image src="/logo.png" alt="ManojAI Logo" width={40} height={40} className="rounded-full shadow-lg" />
            <span className="text-xl font-bold text-white tracking-tight">ManojAI</span>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row gap-6 text-gray-300 text-sm items-center">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:info@manojai.com" className="hover:text-white transition-colors">Contact</a>
          </div>
          {/* Social Icons */}
          <div className="flex gap-5 items-center mt-6 md:mt-0">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors text-2xl"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 5.924c-.793.352-1.646.59-2.542.698a4.48 4.48 0 0 0 1.965-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.01-4.49 4.49 0 .352.04.695.116 1.022C7.728 9.37 4.1 7.6 1.67 4.905c-.386.664-.607 1.437-.607 2.26 0 1.56.794 2.936 2.003 3.744a4.48 4.48 0 0 1-2.034-.563v.057c0 2.18 1.55 4.002 3.604 4.418-.377.102-.775.157-1.185.157-.29 0-.57-.028-.844-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.86 2.01c8.23 0 12.74-6.82 12.74-12.74 0-.19-.004-.38-.013-.57.87-.63 1.62-1.42 2.22-2.32z"/></svg></a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors text-2xl"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm15.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg></a>
            <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors text-2xl"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg></a>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} ManojAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
