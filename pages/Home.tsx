import React from 'react';
import { ArrowRight, Star, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import DesktopGallery from '../components/DesktopGallery';
import FileUpload from '../components/FileUpload';

const Home: React.FC = () => {
  return (
    <div className="space-y-20 pb-16 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-8 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-dream-purple/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-dream-yellow/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-dream-pink/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="text-center mb-12 relative z-10 flex flex-col items-center">
           <span className="inline-block py-2 px-4 rounded-full bg-white border-2 border-dream-cyan/30 text-dream-blue text-sm font-black tracking-wide mb-6 shadow-sm">
              ✨ ТВОРЧА МАЙСТЕРНЯ
           </span>
           
           {/* Main Logo Placement */}
           <div className="w-64 md:w-80 mb-6 transition-transform hover:scale-105 duration-500">
              <img 
                src="./logo.png" 
                alt="Dream Print UA Logo" 
                className="w-full h-auto drop-shadow-xl"
                onError={(e) => e.currentTarget.style.display = 'none'}
              />
           </div>

           <h1 className="text-5xl md:text-7xl font-display font-black text-stone-800 leading-tight mb-8 drop-shadow-sm">
             Зроби Свій Світ <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-dream-pink via-dream-purple to-dream-cyan">
               Яскравим
             </span>
           </h1>
           <p className="max-w-2xl mx-auto text-xl text-stone-600 font-medium">
             Сублімаційний друк, кастомні подарунки та декор. <br/>
             Втілюємо найсміливіші ідеї в реальність!
           </p>
           
           <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/products" className="px-8 py-4 bg-gradient-to-r from-dream-pink to-dream-purple text-white rounded-full font-bold hover:shadow-lg hover:shadow-dream-pink/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg">
               Каталог Товарів <ArrowRight size={20} />
             </Link>
             <Link to="/prices" className="px-8 py-4 bg-white text-stone-800 border-2 border-stone-200 rounded-full font-bold hover:border-dream-cyan hover:text-dream-cyan hover:bg-cyan-50 transition-all text-lg">
               Прайс-лист
             </Link>
           </div>
        </div>

        {/* The Desktop Gallery */}
        <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-r from-dream-cyan via-dream-purple to-dream-pink opacity-20 blur-xl rounded-[2.5rem]"></div>
             <DesktopGallery />
        </div>
      </section>

      {/* Services Highlights */}
      <section className="bg-white py-20 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-stone-800">Чому обирають нас?</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-dream-yellow/10 to-transparent border border-dream-yellow/30 hover:shadow-xl hover:shadow-dream-yellow/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-dream-yellow text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-dream-yellow/40 rotate-3">
                    <Heart size={32} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3 text-stone-800">З Любов'ю</h3>
                  <p className="text-stone-600 leading-relaxed">Вкладаємо частинку душі в кожну чашку, футболку чи свічку. Ваші емоції — наш пріоритет.</p>
              </div>
              {/* Card 2 */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-dream-cyan/10 to-transparent border border-dream-cyan/30 hover:shadow-xl hover:shadow-dream-cyan/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-dream-cyan text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-dream-cyan/40 -rotate-2">
                    <Star size={32} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3 text-stone-800">Топ Якість</h3>
                  <p className="text-stone-600 leading-relaxed">Використовуємо яскраві фарби, стійкі матеріали та сучасне обладнання для найкращого результату.</p>
              </div>
              {/* Card 3 */}
              <div className="p-8 rounded-3xl bg-gradient-to-b from-dream-purple/10 to-transparent border border-dream-purple/30 hover:shadow-xl hover:shadow-dream-purple/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-dream-purple text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-dream-purple/40 rotate-1">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3 text-stone-800">Креатив</h3>
                  <p className="text-stone-600 leading-relaxed">Допоможемо розробити унікальний дизайн, навіть якщо у вас є лише ідея "на словах".</p>
              </div>
           </div>
        </div>
      </section>

      {/* Upload Call To Action */}
      <section className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="bg-stone-900 rounded-[3rem] p-8 md:p-16 overflow-hidden relative shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-dream-pink rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-dream-cyan rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
               <div className="text-white">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Маєте ідею?</h2>
                  <p className="text-stone-300 text-lg mb-8 leading-relaxed">
                    Завантажте фото або ескіз прямо зараз! Ми створимо макет, порахуємо вартість та зробимо магію.
                  </p>
                  <ul className="space-y-4">
                     <li className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-dream-green flex items-center justify-center text-stone-900 font-bold">✓</div>
                        <span className="font-medium">Швидкий прорахунок</span>
                     </li>
                     <li className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-dream-yellow flex items-center justify-center text-stone-900 font-bold">✓</div>
                        <span className="font-medium">Допомога дизайнера</span>
                     </li>
                     <li className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-dream-cyan flex items-center justify-center text-stone-900 font-bold">✓</div>
                        <span className="font-medium">Доставка по Україні</span>
                     </li>
                  </ul>
               </div>
               <FileUpload />
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;