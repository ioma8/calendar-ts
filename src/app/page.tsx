import CalendarForm from '@/components/CalendarForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Český Plánovací Kalendář A4 na šířku
          </h1>
          <p className="text-gray-600 text-lg">
            Generátor českých měsíčních plánovacích kalendářů ve formátu PDF. 
            Ideální pro tisk a osobní použití.
          </p>
        </header>

        <div className="flex justify-center mb-12">
          <CalendarForm />
        </div>

        <footer className="text-center text-gray-500">
          <p>Vytvořil: Jakub Kolčář</p>
          <a 
            href="https://github.com/ioma8/czech-calendar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            GitHub Repository
          </a>
        </footer>
      </div>
    </div>
  );
}
