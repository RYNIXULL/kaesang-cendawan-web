// PaymentMethodCard.jsx — Kartu pilihan metode pembayaran
export default function PaymentMethodCard({ method, selected, onSelect }) {
  const isSelected = selected === method.id;
  return (
    <button
      type="button"
      onClick={() => onSelect(method.id)}
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

      {/* Icon/Logo */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
        ${isSelected ? 'bg-[#4a7c59]/15' : 'bg-slate-100'}`}>
        {method.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${isSelected ? 'text-[#2c4a35]' : 'text-slate-700'}`}>
          {method.name}
        </p>
        {method.description && (
          <p className="text-xs text-slate-400 truncate">{method.description}</p>
        )}
      </div>

      {/* Badge */}
      {method.badge && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0
          ${method.badgeColor || 'bg-slate-100 text-slate-500'}`}>
          {method.badge}
        </span>
      )}
    </button>
  );
}
