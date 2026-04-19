/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Globe, 
  Gamepad2, 
  Palette, 
  ShoppingCart, 
  MessageCircle, 
  ChevronRight,
  Play,
  CheckCircle2
} from 'lucide-react';

interface Scene {
  id: number;
  type: 'intro' | 'mission' | 'services' | 'values' | 'cta';
  content: any;
  duration: number;
}

const SCENES: Scene[] = [
  {
    id: 1,
    type: 'intro',
    content: {
      title: 'DevMentor',
      subtitle: 'Apps & Design',
      welcome: 'Bem-vindo à DevMentor',
      tagline: 'Soluções Digitais de Elite'
    },
    duration: 5000
  },
  {
    id: 2,
    type: 'mission',
    content: {
      text: 'Transformamos ideias em soluções digitais reais'
    },
    duration: 5000
  },
  {
    id: 3,
    type: 'services',
    content: {
      title: 'Nossos Serviços',
      list: [
        { id: '01', name: 'Desenvolvimento de Aplicativos', icon: Smartphone, color: '#60a5fa' },
        { id: '02', name: 'Desenvolvimento Web', icon: Globe, color: '#60a5fa' },
        { id: '03', name: 'Criação de Jogos', icon: Gamepad2, color: '#60a5fa' },
        { id: '04', name: 'Design Gráfico', icon: Palette, color: '#60a5fa' },
        { id: '05', name: 'Lojas Online Profissionais', icon: ShoppingCart, color: '#60a5fa' }
      ]
    },
    duration: 8000
  },
  {
    id: 4,
    type: 'values',
    content: {
      values: ['Qualidade', 'Inovação', 'Confiança']
    },
    duration: 5000
  },
  {
    id: 5,
    type: 'cta',
    content: {
      text: 'Fale connosco no WhatsApp',
    },
    duration: 6000
  }
];

export default function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(-1); // -1 is entry screen
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentSceneIndex >= 0 && currentSceneIndex < SCENES.length) {
      const currentScene = SCENES[currentSceneIndex];
      timer = setTimeout(() => {
        if (currentSceneIndex < SCENES.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, currentScene.duration);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentSceneIndex]);

  // Audio Control Logic (Fade In/Out)
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      if (currentSceneIndex === 0) {
        // Start playing and fade in
        audioRef.current.volume = 0;
        audioRef.current.play().catch(e => console.log('Audio playback blocked:', e));
        
        let fadeIn = setInterval(() => {
          if (audioRef.current && audioRef.current.volume < 0.9) {
            audioRef.current.volume += 0.05;
          } else {
            clearInterval(fadeIn);
          }
        }, 100);
        return () => clearInterval(fadeIn);
      }

      // Check for fade out on the last scene
      if (currentSceneIndex === SCENES.length - 1) {
        const fadeOutDelay = SCENES[currentSceneIndex].duration - 2000;
        const fadeOutTimer = setTimeout(() => {
          let fadeOutInterval = setInterval(() => {
            if (audioRef.current && audioRef.current.volume > 0.05) {
              audioRef.current.volume -= 0.05;
            } else {
              if (audioRef.current) {
                audioRef.current.volume = 0;
                audioRef.current.pause();
              }
              clearInterval(fadeOutInterval);
            }
          }, 100);
        }, fadeOutDelay > 0 ? fadeOutDelay : 0);
        
        return () => clearTimeout(fadeOutTimer);
      }
    } else {
      // If stopped manually or naturally
      if (currentSceneIndex === -1 && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying, currentSceneIndex]);

  const startVideo = () => {
    setIsPlaying(true);
    setCurrentSceneIndex(0);
  };

  const restartVideo = () => {
    setCurrentSceneIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="relative h-screen w-full bg-[#080809] text-white overflow-hidden font-sans selection:bg-white/20">
      {/* Theme Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,8,9,0.5)_100%)]" />
      </div>

      {/* Persistent Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 w-full p-8 md:p-12 flex justify-between items-center z-50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-black rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-black"></div>
            </div>
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-tighter uppercase whitespace-nowrap">
            DevMentor <span className="font-thin opacity-50 hidden md:inline">| Apps & Design</span>
          </span>
        </div>
        <div className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-zinc-500 font-semibold">
          Portfólio 2026
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {currentSceneIndex === -1 ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 leading-none">
                DevMentor
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-tight max-w-xl mx-auto">
                Transformamos ideias em <span className="text-white italic">soluções digitais reais</span>
              </p>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#f4f4f5' }}
              whileTap={{ scale: 0.98 }}
              onClick={startVideo}
              className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black font-bold uppercase tracking-wider rounded-full overflow-hidden transition-all shadow-2xl shadow-white/5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Explorar Serviços</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key={SCENES[currentSceneIndex]?.id || 'finished'}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="relative z-10 h-full w-full flex flex-col items-center justify-center p-8 pt-32 pb-32"
          >
            {renderSceneContent(SCENES[currentSceneIndex])}
            
            {/* Scene Indicators - Minimalist Theme */}
            <div className="absolute bottom-12 left-12 flex gap-3">
              {SCENES.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-0.5 transition-all duration-700 ${
                    idx === currentSceneIndex ? 'w-12 bg-white' : 'w-4 bg-zinc-800'
                  }`}
                />
              ))}
            </div>

            {/* Repeat Button */}
            {!isPlaying && currentSceneIndex === SCENES.length - 1 && (
               <motion.button
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               onClick={restartVideo}
               className="absolute bottom-12 right-12 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors group"
             >
               Repetir Apresentação <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimalist Footer */}
      <footer className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-50 pointer-events-none">
         <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent mb-6 opacity-30"></div>
         <div className="flex justify-between items-end opacity-40">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-1">Visão</span>
              <span className="text-[11px] font-medium tracking-wide">Excelência Tech & Design</span>
            </div>
            <div className="hidden md:block text-[9px] uppercase tracking-widest text-zinc-600">
              © 2026 DevMentor Creative Studio
            </div>
         </div>
      </footer>

      {/* Background Audio */}
      <audio 
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
        loop={false}
        preload="auto"
      />
    </div>
  );
}

function renderSceneContent(scene: Scene) {
  if (!scene) return null;

  switch (scene.type) {
    case 'intro':
      return (
        <div className="text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-zinc-500 text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6"
          >
            {scene.content.welcome}
          </motion.p>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[12vw] md:text-[140px] leading-[0.85] font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600 mb-8"
          >
            {scene.content.title}
          </motion.h2>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.5 }}
             className="text-lg md:text-2xl font-light text-zinc-400 max-w-2xl mx-auto"
          >
            {scene.content.subtitle} — <span className="text-white italic">{scene.content.tagline}</span>
          </motion.p>
        </div>
      );
    case 'mission':
      return (
        <div className="max-w-5xl text-center px-4">
          <motion.h2 
            className="text-5xl md:text-[100px] font-bold tracking-tighter leading-[0.9] bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-zinc-700"
          >
            {scene.content.text.split(' ').map((word: string, i: number) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 + 0.4, duration: 0.8 }}
                className="inline-block mr-[0.2em] last:mr-0 last:text-white"
              >
                {word}
              </motion.span>
            ))}
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="h-px w-32 bg-zinc-800 mx-auto mt-12 origin-left"
          />
        </div>
      );
    case 'services':
      return (
        <div className="w-full max-w-7xl">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-6"
          >
            <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500">
              {scene.content.title}
            </h3>
            <span className="text-[10px] text-zinc-600 tracking-widest uppercase">Expertise Digital</span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {scene.content.list.map((service: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 + 0.4 }}
                className="group bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-2xl flex flex-col justify-between h-64 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all duration-500"
              >
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-blue-500 mb-6 uppercase">
                    {service.id}
                  </div>
                  <service.icon className="w-8 h-8 mb-6 text-zinc-400 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-medium tracking-tight leading-snug group-hover:translate-x-1 transition-transform">{service.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      );
    case 'values':
      return (
        <div className="flex flex-col md:flex-row gap-12 md:gap-32 items-center justify-center">
          {scene.content.values.map((val: string, i: number) => (
            <motion.div
              key={i}
              className="text-center"
            >
              <div className="overflow-hidden">
                <motion.p
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: i * 0.3 + 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-4xl md:text-7xl font-bold tracking-tighter"
                >
                  {val}<span className="text-zinc-500">.</span>
                </motion.p>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                transition={{ delay: i * 0.3 + 0.8, duration: 1 }}
                className="h-1 bg-gradient-to-r from-blue-600 to-transparent mx-auto mt-4"
              />
            </motion.div>
          ))}
        </div>
      );
    case 'cta':
      return (
        <div className="text-center max-w-4xl flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] md:text-xs font-bold tracking-[0.5em] text-zinc-500 uppercase mb-8"
          >
            Solicite um Orçamento
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-4xl md:text-[80px] leading-[0.9] font-bold mb-16 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600"
          >
            {scene.content.text}
          </motion.h2>

          <motion.a
            href="https://wa.me/244936877503"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="group bg-white text-black px-12 py-6 rounded-full flex items-center space-x-4 cursor-pointer hover:bg-zinc-200 transition-all shadow-2xl shadow-green-500/10 no-underline"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.453-8.413z"/></svg>
            <span className="font-bold text-lg tracking-normal uppercase">Whatsapp</span>
          </motion.a>
        </div>
      );
    default:
      return null;
  }
}
