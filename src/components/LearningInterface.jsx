import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, ArrowRight, Sparkles } from 'lucide-react';
import levels from '../data/levels.json';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const WORD_TYPES = {
    noun: { color: 'bg-blue-500', text: 'text-white', label: 'Noun' },
    verb: { color: 'bg-red-500', text: 'text-white', label: 'Verb' },
    adj: { color: 'bg-green-500', text: 'text-white', label: 'Adjective' },
    default: { color: 'bg-slate-200', text: 'text-slate-700', label: 'Word' }
};

const WordTile = ({ word, onClick, isSelected, disabled }) => {
    const style = WORD_TYPES[word.type] || WORD_TYPES.default;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={twMerge(
                "relative group px-6 py-3 rounded-xl font-bold text-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1",
                style.color,
                style.text,
                disabled ? "opacity-30 cursor-not-allowed transform-none hover:transform-none" : "hover:shadow-lg active:scale-95"
            )}
        >
            {word.text}
            {/* Grammar Label Tooltip */}
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {style.label}
            </span>
        </button>
    );
};

const EmptySlot = ({ index, onClick }) => (
    <div
        onClick={onClick}
        className="w-32 h-14 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 font-medium bg-slate-50/50 hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
    >
        <span className="text-xs uppercase tracking-wider">Slot {index + 1}</span>
    </div>
);

const LearningInterface = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [availableWords, setAvailableWords] = useState([]);
    const [placedWords, setPlacedWords] = useState([]);
    const [status, setStatus] = useState('playing'); // playing, success, error

    const currentLevel = levels[currentLevelIndex];

    useEffect(() => {
        // Initialize level
        if (currentLevel) {
            setAvailableWords([...currentLevel.words].sort(() => Math.random() - 0.5)); // Shuffle
            setPlacedWords([]);
            setStatus('playing');
        }
    }, [currentLevelIndex]);

    const handleWordSelect = (word) => {
        if (status === 'success') return;
        setPlacedWords([...placedWords, word]);
        setAvailableWords(availableWords.filter(w => w.id !== word.id));
        setStatus('playing');
    };

    const handleRemoveWord = (word) => {
        if (status === 'success') return;
        setPlacedWords(placedWords.filter(w => w.id !== word.id));
        setAvailableWords([...availableWords, word]);
        setStatus('playing');
    };

    const checkAnswer = () => {
        const currentPattern = placedWords.map(w => w.type);
        const targetPattern = currentLevel.targetPattern;

        // Simple Deep Equal Check
        const isCorrect = currentPattern.length === targetPattern.length &&
            currentPattern.every((value, index) => value === targetPattern[index]);

        // Also check exact words if needed, but "Grammar Gravity" implies checking structure mainly.
        // Let's enforce specific words for this prototype as well to catch "Red is loving him" vs "Loving him is red".
        // Actually, the LEVEL data has a specific order implied by array index in original? 
        // No, original json just has "words" and "targetPattern". 
        // For the sentence "Loving him is red", strict word order is usually required.
        // Let's assume the json words array is in correct order or I should check against the original index?
        // Wait, "targetPattern" just says types. 
        // Let's strictly check if the constructed sentence matches the original text order?
        // Actually, let's assume valid English is the goal. But detecting ALL valid English is hard.
        // Let's just check against one correct solution for now.
        // The level data provided earlier:
        /**
         "words": [ {text: "Loving"}, {text: "him"}, {text: "is"}, {text: "red"} ]
         */
        // If the user builds "Loving him is red", it's correct.
        // I will check if the word IDs are in the order w1, w2, w3, w4.

        const isExactMatch = placedWords.every((w, i) => w.id === `w${i + 1}`);

        if (isExactMatch) {
            setStatus('success');
        } else {
            setStatus('error');
        }
    };

    const nextLevel = () => {
        if (currentLevelIndex < levels.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
        } else {
            alert("Prototype complete! Good job.");
            setCurrentLevelIndex(0); // Loop back
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex flex-col items-center justify-center p-6 font-inter">
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Sparkles className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Grammar Magic</h1>
                        <p className="text-slate-500 text-sm font-medium">Level {currentLevelIndex + 1}: {currentLevel.title}</p>
                    </div>
                </div>
                <button
                    onClick={() => setCurrentLevelIndex(currentLevelIndex)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Main Stage */}
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                {/* Source/Instruction */}
                <div className="text-center mb-12">
                    <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Reconstruct the Sentence</h2>
                    <p className="text-slate-400 font-medium italic">"{currentLevel.source}"</p>
                </div>

                {/* Construction Area */}
                <div className="min-h-[120px] mb-12 flex flex-wrap justify-center gap-4 items-center bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all duration-300">
                    {placedWords.length === 0 && (
                        <div className="text-slate-300 font-medium text-lg animate-pulse select-none">
                            Tap words below to build the sentence...
                        </div>
                    )}

                    {placedWords.map((word, index) => (
                        <WordTile
                            key={`placed-${word.id}`}
                            word={word}
                            onClick={() => handleRemoveWord(word)}
                        />
                    ))}

                    {/* Ghost Slot for next word suggestion or just spacing */}
                    {status === 'playing' && placedWords.length < currentLevel.words.length && (
                        <div className="w-4 h-4 rounded-full bg-slate-200 animate-bounce delay-100 opacity-50" />
                    )}
                </div>

                {/* Word Bank */}
                <div className="mb-12">
                    <div className="flex flex-wrap justify-center gap-4">
                        {availableWords.map((word) => (
                            <WordTile
                                key={word.id}
                                word={word}
                                onClick={() => handleWordSelect(word)}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-center items-center gap-4 h-16">
                    {status === 'error' && (
                        <div className="flex items-center gap-2 text-red-500 font-bold animate-shake">
                            <span>Try Again!</span>
                        </div>
                    )}

                    {status === 'success' ? (
                        <button
                            onClick={nextLevel}
                            className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-105 transition-all"
                        >
                            <span>Next Level</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={checkAnswer}
                            disabled={placedWords.length === 0}
                            className={clsx(
                                "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all",
                                placedWords.length > 0
                                    ? "bg-slate-800 text-white shadow-lg hover:bg-slate-700 hover:scale-105"
                                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            )}
                        >
                            <span>Check Magic</span>
                            <Sparkles className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Legend (Bottom) */}
            <div className="mt-8 flex gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Noun
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span> Verb
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span> Adjective
                </div>
            </div>
        </div>
    );
};

export default LearningInterface;
