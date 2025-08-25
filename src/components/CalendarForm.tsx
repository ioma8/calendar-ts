'use client';

import { useState } from 'react';
import { CZECH_MONTHS } from '@/lib/calendar';

export default function CalendarForm() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/generate?month=${month}&year=${year}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Chyba při generování kalendáře');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `kalendar_${year}-${month.toString().padStart(2, '0')}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při generování kalendáře');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-slate-700 mb-2">
              Měsíc
            </label>
            <select
              id="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
            >
              {CZECH_MONTHS.map((monthName, index) => (
                <option key={index + 1} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-slate-700 mb-2">
              Rok
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="1900"
              max="2100"
              className="w-full p-3 bg-white/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-800"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generuji...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generovat PDF
                </div>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
