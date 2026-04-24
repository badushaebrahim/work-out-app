"use client";

import { useState, useEffect } from "react";
import { getExercises } from "@/app/admin/actions";

export default function ExerciseImporter({ targetId }: { targetId: string }) {
  const [exercisesData, setExercisesData] = useState<any[]>([]);

  useEffect(() => {
    getExercises().then(data => setExercisesData(data));
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const exId = e.target.value;
    if (!exId) return;
    const ex = exercisesData.find(x => x._id === exId);
    if (!ex) return;

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

        // Trigger onChange manually if needed (React sometimes ignores direct value changes)
        // A hack for React forms:
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(target, target.value);
        }
        target.dispatchEvent(new Event('input', { bubbles: true }));

      } catch (err) {
        alert("Invalid JSON currently in textarea. Please fix or clear it before importing.");
      }
    }
    e.target.value = "";
  };

  return (
    <select onChange={handleImport} className="bg-surface-container-highest border border-white/10 rounded-lg py-1 px-2 text-xs text-white outline-none">
      <option value="">+ Import from Database</option>
      {exercisesData.map(ex => (
        <option key={ex._id} value={ex._id}>{ex.name}</option>
      ))}
    </select>
  );
}
