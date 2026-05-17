import { resolveProductImageUrl } from '../utils/imageUrl';

const About = ({ text, image }) => {
  const defaultText1 = "Berawal dari tanah subur Lampung, Kaesang Cendawan tumbuh dengan semangat menghadirkan jamur segar berkualitas yang kami harap mampu menembus pasar global.";
  const defaultText2 = "Dengan metode budidaya alami, ramah lingkungan, dan penuh dedikasi, kami tidak hanya menawarkan produk pangan, tetapi juga membawa cerita tentang keberlanjutan, inovasi, dan kebanggaan lokal yang mendunia.";

  const paragraphs = text
    ? text.split('\n\n').filter(p => p.trim() !== '')
    : [defaultText1, defaultText2];

  const imageUrl = resolveProductImageUrl(image || "/kombong.jpeg");

  return (
    <section className="bg-white py-20" id="about">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold text-slate-800">Tentang Kami</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Bagian Teks */}
          <div className="bg-[#f0f7f4] rounded-3xl p-8 md:p-10 shadow-sm border border-[#d1e6d9] order-2 md:order-1">
            <h3 className="text-2xl font-bold text-[#2c4a35] mb-4">Membawa Jamur Lokal ke Kancah Global</h3>
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-lg text-slate-700 leading-relaxed text-justify mb-4 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          {/* Bagian Gambar (seperti hero-image di jamur.html) */}
          <div className="order-1 md:order-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[450px] group relative">
              <img 
                src={imageUrl} 
                alt="Budidaya Kaesang Cendawan" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://images.unsplash.com/photo-1589410166299-65d1d6a666e5?auto=format&fit=crop&w=800&q=80"; // Fallback placeholder
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
