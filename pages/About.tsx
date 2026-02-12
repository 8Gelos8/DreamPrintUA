import React from 'react';
import { Heart, Users, Sparkles } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       {/* Intro */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
              <h1 className="text-4xl font-display font-bold text-stone-800 mb-6">Про Dream Print UA</h1>
              <p className="text-lg text-stone-600 mb-4 leading-relaxed">
                  Ми — маленька команда з великим серцем. Наша історія почалася з бажання дарувати людям не просто речі, а емоції. 
              </p>
              <p className="text-lg text-stone-600 leading-relaxed">
                  Сьогодні Dream Print UA — це місце, де технології сублімаційного друку зустрічаються з теплом ручної роботи. Ми віримо, що навіть звичайна ранкова кава смакує краще з улюбленої чашки.
              </p>
          </div>
          <div className="relative">
              <div className="aspect-square rounded-full bg-gradient-to-tr from-pink-200 to-purple-200 absolute -top-4 -right-4 w-32 h-32 blur-2xl opacity-50"></div>
              <img 
                src="https://picsum.photos/id/447/800/600" 
                alt="Our workshop" 
                className="relative rounded-2xl shadow-xl w-full object-cover transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
          </div>
       </div>

       {/* Values */}
       <div className="bg-stone-900 rounded-3xl p-8 md:p-12 text-white">
           <h2 className="text-3xl font-display font-bold text-center mb-12">Наші Цінності</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="text-center">
                   <div className="w-16 h-16 bg-pink-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-pink-500/30">
                       <Heart size={32} className="text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">Любов до справи</h3>
                   <p className="text-stone-400">Ми не відправляємо замовлення, поки самі не закохаємось у результат.</p>
               </div>
               <div className="text-center">
                   <div className="w-16 h-16 bg-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                       <Sparkles size={32} className="text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">Креативність</h3>
                   <p className="text-stone-400">Неможливе — це просто те, що ми ще не пробували робити. Але спробуємо!</p>
               </div>
               <div className="text-center">
                   <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                       <Users size={32} className="text-white" />
                   </div>
                   <h3 className="text-xl font-bold mb-3">Чесність</h3>
                   <p className="text-stone-400">Прозорі ціни, реальні терміни та відповідальність за якість кожного стібка.</p>
               </div>
           </div>
       </div>
    </div>
  );
};

export default About;