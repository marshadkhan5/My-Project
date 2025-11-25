import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { generateQuizQuestions } from '../services/geminiService';
import { InputType, Question } from '../types';
import { Upload, Type, FileText, Loader2, Save, Copy, Download, RefreshCw, AlertCircle, Brain, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { jsPDF } from 'jspdf';

const QuizBuilder: React.FC = () => {
  const { settings } = useTheme();
  
  // State
  const [inputType, setInputType] = useState<InputType>(InputType.TOPIC);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [category, setCategory] = useState(settings.categories[0]);
  const [count, setCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  
  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    
    // Validation
    if (inputType === InputType.TOPIC && !inputText.trim()) {
      setError("Please enter a topic.");
      setIsGenerating(false);
      return;
    }
    if (inputType === InputType.TEXT && !inputText.trim()) {
      setError("Please paste some text.");
      setIsGenerating(false);
      return;
    }
    if (inputType === InputType.FILE && !selectedFile) {
      setError("Please upload a file.");
      setIsGenerating(false);
      return;
    }

    try {
      let fileBase64 = undefined;
      let fileMimeType = undefined;

      if (inputType === InputType.FILE && filePreview && selectedFile) {
         // Extract base64 content, removing the data URL prefix
         fileBase64 = filePreview.split(',')[1];
         fileMimeType = selectedFile.type;
      }

      const questions = await generateQuizQuestions({
        type: inputType,
        content: inputText,
        count,
        category,
        fileBase64,
        fileMimeType
      });

      if (questions.length === 0) {
        setError("AI returned no questions. Please try different content.");
      } else {
        setGeneratedQuestions(questions);
        setUserAnswers({});
        setShowResults(true);
      }
    } catch (err) {
      setError("Failed to generate quiz. Please check your connection or input.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (userAnswers[questionIndex] !== undefined) return; // Prevent changing answer
    setUserAnswers(prev => ({ ...prev, [questionIndex]: option }));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("QuizWoiz Generated Quiz", 10, 10);
    
    doc.setFontSize(12);
    let y = 30;

    generatedQuestions.forEach((q, i) => {
      if (y > 270) { doc.addPage(); y = 20; }
      
      const splitQuestion = doc.splitTextToSize(`${i + 1}. ${q.questionText}`, 180);
      doc.text(splitQuestion, 10, y);
      y += (splitQuestion.length * 7) + 5;

      q.options.forEach((opt, oi) => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(`   ${String.fromCharCode(65 + oi)}. ${opt}`, 10, y);
        y += 7;
      });

      y += 5; // Spacing
    });
    
    // Answer Key
    doc.addPage();
    doc.text("Answer Key", 10, 10);
    y = 20;
    generatedQuestions.forEach((q, i) => {
       doc.text(`${i + 1}. ${q.correctAnswer}`, 10, y);
       y += 7;
    });

    doc.save("quiz.pdf");
  };

  const copyToClipboard = () => {
    const text = generatedQuestions.map((q, i) => {
      return `${i + 1}. ${q.questionText}\n${q.options.map(o => `- ${o}`).join('\n')}\nAnswer: ${q.correctAnswer}`;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
    alert("Quiz copied to clipboard!");
  };

  // Score Calculation
  const totalQuestions = generatedQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const isQuizComplete = totalQuestions > 0 && answeredCount === totalQuestions;
  
  const correctCount = generatedQuestions.reduce((acc, q, i) => {
    return acc + (userAnswers[i] === q.correctAnswer ? 1 : 0);
  }, 0);
  
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Auto-scroll to results when done (optional UX enhancement)
  useEffect(() => {
    if (isQuizComplete && resultsEndRef.current) {
      resultsEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isQuizComplete]);

  if (showResults) {
    return (
      <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Generated Quiz</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowResults(false)} className="px-4 py-2 text-sm rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2">
              <RefreshCw size={16} /> New Quiz
            </button>
            <button onClick={downloadPDF} className="px-4 py-2 text-sm rounded bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Download size={16} /> PDF
            </button>
            <button onClick={copyToClipboard} className="px-4 py-2 text-sm rounded bg-secondary text-white hover:bg-secondary/90 transition-colors flex items-center gap-2">
              <Copy size={16} /> Copy
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>

        <div className="space-y-6">
          {generatedQuestions.map((q, i) => {
            const userAnswer = userAnswers[i];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  <span className="text-primary mr-2">{i + 1}.</span>{q.questionText}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, idx) => {
                    let containerClass = "p-3 rounded-lg border flex items-center justify-between transition-all cursor-pointer ";
                    
                    if (isAnswered) {
                      if (opt === q.correctAnswer) {
                        containerClass += "bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-600";
                      } else if (opt === userAnswer) {
                        containerClass += "bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-600";
                      } else {
                        containerClass += "bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-900 dark:border-slate-700";
                      }
                    } else {
                      containerClass += "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-primary/50 dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800";
                    }

                    return (
                      <div key={idx} onClick={() => handleOptionSelect(i, opt)} className={containerClass}>
                        <div className="flex items-center">
                          <span className={`font-bold mr-3 w-6 h-6 flex items-center justify-center rounded-full text-xs ${
                            isAnswered && (opt === q.correctAnswer || opt === userAnswer) 
                              ? 'bg-white/50 text-black dark:text-white' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className={
                            isAnswered && (opt === q.correctAnswer) ? 'font-medium text-green-900 dark:text-green-100' :
                            isAnswered && (opt === userAnswer) ? 'font-medium text-red-900 dark:text-red-100' :
                            'text-slate-700 dark:text-slate-300'
                          }>{opt}</span>
                        </div>
                        {isAnswered && opt === q.correctAnswer && <CheckCircle size={18} className="text-green-600 dark:text-green-400" />}
                        {isAnswered && opt === userAnswer && opt !== q.correctAnswer && <XCircle size={18} className="text-red-600 dark:text-red-400" />}
                      </div>
                    );
                  })}
                </div>
                {isAnswered && (
                  <div className={`mt-4 p-4 rounded-lg animate-fade-in ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {isCorrect ? <CheckCircle size={20} className="text-green-600 dark:text-green-400" /> : <XCircle size={20} className="text-red-600 dark:text-red-400" />}
                      </div>
                      <div>
                        <p className={`font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                          {isCorrect ? "Correct Answer!" : "Incorrect"}
                        </p>
                        {!isCorrect && (
                          <p className="text-slate-700 dark:text-slate-300 mt-1">
                            The correct answer is: <span className="font-semibold">{q.correctAnswer}</span>
                          </p>
                        )}
                        {q.explanation && (
                          <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2">
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Summary at the end */}
        {isQuizComplete && (
           <div ref={resultsEndRef} className="mt-12 p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center animate-fade-in ring-2 ring-primary/20">
             <div className="mb-4 inline-flex p-5 rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 shadow-sm">
                <Trophy size={48} />
             </div>
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Quiz Completed!</h2>
             
             <div className="flex items-center justify-center gap-2 mb-2">
               <span className="text-4xl font-extrabold text-primary">{scorePercentage}%</span>
             </div>
             
             <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
               You answered <span className="font-bold text-slate-900 dark:text-white">{correctCount}</span> out of <span className="font-bold text-slate-900 dark:text-white">{totalQuestions}</span> questions correctly.
               {scorePercentage >= 80 ? " Excellent work!" : scorePercentage >= 50 ? " Good effort!" : " Keep practicing!"}
             </p>
             
             <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                 Review Answers
               </button>
               <button onClick={() => { setShowResults(false); setInputText(""); setUserAnswers({}); }} className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/25">
                 Create New Quiz
               </button>
             </div>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Create New Quiz</h1>
        <p className="text-slate-600 dark:text-slate-400">Choose your source, configure settings, and generate.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Input Type Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {[
            { id: InputType.TOPIC, icon: <Type size={18} />, label: "Topic" },
            { id: InputType.TEXT, icon: <FileText size={18} />, label: "Text" },
            { id: InputType.FILE, icon: <Upload size={18} />, label: "File Upload" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setInputType(type.id)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                inputType === type.id
                  ? 'bg-primary/5 text-primary border-b-2 border-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* Input Area */}
          <div className="mb-8">
            {inputType === InputType.TOPIC && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Enter a topic
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. The French Revolution, Quantum Physics, 1990s Pop Music..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            )}
            
            {inputType === InputType.TEXT && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Paste your text
                </label>
                <textarea
                  rows={8}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste article text, notes, or documentation here..."
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            )}

            {inputType === InputType.FILE && (
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                   <Upload size={48} className="text-slate-400 mb-4" />
                   <span className="text-lg font-medium text-slate-700 dark:text-slate-200">
                     {selectedFile ? selectedFile.name : "Click to upload file"}
                   </span>
                   <span className="text-sm text-slate-500 mt-2">
                     Supports PDF, DOCX, TXT, Images
                   </span>
                </label>
              </div>
            )}
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
              >
                {settings.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Number of MCQs
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none"
              >
                {[5, 10, 15, 20].map((num) => (
                  <option key={num} value={num}>{num} Questions</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:shadow-primary/25'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={24} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Brain size={24} /> Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;