import { Send } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  return (
    <div className={`fixed inset-0 z-[40] flex items-start justify-center pt-[88px] pointer-events-none transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 delay-100'}`}>
      {/* 
        Partial overlay: Dark tint with a slight blur.
      */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Modal Container: Full Width, dropping from the top */}
      <div className={`relative w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-y-0 scale-x-[0.9] -translate-y-4 pointer-events-none'}`}>

        {/* Modal Window Panel: Glassmorphism full width bar */}
        <div className="bg-black/80 backdrop-blur-2xl border-y border-white/10 py-12 shadow-2xl relative w-full">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">

            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-shrink-0 text-center md:text-left">
                <h2 className="text-xl md:text-3xl font-montserrat font-bold text-white mb-2 tracking-[0.05em] uppercase">
                  Зв'язок
                </h2>
                <p className="text-white/40 text-[11px] uppercase tracking-widest font-bold">
                  Залиште запит і ми зв'яжемося з вами
                </p>
              </div>

              {/* Form Grid */}
              <form className="flex-grow flex flex-col lg:flex-row gap-4 w-full">

                {/* Contact Input */}
                <div className="flex-[1.5] bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors">
                  <label className="text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                    Контактні дані
                  </label>
                  <input
                    type="text"
                    placeholder="Номер, e-mail, або нікнейм у соцмережі"
                    className="w-full outline-none text-white font-inter font-semibold text-sm md:text-base border-none p-0 bg-transparent placeholder-white/20"
                    required
                  />
                </div>

                {/* Comment Textarea */}
                <div className="flex-[2] bg-white/5 border border-white/10 rounded-[2px] p-3 px-5 relative flex flex-col justify-center focus-within:border-white/30 transition-colors">
                  <label className="text-[10px] uppercase text-white/40 font-montserrat font-bold tracking-[0.1em] mb-1">
                    Коментар до звернення (не обов'язково)
                  </label>
                  <input
                    type="text"
                    placeholder="Ваше повідомлення..."
                    className="w-full outline-none text-white font-inter font-semibold text-sm border-none p-0 bg-transparent placeholder-white/20"
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="bg-white border border-white text-black font-montserrat uppercase tracking-[0.2em] font-bold text-sm md:text-[13px] hover:bg-transparent hover:text-white transition-all duration-500 rounded-[2px] px-10 py-5 lg:py-0 shadow-lg shrink-0 w-full lg:w-auto h-[64px]"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span>Надіслати</span>
                    <Send className="w-4 h-4" />
                  </div>
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
