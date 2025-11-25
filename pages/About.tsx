import React from 'react';
import { CheckCircle } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">About QuizWoiz</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          We are on a mission to democratize education and assessment through Artificial Intelligence.
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert mx-auto mb-16">
        <p>
          QuizWoiz was born from a simple idea: generating quality educational content shouldn't take hours. 
          Whether you are a teacher preparing for a class, a student revising for finals, or a corporate trainer, 
          QuizWoiz provides the tools you need to create accurate, engaging quizzes in seconds.
        </p>
        <p>
          Leveraging the latest in generative AI technology, we process your raw inputs—be it a simple topic, 
          a pasted article, or a complex document—and transform them into structured learning materials.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-700">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Why Choose Us?</h3>
        <ul className="space-y-4">
          {[
            "Instant Generation: No more writer's block.",
            "Multi-Format Support: Text, PDF, Images.",
            "High Accuracy: Powered by advanced Gemini models.",
            "Complete Customization: You control the output.",
            "Privacy First: Your data is processed securely."
          ].map((item, i) => (
             <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <CheckCircle className="text-primary flex-shrink-0" size={20} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default About;