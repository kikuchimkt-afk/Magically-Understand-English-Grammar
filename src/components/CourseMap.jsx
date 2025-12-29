import React from 'react';
import levels from '../data/levels.json';
import { Play, Lock, Star, ChevronRight, BookOpen } from 'lucide-react';
import clsx from 'clsx';

const CourseMap = ({ onSelectLevel, completedLevels = [] }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 font-inter">
            {/* Header */}
            <div className="text-center mb-16 animate-fadeIn">
                <div className="inline-block p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
                    <BookOpen className="text-white w-8 h-8" />
                </div>
                <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Grammar Journey</h1>
                <p className="text-slate-500 font-medium">Master English sentence structures step by step.</p>

                {/* Progress Bar (Mock) */}
                <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(Math.max(1, completedLevels.length) / levels.length) * 100}%` }}
                    />
                </div>
                <p className="text-xs text-indigo-500 font-bold mt-2 uppercase tracking-wide">
                    {completedLevels.length} / {levels.length} Mastery
                </p>
            </div>

            {/* Map Path */}
            <div className="flex flex-col gap-6 w-full max-w-md relative">
                {/* Connecting Line (Vertical) - Abstract representation */}
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-slate-200 -z-10 rounded-full" />

                {levels.map((level, index) => {
                    const isUnlocked = index === 0 || completedLevels.includes(index);
                    // Logic: Unlocked if it's first level OR previous level is completed.
                    // Actually, simpler logic: if index <= completedLevels.length (assuming sequential progress)

                    const isPlayable = index <= completedLevels.length;
                    const isCompleted = completedLevels.includes(index + 1); // treating IDs as 1-based index roughly

                    // Let's use flexible logic: 
                    // Level is locked if index > completedLevels.length (assuming linear progression)
                    const locked = index > completedLevels.length;
                    const completed = index < completedLevels.length;
                    const current = index === completedLevels.length;

                    return (
                        <div
                            key={level.id}
                            onClick={() => !locked && onSelectLevel(index)}
                            className={clsx(
                                "relative flex items-center gap-6 p-4 rounded-2xl transition-all duration-300 border-2",
                                locked
                                    ? "bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed grayscale"
                                    : "bg-white cursor-pointer hover:scale-102 hover:shadow-xl",
                                current
                                    ? "border-indigo-500 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50"
                                    : "border-transparent shadow-sm",
                                completed && "border-green-200 bg-green-50/30"
                            )}
                        >
                            {/* Icon Node */}
                            <div className={clsx(
                                "w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg transition-transform",
                                locked ? "bg-slate-300" : (completed ? "bg-green-500" : "bg-indigo-600"),
                                !locked && "group-hover:scale-110"
                            )}>
                                {locked ? <Lock className="w-6 h-6" /> : (completed ? <Star className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 pl-1" />)}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <h3 className={clsx("font-bold text-lg", locked ? "text-slate-400" : "text-slate-800")}>
                                    {level.title}
                                </h3>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                    {locked ? "Locked" : `Word Count: ${level.words.length}`}
                                </p>
                            </div>

                            {/* Chevron */}
                            {!locked && (
                                <div className="text-slate-300">
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 text-center text-slate-400 text-sm">
                <p>Build sentences, unlock the magic.</p>
            </div>
        </div>
    );
};

export default CourseMap;
