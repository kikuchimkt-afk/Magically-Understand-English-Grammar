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

const LearningInterface = ({ levelIndex, onBack, onNextLevel }) => {
    const currentLevel = levels[levelIndex];

    // State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [availableWords, setAvailableWords] = useState([]);
    const [placedWords, setPlacedWords] = useState([]);
    const [status, setStatus] = useState('playing'); // playing, success, error
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // Derived
    const currentQuestion = currentLevel.questions ? currentLevel.questions[currentQuestionIndex] : null;

    useEffect(() => {
        // Reset question index when level changes
        setCurrentQuestionIndex(0);
    }, [levelIndex]);

    useEffect(() => {
        // Initialize question
        if (currentQuestion) {
            setAvailableWords([...currentQuestion.words].sort(() => Math.random() - 0.5)); // Shuffle
            setPlacedWords([]);
            setStatus('playing');
            setShowHint(false);
            setShowExplanation(false);
        }
    }, [currentQuestionIndex, currentLevel]);

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
        const isExactMatch = placedWords.every((w, i) => w.id === `w${i + 1}`);

        if (isExactMatch && placedWords.length === currentQuestion.words.length) {
            setStatus('success');
            setShowExplanation(true);
        } else {
            setStatus('error');
        }
    };

    const handleGiveUp = () => {
        // Auto-complete the sentence
        const correctOrder = [...currentQuestion.words].sort((a, b) =>
            parseInt(a.id.replace('w', '')) - parseInt(b.id.replace('w', ''))
        );
        setPlacedWords(correctOrder);
        setAvailableWords([]);
        setStatus('success');
        setShowExplanation(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentLevel.questions.length - 1) {
            // Go to next question
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Level Completed
            onNextLevel();
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 flex flex-col items-center justify-center p-6 font-inter">
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-8 md:mb-12">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    <span>Back to Map</span>
                </button>

                <div className="text-right">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                        {currentLevel.title}
                    </p>
                    <div className="flex items-center justify-end gap-2 mt-1">
                        <span className="text-xs text-indigo-500 font-bold">
                            Question {currentQuestionIndex + 1} / {currentLevel.questions.length}
                        </span>
                        {/* Progress Dots */}
                        <div className="flex gap-1">
                            {currentLevel.questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={clsx(
                                        "w-2 h-2 rounded-full transition-colors",
                                        idx < currentQuestionIndex ? "bg-indigo-500" :
                                            idx === currentQuestionIndex ? "bg-indigo-300 animate-pulse" : "bg-slate-200"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Stage */}
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                {/* Source/Instruction */}
                <div className="text-center mb-8">
                    <h2 className="text-sm font-bold text-indigo-500 uppercase tracking-widest mb-2">Reconstruct the Sentence</h2>
                    <p className="text-slate-400 font-medium italic">"{currentQuestion.source}"</p>
                </div>

                {/* Hint Section */}
                {showHint && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm font-medium flex items-start gap-2 animate-fadeIn">
                        <span className="text-xl">💡</span>
                        <p>{currentQuestion.hint}</p>
                    </div>
                )}

                {/* Construction Area */}
                <div className="min-h-[120px] mb-8 flex flex-wrap justify-center gap-4 items-center bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all duration-300">
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
                            disabled={status === 'success'}
                        />
                    ))}

                    {/* Ghost Slot */}
                    {status === 'playing' && placedWords.length < currentQuestion.words.length && (
                        <div className="w-4 h-4 rounded-full bg-slate-200 animate-bounce delay-100 opacity-50" />
                    )}
                </div>

                {/* Word Bank */}
                <div className="mb-8 min-h-[60px]">
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

                {/* Explanation Section */}
                {showExplanation && (
                    <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-2xl animate-fadeIn">
                        <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" /> Nice Work!
                        </h3>

                        {/* Solution Display */}
                        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm mb-4">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Correct Sentence</p>
                            <p className="text-2xl font-black text-indigo-600">{currentQuestion.solutionText}</p>
                        </div>

                        <p className="text-indigo-800 leading-relaxed text-sm md:text-base">{currentQuestion.explanation}</p>
                    </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    {/* Secondary Actions */}
                    {status !== 'success' && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="px-4 py-2 text-slate-500 font-semibold hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors text-sm"
                            >
                                {showHint ? "ヒントを隠す" : "ヒントを見る"}
                            </button>
                            <button
                                onClick={handleGiveUp}
                                className="px-4 py-2 text-slate-400 font-semibold hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                            >
                                答えを見る
                            </button>
                        </div>
                    )}

                    {status === 'error' && !showExplanation && (
                        <div className="text-red-500 font-bold animate-shake px-4">
                            Incorrect order. Try again!
                        </div>
                    )}

                    {status === 'success' ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all"
                        >
                            <span>
                                {currentQuestionIndex < currentLevel.questions.length - 1 ? "Next Question" :
                                    (levelIndex < levels.length - 1 ? "Complete Level" : "Finish Course")}
                            </span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={checkAnswer}
                            disabled={placedWords.length === 0}
                            className={clsx(
                                "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ml-0 md:ml-auto",
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
