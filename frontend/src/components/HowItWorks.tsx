import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Create an Account',
    description: 'Sign up in seconds using your email.',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=600',
  },
  {
    number: '02',
    title: 'Add Your Tasks',
    description: 'Quickly jot down everything you need to do. Set priorities and deadlines instantly.',
    image: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&q=80&w=600',
  },
  {
    number: '03',
    title: 'Find Your Flow',
    description: 'Focus on one task at a time. Mark them complete and watch your progress soar.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
  },
];

const HowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.step-container').forEach((step: any, i) => {
        gsap.from(step, {
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
          },
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section id="how-it-works" ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">How it works</h2>
          <p className="text-xl text-gray-500">Three simple steps to regain control of your time and boost your daily productivity.</p>
        </div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <div key={step.number} className={`step-container flex flex-col md:flex-row items-center gap-12 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              
              <div className="flex-1 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
                <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100 opacity-50">
                  {step.number}
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
