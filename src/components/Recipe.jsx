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

const Recipe = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <section className="bg-white py-20" id="resep">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Resep Olahan Jamur</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Inspirasi memasak dengan jamur tiram dan jamur jerami dari Kaesang Cendawan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resepData.map((resep) => (
            <div key={resep.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
              <div 
                className="h-48 bg-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url('${resep.image}')` }}
              ></div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{resep.title}</h3>
                <p className="text-slate-500 text-sm mb-4 flex-grow">{resep.desc}</p>
                <button 
                  onClick={() => setSelectedRecipe(resep)}
                  className="text-[#4a7c59] font-bold flex items-center gap-2 hover:text-[#d99a45] transition-colors self-start mt-auto"
                >
                  Baca Resep <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Resep */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRecipe(null)}>
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="bg-[#4a7c59] text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{selectedRecipe.title}</h3>
              <button onClick={() => setSelectedRecipe(null)} className="hover:text-gray-200 transition-colors p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-grow">
              <div 
                className="w-full h-64 md:h-80 bg-slate-200 rounded-xl mb-6 bg-cover bg-center shadow-inner"
                style={{ backgroundImage: `url('${selectedRecipe.image}')` }}
              ></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div className="bg-[#f0f7f4] p-5 rounded-xl border border-[#d1e6d9]">
                  <h4 className="font-bold text-[#2c4a35] text-lg mb-4">Bahan-bahan:</h4>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 text-sm">
                    {selectedRecipe.bahan.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#fcfaf8] p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-[#2c4a35] text-lg mb-4">Cara Membuat:</h4>
                  <ol className="list-decimal pl-5 space-y-3 text-slate-700 text-sm">
                    {selectedRecipe.cara.map((langkah, idx) => (
                      <li key={idx} className="pl-1">{langkah}</li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                <h4 className="font-bold text-amber-800 mb-2">💡 Tips:</h4>
                <p className="text-amber-700 text-sm">{selectedRecipe.tips}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Recipe;
