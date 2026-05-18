import React from 'react';
import { PlayCircle, ZoomIn, Sparkles } from 'lucide-react';
import { resolveProductImageUrl } from '../utils/imageUrl';

const galleryData = [
  {
    id: 1,
    title: "Proses Budidaya",
    desc: "Video proses budidaya jamur jerami menggunakan bahan tankos sawit",
    image: "https://img.youtube.com/vi/O67I1cJFROw/hqdefault.jpg",
    isVideo: true,
    videoUrl: "https://www.youtube.com/embed/O67I1cJFROw"
  },
  {
    id: 2,
    title: "Greenhouse Jamur",
    desc: "Rumah kaca tempat budidaya jamur dengan suhu terkontrol",
    image: "https://images.unsplash.com/photo-1589410166299-65d1d6a666e5?auto=format&fit=crop&w=600&q=80",
    isVideo: false
  },
  {
    id: 3,
    title: "Media Tanam",
    desc: "Serbuk kayu sebagai media tumbuh jamur yang steril",
    image: "https://asset.kompas.com/crops/2WymR8Oox8KPTqCnx9_vIqLcgnI=/0x0:1000x667/750x500/data/photo/2022/01/28/61f36ce16c333.jpg",
    isVideo: false
  },
  {
    id: 4,
    title: "Panen Jamur",
    desc: "Jamur tiram siap panen dengan kualitas terbaik",
    image: "https://images.unsplash.com/photo-1626084478144-8848db215286?auto=format&fit=crop&w=800&q=60",
    isVideo: false
  }
];

const Gallery = ({ items }) => {
  const [selectedVideo, setSelectedVideo] = React.useState(null);

  const displayItems = Array.isArray(items) && items.length > 0 ? items : galleryData;

  return (
    <section className="bg-transparent py-20 border-t border-slate-200/40" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[#d99a45] text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dokumentasi Kebun</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Galeri Budidaya Kami</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Dedikasi tinggi dalam menghasilkan cendawan terbaik
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, index) => (
            <div 
              key={item.id || index} 
              className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-100/60 border border-slate-100 group flex flex-col hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div 
                className="relative h-60 overflow-hidden cursor-pointer bg-slate-200 flex-shrink-0"
                onClick={() => item.isVideo && setSelectedVideo(item.videoUrl)}
              >
                <img 
                  src={resolveProductImageUrl(item.image)} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1589410166299-65d1d6a666e5?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  {item.isVideo ? (
                    <div className="bg-white/95 text-[#4a7c59] p-4.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <PlayCircle className="w-10 h-10 fill-emerald-100/50" />
                    </div>
                  ) : (
                    <div className="bg-white/95 text-[#4a7c59] p-4.5 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <ZoomIn className="w-8 h-8" />
                    </div>
                  )}
                </div>
                {item.isVideo && (
                  <span className="absolute top-3 left-3 bg-[#d99a45]/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-white/20">
                    Video 🎥
                  </span>
                )}
              </div>
              <div className="p-6 flex-grow flex flex-col justify-center bg-white/50">
                <h4 className="text-[15px] font-black text-slate-800 mb-1.5 leading-snug group-hover:text-[#4a7c59] transition-colors">{item.title}</h4>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all z-10 font-bold"
              onClick={() => setSelectedVideo(null)}
            >
              &times;
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={`${selectedVideo}?autoplay=1`} 
                className="w-full h-[60vh] md:h-[70vh]"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                title="Youtube Video player"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
