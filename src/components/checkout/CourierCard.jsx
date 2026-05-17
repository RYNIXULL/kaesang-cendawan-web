// CourierCard.jsx — Kartu pilihan kurir; harga dari quote API (backend) bila tersedia
export default function CourierCard({ courier, selected, onSelect, quote, shippingLoading, formatRupiah }) {
  const isSelected = selected === courier.id;
  const displayFree = quote?.isFree === true || Number(quote?.cost) === 0;
  const displayCost = quote != null ? Number(quote.cost) : null;
  return (
    <button
      type="button"
      onClick={() => onSelect(courier.id)}
      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 text-left
        ${isSelected
          ? 'border-[#4a7c59] bg-[#f0f7f4] shadow-md shadow-[#4a7c59]/10'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
        }`}
    >
      {/* Radio dot */}
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
        ${isSelected ? 'border-[#4a7c59]' : 'border-slate-300'}`}>
        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#4a7c59]" />}
      </div>

      {/* Icon */}
      <span className="text-xl">{courier.icon}</span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${isSelected ? 'text-[#2c4a35]' : 'text-slate-700'}`}>
          {courier.name}
        </p>
        <p className="text-xs text-slate-400">{courier.eta}</p>
      </div>

      {/* Harga (sumber: POST /api/shipping/calculate) */}
      <div className="text-right flex-shrink-0">
        {shippingLoading && displayCost === null && !displayFree ? (
          <span className="text-xs font-medium text-slate-400">…</span>
        ) : displayFree ? (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
            GRATIS
          </span>
        ) : (
          <span className={`text-sm font-bold ${isSelected ? 'text-[#4a7c59]' : 'text-slate-700'}`}>
            {formatRupiah(displayCost ?? courier.cost)}
          </span>
        )}
      </div>
    </button>
  );
}
