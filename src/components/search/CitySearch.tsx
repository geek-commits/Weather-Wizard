import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useSound } from "../../hooks/useSound";

export function CitySearch({
  onSearch,
  loading,
}: {
  onSearch: (city: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");
  const playSubmit = useSound("pressSoft");

  const submit = () => {
    const city = value.trim();
    if (!city) return;
    playSubmit();
    onSearch(city);
  };

  return (
    <div className="w-[min(100%,380px)]">
      <label htmlFor="city-search" className="sr-only">
        Search city
      </label>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#94A3B8]" aria-hidden />
          <input
            id="city-search"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Search city — e.g. Dar es Salaam"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-full border border-[rgba(15,23,42,0.08)] bg-white py-[11px] pl-[38px] pr-4 text-[14px] font-[450] tracking-[-0.01em] text-[#0F172A] placeholder:text-[#94A3B8] shadow-[0_2px_12px_rgba(15,23,42,0.06)] outline-none transition-[border-color,box-shadow] focus:border-[rgba(15,23,42,0.12)] focus:shadow-[0_4px_16px_rgba(15,23,42,0.08)] focus-visible:ring-2 focus-visible:ring-[#0F172A]/10"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          aria-label="Search weather"
          className="inline-flex h-[42px] items-center justify-center rounded-full bg-[#0F172A] px-5 text-[14px] font-[600] tracking-[-0.01em] text-white shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition-colors hover:bg-[#1E293B] disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : "Search"}
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] font-[450] tracking-wide text-[#94A3B8]">Press Enter to search</p>
    </div>
  );
}
