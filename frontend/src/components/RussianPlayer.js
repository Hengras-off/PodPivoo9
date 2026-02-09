import React, { useState } from 'react';
import { X, Loader2, AlertCircle, ExternalLink, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Плеер с русскими источниками для фильмов, сериалов и аниме
 * Поддерживает русскую озвучку и субтитры
 */
export const RussianPlayer = ({ imdbId, tmdbId, kinopoiskId, title, year, mediaType, onClose }) => {
  const [selectedSource, setSelectedSource] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Отладка - выводим ID в консоль
  console.log('RussianPlayer IDs:', {
    imdbId,
    tmdbId,
    kinopoiskId,
    mediaType,
    title
  });

  // Список проверенных рабочих источников
  // Используем плееры которые работают с TMDB ID для точности
  const sources = [
    {
      name: 'VidSrc Pro',
      getUrl: () => {
        if (tmdbId) {
          return `https://vidsrc.pro/embed/${mediaType}/${tmdbId}`;
        }
        return null;
      },
      description: 'Русская озвучка, работает с TMDB напрямую',
      icon: '🎬',
      quality: 'HD/Full HD'
    },
    {
      name: 'VidSrc.in',
      getUrl: () => {
        if (tmdbId) {
          return `https://vidsrc.in/embed/${mediaType}/${tmdbId}`;
        }
        return null;
      },
      description: 'Множество озвучек, субтитры',
      icon: '🇷🇺',
      quality: 'HD'
    },
    {
      name: 'VidSrc.cc',
      getUrl: () => {
        if (tmdbId) {
          return `https://vidsrc.cc/v2/embed/${mediaType}/${tmdbId}`;
        }
        return null;
      },
      description: 'Быстрая загрузка, русские субтитры',
      icon: '⚡',
      quality: 'HD/Full HD'
    },
    {
      name: 'Embed.su',
      getUrl: () => {
        if (tmdbId) {
          const type = mediaType === 'tv' ? 'tv' : 'movie';
          return `https://embed.su/embed/${type}/${tmdbId}`;
        }
        return null;
      },
      description: 'Стабильный источник с озвучкой',
      icon: '📺',
      quality: 'HD'
    },
    {
      name: 'VidSrc.net',
      getUrl: () => {
        if (tmdbId) {
          return `https://vidsrc.net/embed/${mediaType}/${tmdbId}`;
        } else if (imdbId) {
          return `https://vidsrc.net/embed/${mediaType}/${imdbId}`;
        }
        return null;
      },
      description: 'Альтернативная озвучка',
      icon: '🎥',
      quality: 'HD'
    },
    {
      name: 'Kodik (TMDB)',
      getUrl: () => {
        if (tmdbId) {
          return `https://kodik.info/search?title=${encodeURIComponent(title)}&year=${year}`;
        } else if (imdbId) {
          return `https://kodik.info/find-player?imdb_id=${imdbId}`;
        }
        return null;
      },
      description: 'Поиск по названию для точности',
      icon: '🔍',
      quality: 'HD/Full HD'
    }
  ];

  // Фильтруем доступные источники
  const availableSources = sources.filter(source => source.getUrl() !== null);

  // Сообщение если нет доступных источников
  if (availableSources.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-lg p-8 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold">Плееры недоступны</h3>
              <p className="text-muted-foreground">
                Для просмотра с русской озвучкой нужен Kinopoisk ID или IMDB ID.
                Попробуйте другой фильм.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-brand-primary hover:bg-brand-hover rounded-md transition-colors"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const currentSource = availableSources[selectedSource];
  const embedUrl = currentSource.getUrl();

  // Отладка URL
  console.log('Current player:', currentSource.name);
  console.log('Embed URL:', embedUrl);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
        data-testid="russian-player-modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-7xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Languages className="w-6 h-6 text-brand-primary" />
                <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-sm font-semibold">
                  Русская озвучка
                </span>
              </div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentSource.icon} {currentSource.name} - {currentSource.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Качество: {currentSource.quality}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              data-testid="close-player-button"
              aria-label="Закрыть плеер"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Source Selector */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              💡 Выберите озвучку / источник:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableSources.map((source, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedSource(index);
                    setLoading(true);
                    setError(false);
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedSource === index
                      ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(255,59,48,0.3)]'
                      : 'bg-white/10 hover:bg-white/20 border border-white/10'
                  }`}
                  data-testid={`source-button-${index}`}
                >
                  <span className="mr-2">{source.icon}</span>
                  {source.name}
                </button>
              ))}
            </div>
          </div>

          {/* Player Container */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl aspect-video">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin mx-auto text-brand-primary" />
                  <p className="text-muted-foreground">Загрузка плеера с русской озвучкой...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="text-center space-y-4 p-8">
                  <AlertCircle className="w-12 h-12 mx-auto text-yellow-500" />
                  <h3 className="text-lg font-semibold">Источник недоступен</h3>
                  <p className="text-sm text-muted-foreground">
                    Попробуйте другую озвучку выше
                  </p>
                </div>
              </div>
            )}

            {/* Iframe Player */}
            {embedUrl && (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                data-testid="player-iframe"
              />
            )}
          </div>

          {/* Info */}
          <div className="mt-4 text-sm space-y-2">
            <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Languages className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-primary mb-1">
                    Точный поиск по TMDB ID
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Плееры используют TMDB ID для точного соответствия. 
                    Если фильм все равно неправильный - попробуйте Kodik (поиск по названию).
                  </p>
                  <p className="text-xs text-brand-primary mt-2">
                    🎬 Сейчас ищем: <span className="font-semibold">{title} ({year})</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between flex-wrap gap-2 text-muted-foreground">
              <div className="text-xs space-x-2">
                <span>💡 Совет: Используйте Kodik или HDVB для лучшего качества</span>
                {imdbId && <span className="opacity-60">| IMDB: {imdbId}</span>}
                {kinopoiskId && <span className="opacity-60">| KP: {kinopoiskId}</span>}
              </div>
              {kinopoiskId && (
                <a
                  href={`https://www.kinopoisk.ru/film/${kinopoiskId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-brand-primary hover:underline text-xs"
                >
                  <span>Кинопоиск</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
