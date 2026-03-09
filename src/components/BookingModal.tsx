import { Calendar, Users } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  return (
    <div className={`fixed inset-0 z-[40] flex items-start justify-center pt-[88px] pointer-events-none transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 delay-100'}`}>
      {/* 
        Partial overlay: Dark tint with a slight blur.
        We conditionally apply pointer-events so it doesn't block the site when closed.
      */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* Modal Container: Full Width, dropping and expanding from the button */}
      <div className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-y-0 scale-x-[0.9] -translate-y-4 pointer-events-none'}`}>
        
        {/* Modal Window Panel: Barely transparent (glassmorphism) full width bar */}
        <div className="bg-white/5 backdrop-blur-2xl border-y border-white/10 py-12 shadow-2xl relative w-full">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
            
            <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white mb-8 tracking-[0.05em] drop-shadow-sm text-center md:text-left">
              Знайдіть ідеальний тур
            </h2>

            {/* Form Grid */}
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Origin */}
              <div className="flex-1 bg-white/95 rounded-[2px] p-3 px-5 relative flex flex-col justify-center shadow-lg">
                <label className="text-[10px] uppercase text-gray-500 font-montserrat font-bold tracking-[0.1em] mb-1">
                  Звідки
                </label>
                <input 
                  type="text" 
                  placeholder="Київ" 
                  className="w-full outline-none text-black font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-gray-400" 
                />
              </div>

              {/* Destination */}
              <div className="flex-1 bg-white/95 rounded-[2px] p-3 px-5 relative flex flex-col justify-center shadow-lg">
                <label className="text-[10px] uppercase text-gray-500 font-montserrat font-bold tracking-[0.1em] mb-1">
                  Куди
                </label>
                <input 
                  type="text" 
                  placeholder="Вкажіть напрямок" 
                  className="w-full outline-none text-black font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-gray-400" 
                />
              </div>

              {/* Depart Date */}
              <div className="w-full lg:w-[160px] bg-white/95 rounded-[2px] p-3 px-5 relative flex flex-col justify-center group cursor-text shadow-lg">
                <label className="text-[10px] uppercase text-gray-500 font-montserrat font-bold tracking-[0.1em] mb-1">
                  Відправлення
                </label>
                <div className="flex items-center justify-between">
                   <input 
                     type="text" 
                     placeholder="Дата" 
                     className="w-full outline-none text-black font-inter font-semibold text-sm border-none p-0 bg-transparent placeholder-gray-400 pointer-events-none" 
                   />
                   <Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                </div>
              </div>

              {/* Return Date */}
              <div className="w-full lg:w-[160px] bg-white/95 rounded-[2px] p-3 px-5 relative flex flex-col justify-center group cursor-text shadow-lg">
                <label className="text-[10px] uppercase text-gray-500 font-montserrat font-bold tracking-[0.1em] mb-1">
                  Повернення
                </label>
                <div className="flex items-center justify-between">
                   <input 
                     type="text" 
                     placeholder="Дата" 
                     className="w-full outline-none text-black font-inter font-semibold text-sm border-none p-0 bg-transparent placeholder-gray-400 pointer-events-none" 
                   />
                   <Calendar className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                </div>
              </div>

              {/* Passengers */}
              <div className="flex-1 bg-white/95 rounded-[2px] p-3 px-5 relative flex flex-col justify-center cursor-pointer shadow-lg">
                <label className="text-[10px] uppercase text-gray-500 font-montserrat font-bold tracking-[0.1em] mb-1">
                  Гості
                </label>
                <div className="flex items-center justify-between">
                  <select className="w-full outline-none text-black font-inter font-semibold text-sm md:text-base bg-transparent cursor-pointer appearance-none border-none p-0">
                    <option className="font-inter">1 дорослий</option>
                    <option className="font-inter">2 дорослих</option>
                    <option className="font-inter">2 дорослих, 1 дитина</option>
                    <option className="font-inter">Більше...</option>
                  </select>
                  <Users className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                </div>
              </div>

              {/* Submit Button (Site's Premium Style) */}
              <button className="bg-white/5 border border-white/20 text-white font-montserrat uppercase tracking-[0.2em] font-bold text-sm md:text-[13px] hover:bg-white hover:text-black transition-all duration-500 rounded-[2px] px-10 py-5 lg:py-0 shadow-lg shrink-0 w-full lg:w-auto mt-4 lg:mt-0">
                Замовити
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
