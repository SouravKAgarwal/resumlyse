import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { DialogProvider } from "./context/DialogContext";
import { ToastProvider } from "./context/ToastContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { UploadPage } from "./pages/UploadPage";
import { AnalysisPage } from "./pages/AnalysisPage";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

const DocsPage = lazy(() =>
  import("./pages/DocsPage").then((m) => ({ default: m.DocsPage })),
);

function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isDocsPage = location.pathname === "/docs";
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#121212] text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-stone-200 dark:selection:bg-stone-800 transition-colors duration-150">
      {/* Top Bar with logo and history trigger */}
      <Navbar />

      {/* Page Routes */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route
            path="/docs"
            element={
              <Suspense
                fallback={
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="inline-block w-8 h-8 border-2 border-stone-300 dark:border-stone-700 border-t-stone-800 dark:border-t-stone-200 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                      Loading documentation...
                    </p>
                  </div>
                }
              >
                <DocsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer & Disclaimer rendered only on Home page */}
      {isHomePage && <Footer />}
      {isDocsPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <DialogProvider>
          <ToastProvider>
            <AppLayout />
          </ToastProvider>
        </DialogProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
