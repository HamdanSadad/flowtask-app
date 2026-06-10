import { Link } from 'react-router-dom';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hero-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
      .from('.hero-image', { scale: 0.9, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
      .from('.floating-card', { 
        y: 50, 
        opacity: 0, 
        duration: 0.8, 
        stagger: 0.2, 
        ease: 'back.out(1.7)' 
      }, '-=0.5');

    // Floating animation
    gsap.to('.floating-card', {
      y: '-=15',
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      stagger: 0.2
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-8 border border-blue-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          FlowTask is now in Beta
        </div>
        
        <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Manage tasks & time with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">perfect flow.</span>
        </h1>
        
        <p className="hero-subtitle text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The ultimate activity tracker and to-do list that helps you focus on what matters most. Built for modern teams and individuals.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link to="/register" className="hero-cta w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 hover:-translate-y-1">
            Start for free <ArrowRight size={20} />
          </Link>
          <a href="#demo" className="hero-cta w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 border border-gray-200 transition-all flex items-center justify-center gap-2">
            View Demo
          </a>
        </div>

        {/* Hero Visual */}
        <div className="hero-image relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl p-2 relative z-10">
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 aspect-video flex items-center justify-center relative">
              {/* Fake Dashboard UI */}
              <div className="absolute inset-0 p-8 flex flex-col gap-4 opacity-50 pointer-events-none">
                <div className="h-10 w-1/3 bg-gray-200 rounded-lg"></div>
                <div className="flex gap-4">
                  <div className="w-2/3 flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 w-full bg-white border border-gray-200 rounded-xl shadow-sm"></div>
                    ))}
                  </div>
                  <div className="w-1/3 bg-white border border-gray-200 rounded-xl shadow-sm h-64"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="floating-card absolute -left-4 top-4 md:-left-8 md:top-1/4 bg-white p-2 md:p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-2 md:gap-4 z-20 scale-[0.85] md:scale-100 origin-top-left">
            <div className="bg-green-100 p-1.5 md:p-2 rounded-full text-green-600">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs md:text-sm font-bold text-gray-900 whitespace-nowrap">Task Completed</p>
              <p className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap">Design system updated</p>
            </div>
          </div>

          <div className="floating-card absolute -right-4 bottom-4 md:-right-6 md:top-1/2 md:bottom-auto bg-white p-3 md:p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-1.5 md:gap-2 z-20 w-36 md:w-48 scale-[0.85] md:scale-100 origin-bottom-right md:origin-center">
             <p className="text-xs md:text-sm font-bold text-gray-900 text-left whitespace-nowrap">Weekly Progress</p>
             <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
               <div className="bg-blue-600 h-1.5 md:h-2 rounded-full w-[70%]"></div>
             </div>
             <p className="text-[10px] md:text-xs text-gray-500 text-right">70% Done</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
