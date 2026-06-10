import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, CheckSquare, Settings2, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: 'Smart Tasks & Deadlines',
    description: 'Never miss a beat with intelligent deadlines and priority management.',
    icon: <CheckSquare size={24} />,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Activity History',
    description: 'Complete log of every action taken. Trace back your steps easily.',
    icon: <Clock size={24} />,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Admin Control',
    description: 'Dynamic dashboard and landing page layouts controllable via admin panel.',
    icon: <Settings2 size={24} />,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Multi-Device Ready',
    description: 'Beautifully responsive on mobile, tablet, and desktop screens.',
    icon: <Smartphone size={24} />,
    color: 'bg-pink-100 text-pink-600',
  },
];

const Features = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.feature-header', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
    });

    gsap.fromTo('.feature-card', 
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.5)',
      }
    );
  }, { scope: containerRef });

  return (
    <section id="features" ref={containerRef} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="feature-header text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to stay in the flow</h2>
          <p className="text-lg text-gray-600">Powerful features designed to get out of your way and let you focus on work.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
