import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Have questions or feedback? We'd love to hear from you. Fill out the form or reach us directly.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Email</h3>
                <p className="text-slate-600 dark:text-slate-400">support@quizwoiz.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Phone</h3>
                <p className="text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
              </div>
            </div>
             <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Office</h3>
                <p className="text-slate-600 dark:text-slate-400">123 AI Boulevard, Tech City, CA 90210</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input type="text" className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Feature Request" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Your message here..."></textarea>
            </div>
            <button type="button" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;