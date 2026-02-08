import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { SearchPage } from './pages/SearchPage';
import { MyListPage } from './pages/MyListPage';
import { MovieDetailPage } from './pages/MovieDetailPage';
import Lenis from '@studio-freight/lenis';
import './App.css';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <WatchlistProvider>
          <HashRouter>
            <div className="App min-h-screen">
              <Navbar 
                onSearchClick={() => setSearchModalOpen(true)}
                onAuthClick={() => setAuthModalOpen(true)}
              />
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/my-list" element={<MyListPage />} />
                <Route path="/detail/:mediaType/:id" element={<MovieDetailPage />} />
              </Routes>

              <AuthModal 
                isOpen={authModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
              />
              <SearchModal 
                isOpen={searchModalOpen} 
                onClose={() => setSearchModalOpen(false)} 
              />
            </div>
          </HashRouter>
        </WatchlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
