import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight, CheckCircle, Zap, FileText, Download } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '../constants';

const Home: React.FC = () => {
  const { settings } = useTheme();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            AI-Powered Quiz Generation
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8">
            Build Quizzes <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Instantly & Effortlessly
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10">
            Turn any text, topic, or file into a professional multiple-choice quiz in seconds. Perfect for teachers, students, and businesses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/create"
              className="px-8 py-4 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
            >
              Create a Quiz <ArrowRight size={20} />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
          <div className="absolute top-[30%] right-[20%] w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400">Three simple steps to generate comprehensive assessments.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <FileText size={40} />, title: "Input Content", desc: "Type a topic, paste text, or upload a PDF/Image." },
              { icon: <Zap size={40} />, title: "AI Generation", desc: "Our advanced AI analyzes the content and crafts perfect MCQs." },
              { icon: <Download size={40} />, title: "Export & Share", desc: "Download as PDF, copy text, or save to your dashboard." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Popular Categories</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {settings.categories.slice(0, 8).map((cat) => (
              <Link to="/create" key={cat} className="px-6 py-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary transition-colors text-slate-700 dark:text-slate-200 font-medium">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary/5 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;