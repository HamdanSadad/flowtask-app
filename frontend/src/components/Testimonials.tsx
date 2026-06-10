import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    content: "FlowTask completely changed how I organize my day. The interface is so clean, it actually makes me want to complete my tasks.",
    author: "Sarah Jenkins",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    content: "The activity history feature is a lifesaver. I can finally show my clients exactly what I've been working on step-by-step.",
    author: "David Chen",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    content: "Fast, beautiful, and the login experience is so seamless. Highly recommended for any professional.",
    author: "Amanda Torres",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const Testimonials = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.testimonial-card', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Loved by professionals</h2>
          <p className="text-lg text-gray-600">Don't just take our word for it. See what our users have to say.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-card bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full border-2 border-blue-100" />
                <div>
                  <h4 className="font-bold text-gray-900">{t.author}</h4>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
