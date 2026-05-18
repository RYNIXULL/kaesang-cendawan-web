import { resolveProductImageUrl } from '../utils/imageUrl';
import { Leaf, Award } from 'lucide-react';

const About = ({ text, image }) => {
  const defaultText1 = "Berawal dari tanah subur Lampung, Kaesang Cendawan tumbuh dengan semangat menghadirkan jamur segar berkualitas yang kami harap mampu menembus pasar global.";
  const defaultText2 = "Dengan metode budidaya alami, ramah lingkungan, dan penuh dedikasi, kami tidak hanya menawarkan produk pangan, tetapi juga membawa cerita tentang keberlanjutan, inovasi, dan kebanggaan lokal yang mendunia.";

  const paragraphs = text
    ? text.split('\n\n').filter(p => p.trim() !== '')
    : [defaultText1, defaultText2];

  const imageUrl = resolveProductImageUrl(image || "/kombong.jpeg");

  return (
    <section className="py-20 bg-transparent" id="tentang-kami">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[#4a7c59] text-xs font-black uppercase tracking-widest mb-3">
            <Leaf className="h-3.5 w-3.5" />
            <span>Cerita Kami</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Tentang Kaesang Cendawan</h2>
          <div className="w-12 h-1 bg-[#d99a45] mx-auto mt-4 rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Bagian Teks */}
          <div className="bg-gradient-to-br from-white to-emerald-50/20 rounded-[32px] p-8 md:p-12 shadow-xl shadow-slate-100/70 border border-slate-100 order-2 md:order-1 relative overflow-hidden group hover:border-[#4a7c59]/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/20 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl font-black text-slate-800 mb-6 leading-snug flex items-center gap-2">
              Membawa Jamur Lokal <br className="hidden sm:inline" />ke Kancah Internasional
            </h3>
            <div className="space-y-4">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-[14px] sm:text-base text-slate-600 leading-relaxed font-semibold text-justify">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Bagian Gambar */}
          <div className="order-1 md:order-2">
            <div className="rounded-[32px] overflow-hidden shadow-2xl h-[400px] lg:h-[450px] group relative border-4 border-white shadow-emerald-950/5">
              <img 
                src={imageUrl} 
                alt="Budidaya Kaesang Cendawan" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://images.unsplash.com/photo-1589410166299-65d1d6a666e5?auto=format&fit=crop&w=800&q=80"; // Fallback placeholder
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 font-extrabold uppercase tracking-widest text-[#fef3c7]">Rumah Jamur (Kombong)</span>
                <h4 className="text-lg font-black mt-2 tracking-tight">Kondisi Suhu & Kelembaban Terkontrol</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
