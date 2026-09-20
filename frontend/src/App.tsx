import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DialogProvider } from './context/DialogContext';
import { HistoryProvider } from './context/HistoryContext';
import { Navbar } from './components/Navbar';
import { HistoryDrawer } from './components/HistoryDrawer';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { AnalysisPage } from './pages/AnalysisPage';

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-stone-900 flex flex-col font-sans selection:bg-stone-200">
      {/* Top Bar with logo and history trigger */}
      <Navbar />

      {/* Slide-over Drawer for past analyses */}
      <HistoryDrawer />

      {/* Page Routes */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis/:id" element={<AnalysisPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer & Disclaimer rendered only on Home page */}
      {isHomePage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DialogProvider>
        <HistoryProvider>
          <AppLayout />
        </HistoryProvider>
      </DialogProvider>
    </BrowserRouter>
  );
}

export default App;
