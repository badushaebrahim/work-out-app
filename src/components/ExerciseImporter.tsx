"use client";

import { useState, useEffect, useRef } from "react";
import { getExercises } from "@/app/admin/actions";

export default function ExerciseImporter({ targetId }: { targetId: string }) {
  const [exercisesData, setExercisesData] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    getExercises().then(data => setExercisesData(data));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = exercisesData.filter(ex =>
    ex.name.toLowerCase().includes(query.toLowerCase())
  );

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleImport = (ex: any) => {
    const target = document.getElementById(targetId) as HTMLTextAreaElement;
    if (target) {
      try {
        let currentArr = target.value ? JSON.parse(target.value) : [];
        if (!Array.isArray(currentArr)) currentArr = [];
        currentArr.push({
          name: ex.name,
          type: ex.type,
          sets: ex.sets,
          reps: ex.reps,
          rest: ex.rest,
          executionSteps: ex.executionSteps,
          trainerInsight: ex.trainerInsight,
          imageUrl: ex.imageUrl
        });
        target.value = JSON.stringify(currentArr, null, 2);

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(target, target.value);
        }
        target.dispatchEvent(new Event('input', { bubbles: true }));
      } catch {
        alert("Invalid JSON currently in textarea. Please fix or clear it before importing.");
      }
    }
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key === "ArrowDown") {
      setIsOpen(true);
      setActiveIndex(0);
      e.preventDefault();
      return;
    }
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && filtered[activeIndex]) {
          handleImport(filtered[activeIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#CCFF00]/60 shrink-0">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search & import exercise…"
          className="bg-surface-container-highest border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white outline-none w-56 placeholder:text-white/30 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 transition-all"
        />
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          className="absolute right-0 top-full mt-1 w-72 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-surface-container-highest shadow-2xl shadow-black/40 z-50 py-1"
          style={{ backdropFilter: "blur(16px)" }}
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-xs text-white/40 text-center">No exercises found</li>
          ) : (
            filtered.map((ex, i) => (
              <li
                key={ex._id}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => handleImport(ex)}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs transition-colors ${
                  i === activeIndex
                    ? "bg-[#CCFF00]/10 text-[#CCFF00]"
                    : "text-white/80 hover:bg-white/5"
                }`}
              >
                <span className="text-[10px] text-[#CCFF00]/50 font-mono w-4 text-right shrink-0">{i + 1}</span>
                <span className="truncate font-medium">{ex.name}</span>
                {ex.type && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/30 shrink-0">{ex.type}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
