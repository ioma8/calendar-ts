'use client';

import { useState } from 'react';
import { CZECH_MONTHS } from '@/lib/calendar';

export default function CalendarTables() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const nextYear = currentYear + 1;
  
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const downloadCalendar = async (month: number, year: number) => {
    const key = `${year}-${month}`;
    setLoadingStates(prev => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/generate?month=${month}&year=${year}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate calendar');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `kalendar_${year}-${month.toString().padStart(2, '0')}.pdf`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading calendar:', err);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const MonthButton = ({ month, year, isCurrent = false }: { month: number; year: number; isCurrent?: boolean }) => {
    const key = `${year}-${month}`;
    const isLoading = loadingStates[key];

    return (
      <button
        onClick={() => downloadCalendar(month, year)}
        disabled={isLoading}
        className={`
          group relative p-4 rounded-2xl border transition-all duration-200 text-left w-full
          ${isCurrent 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-500/25' 
            : 'bg-white/60 hover:bg-white/80 border-slate-200 hover:border-blue-300 hover:shadow-lg'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-semibold text-lg ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
              {CZECH_MONTHS[month - 1]}
            </h3>
            <p className={`text-sm ${isCurrent ? 'text-blue-100' : 'text-slate-500'}`}>
              {month}/{year}
            </p>
          </div>
          
          <div className={`
            w-8 h-8 rounded-xl flex items-center justify-center transition-all
            ${isCurrent 
              ? 'bg-white/20 text-white' 
              : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
            }
          `}>
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>
        </div>

        {isCurrent && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-amber-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Rychlé Stažení
        </h2>
        <p className="text-slate-600 text-lg">
          Klikněte na libovolný měsíc pro okamžité stažení kalendáře
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Current Year */}
        <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{currentYear.toString().slice(-2)}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                {currentYear}
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                Aktuální
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MonthButton
                key={`${currentYear}-${month}`}
                month={month}
                year={currentYear}
                isCurrent={month === currentMonth}
              />
            ))}
          </div>
        </div>

        {/* Next Year */}
        <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">{nextYear.toString().slice(-2)}</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">
                {nextYear}
              </h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                Následující
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <MonthButton
                key={`${nextYear}-${month}`}
                month={month}
                year={nextYear}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
