import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

const resepData = [
  {
    id: 1,
    title: "Tumis Jamur Tiram Saus Tiram",
    desc: "Resep praktis dengan jamur tiram yang ditumis dengan bawang, cabai, dan saus tiram. Cepat, sehat, dan penuh rasa umami.",
    image: "https://cdn.yummy.co.id/content-images/images/20230906/CXASt7Mti2I03X6aBhC4sYSRE86OqeUr-31363933393934333933d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp",
    bahan: [
      "500 gram jamur tiram segar, suwir-suwir",
      "1 buah bawang bombay, iris tipis",
      "3 siung bawang putih, cincang halus",
      "2 buah cabai merah, iris serong",
      "3 sdm saus tiram",
      "2 sdm kecap manis",
      "1 sdt kecap asin",
      "1 sdt minyak wijen",
      "1 batang daun bawang, iris tipis",
      "Minyak untuk menumis",
      "Garam dan merica secukupnya"
    ],
    cara: [
      "Bersihkan jamur tiram, suwir-suwir sesuai ukuran yang diinginkan",
      "Panaskan minyak, tumis bawang putih dan bawang bombay hingga harum",
      "Masukkan cabai merah, tumis sebentar",
      "Tambahkan jamur tiram, aduk rata dan masak hingga jamur layu",
      "Masukkan saus tiram, kecap manis, kecap asin, dan minyak wijen",
      "Aduk rata dan masak selama 3-5 menit hingga bumbu meresap",
      "Tambahkan garam dan merica secukupnya, koreksi rasa",
      "Terakhir masukkan daun bawang, aduk sebentar",
      "Angkat dan sajikan hangat dengan nasi putih"
    ],
    tips: "Untuk tekstur yang lebih crispy, jamur bisa ditumis dengan api besar dalam waktu singkat. Tambahkan sedikit air jika ingin kuah lebih banyak."
  },
  {
    id: 2,
    title: "Sup Jamur Jerami Ayam",
    desc: "Sup hangat dengan jamur jerami, potongan ayam, wortel, dan daun bawang. Sempurna untuk hari hujan atau saat kurang enak badan.",
    image: "https://img-global.cpcdn.com/recipes/fa4619c0e60e2851/1200x630cq70/photo.jpg",
    bahan: [
      "300 gram jamur jerami segar, potong sesuai selera",
      "200 gram dada ayam fillet, potong dadu",
      "1 buah wortel, potong dadu",
      "1 buah jagung manis, pipil",
      "3 siung bawang putih, geprek",
      "1 ruas jahe, geprek",
      "2 batang daun bawang, iris tipis",
      "1 batang seledri, iris halus",
      "1 liter air kaldu ayam",
      "1 sdt garam",
      "½ sdt merica bubuk",
      "1 sdt minyak wijen",
      "Bawang goreng untuk taburan"
    ],
    cara: [
      "Didihkan air kaldu ayam dalam panci",
      "Masukkan bawang putih dan jahe, masak hingga harum",
      "Tambahkan potongan ayam, masak hingga ayam matang",
      "Masukkan wortel dan jagung, masak hingga setengah matang",
      "Tambahkan jamur jerami, masak hingga jamur matang",
      "Bumbui dengan garam, merica, dan minyak wijen",
      "Koreksi rasa, tambahkan daun bawang dan seledri",
      "Masak sebentar hingga daun bawang layu",
      "Angkat dan sajikan hangat dengan taburan bawang goreng"
    ],
    tips: "Sup akan lebih nikmat jika disajikan dalam keadaan panas. Bisa ditambahkan sedikit saus tiram untuk rasa yang lebih gurih."
  },
  {
    id: 3,
    title: "Jamur Crispy Tepung",
    desc: "Jamur tiram atau jerami yang dibalut tepung rempah dan digoreng hingga crispy. Camilan sehat yang cocok untuk segala usia.",
    image: "https://img-global.cpcdn.com/recipes/b38fe9a8583e1547/680x482cq70/jamur-tiram-crispy-foto-resep-utama.jpg",
    bahan: [
      "400 gram jamur tiram atau jerami, suwir atau potong",
      "150 gram tepung terigu",
      "50 gram tepung beras",
      "1 butir telur",
      "200 ml air es",
      "2 siung bawang putih, haluskan",
      "1 sdt garam",
      "1 sdt merica bubuk",
      "1 sdt kaldu jamur",
      "½ sdt baking powder",
      "Minyak untuk menggoreng",
      "Saus sambal atau mayones untuk cocolan"
    ],
    cara: [
      "Cuci bersih jamur, tiriskan hingga kering",
      "Campur tepung terigu, tepung beras, garam, merica, kaldu jamur, dan baking powder",
      "Tambahkan telur dan air es sedikit demi sedikit, aduk hingga kental",
      "Masukkan bawang putih halus, aduk rata",
      "Panaskan minyak dalam wajan dengan api sedang",
      "Celupkan jamur ke dalam adonan tepung, pastikan seluruh permukaan tertutup",
      "Goreng jamur hingga berwarna kuning keemasan, angkat dan tiriskan",
      "Sajikan hangat dengan saus sambal atau mayones"
    ],
    tips: "Gunakan air es untuk membuat adonan lebih renyah. Pastikan minyak benar-benar panas sebelum menggoreng agar jamur tidak menyerap banyak minyak."
  },
  {
    id: 4,
    title: "Capcay Jamur Tiram & Jerami",
    desc: "Capcay lengkap dengan kombinasi jamur tiram dan jerami, ditambah sayuran segar lainnya. Menu lengkap dalam satu wajan.",
    image: "https://media.zcreators.id/crop/0x0:0x0/750x500/photo/indizone/2019/12/03/Q8saQy/t_5de617e1ab7f6.jpg",
    bahan: [
      "200 gram jamur tiram, suwir",
      "200 gram jamur jerami, potong sesuai selera",
      "100 gram udang kupas",
      "100 gram ayam fillet, iris tipis",
      "1 buah wortel, iris tipis",
      "100 gram sawi hijau, potong",
      "100 gram brokoli, potong kuntum",
      "100 gram kembang kol, potong kecil",
      "1 buah bawang bombay, iris tipis",
      "3 siung bawang putih, cincang",
      "3 sdm saus tiram",
      "2 sdm kecap ikan",
      "1 sdt minyak wijen",
      "1 sdm maizena, larutkan dengan sedikit air",
      "200 ml air kaldu",
      "Minyak untuk menumis"
    ],
    cara: [
      "Panaskan minyak, tumis bawang putih dan bawang bombay hingga harum",
      "Masukkan ayam dan udang, tumis hingga berubah warna",
      "Tambahkan wortel, brokoli, dan kembang kol, tumis sebentar",
      "Masukkan jamur tiram dan jamur jerami, aduk rata",
      "Tuang air kaldu, masak hingga sayuran setengah matang",
      "Tambahkan sawi hijau, saus tiram, kecap ikan, dan minyak wijen",
      "Tuang larutan maizena, aduk hingga kuah mengental",
      "Koreksi rasa, angkat dan sajikan hangat"
    ],
    tips: "Masak dengan api besar agar sayuran tetap renyah dan warnanya cerah. Bisa ditambahkan bakso atau sosis sesuai selera."
  }
];

import { Sparkles } from 'lucide-react';

const Recipe = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <section className="bg-transparent py-20" id="resep">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[#4a7c59] text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Inspirasi Masakan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Resep Olahan Jamur</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            Ide hidangan lezat dan sehat dari Kaesang Cendawan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resepData.map((resep) => (
            <div 
              key={resep.id} 
              className="bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-xl shadow-slate-100/50 border border-white/80 flex flex-col hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div 
                className="h-52 bg-slate-200 bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-500"
                style={{ backgroundImage: `url('${resep.image}')` }}
              ></div>
              <div className="p-6 flex flex-col flex-grow bg-white/40">
                <h3 className="font-black text-base text-slate-800 mb-2 leading-snug group-hover:text-[#4a7c59] transition-colors">{resep.title}</h3>
                <p className="text-slate-500 text-xs font-semibold mb-6 flex-grow leading-relaxed line-clamp-3">{resep.desc}</p>
                <button 
                  onClick={() => setSelectedRecipe(resep)}
                  className="text-xs font-black uppercase tracking-wider text-[#4a7c59] flex items-center gap-1.5 hover:text-[#d99a45] transition-colors self-start mt-auto active:scale-95 duration-200"
                >
                  <span>Baca Resep Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Resep */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white/95 backdrop-blur-2xl w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl border border-white/80 overflow-hidden flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#4a7c59] to-[#3a6347] text-white p-6 flex justify-between items-center border-b border-[#4a7c59]/10">
              <h3 className="font-black text-lg tracking-tight">{selectedRecipe.title}</h3>
              <button 
                onClick={() => setSelectedRecipe(null)} 
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 w-9 h-9 flex items-center justify-center transition-all font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 md:p-8 flex-grow">
              <div 
                className="w-full h-64 md:h-80 bg-slate-200 rounded-[24px] mb-8 bg-cover bg-center shadow-lg border-4 border-white"
                style={{ backgroundImage: `url('${selectedRecipe.image}')` }}
              ></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-white to-emerald-50/30 p-6 rounded-[24px] border border-slate-100 shadow-sm">
                  <h4 className="font-black text-[#2c4a35] text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-emerald-100/50 pb-2">🥗 Bahan-bahan:</h4>
                  <ul className="space-y-2.5 text-slate-600 text-xs font-semibold">
                    {selectedRecipe.bahan.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#4a7c59] mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-white to-amber-50/20 p-6 rounded-[24px] border border-slate-100 shadow-sm">
                  <h4 className="font-black text-[#2c4a35] text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5 border-b border-amber-100/50 pb-2">🍳 Cara Membuat:</h4>
                  <ol className="space-y-3.5 text-slate-600 text-xs font-semibold list-decimal pl-4.5">
                    {selectedRecipe.cara.map((langkah, idx) => (
                      <li key={idx} className="pl-1 leading-relaxed">{langkah}</li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div className="bg-amber-50/60 p-5 rounded-[24px] border border-amber-100 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="font-black text-amber-800 text-xs uppercase tracking-wider mb-1">Tips Tambahan:</h4>
                  <p className="text-amber-700/90 text-xs font-semibold leading-relaxed">{selectedRecipe.tips}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Recipe;
