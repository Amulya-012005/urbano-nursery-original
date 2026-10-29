import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Ananya Deshpande',
      role: 'Urban Apartment Dweller',
      city: 'Indiranagar, Bengaluru',
      rating: 5,
      comment:
        'My north-facing balcony used to be completely lifeless. The Balcony Garden Setup service by Priya transformed it into a thriving oasis of ferns, monstera, and scented mogra. Outstanding professionalism!',
      date: 'Verified Order'
    },
    {
      name: 'Rohan Mehra',
      role: 'Homeowner & Plant Enthusiast',
      city: 'Bandra West, Mumbai',
      rating: 5,
      comment:
        'The Fiddle Leaf Fig arrived securely braced with zero leaf damage or root shock. The terracotta planter set matches the aesthetic flawlessly. Urbano Nursery is now my go-to botanical marketplace.',
      date: 'Verified Order'
    },
    {
      name: 'Dr. Suniti Verma',
      role: 'Senior Botanist & Collector',
      city: 'Vasant Vihar, New Delhi',
      rating: 5,
      comment:
        'As someone meticulous about plant pathology, I was impressed by the Plant Doctor visit. Ramesh identified a latent spider mite infestation early and treated it with organic bio-fungicide safely.',
      date: 'Verified Service'
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Community Stories
          </div>
          <h2 className="text-3xl font-bold text-emerald-950 font-serif-botanical">
            Loved by Plant Parents Across India
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            (Demonstration reviews from verified customer orders & appointments)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-stone-700 leading-relaxed italic mb-6">
                  "{item.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{item.name}</h4>
                  <p className="text-[11px] text-stone-500">{item.role} · {item.city}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>{item.date}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
