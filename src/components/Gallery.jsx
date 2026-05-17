import React from 'react';
import { PlayCircle, ZoomIn } from 'lucide-react';
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
    <section className="bg-[#fcfaf8] py-20 border-t border-slate-100" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Galeri Budidaya</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Proses budidaya jamur yang kami lakukan dengan perhatian dan dedikasi tinggi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, index) => (
            <div key={item.id || index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group flex flex-col hover:shadow-xl transition-all duration-300">
              <div 
                className="relative h-64 overflow-hidden cursor-pointer bg-slate-200 flex-shrink-0"
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.isVideo ? (
                    <PlayCircle className="text-white w-16 h-16 opacity-90" />
                  ) : (
                    <ZoomIn className="text-white w-12 h-12 opacity-90" />
                  )}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-center">
                <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-4xl"
              onClick={() => setSelectedVideo(null)}
            >
              &times;
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                src={`${selectedVideo}?autoplay=1`} 
                className="w-full h-[60vh] md:h-[70vh] rounded-lg"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
