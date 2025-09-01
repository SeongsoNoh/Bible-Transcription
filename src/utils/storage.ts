export interface TranscriptionProgress {
  completed: boolean;
  userInput: string;
  completedAt?: string;
}

export const getStorageKey = (
  lang: string,
  book: string,
  chapter: string,
  verse: string
): string => {
  return `${lang}_${book}_${chapter}_${verse}`;
};

export const saveProgress = (
  lang: string,
  book: string,
  chapter: string,
  verse: string,
  input: string,
  completed: boolean = false
) => {
  const key = getStorageKey(lang, book, chapter, verse);
  const progress: TranscriptionProgress = {
    completed,
    userInput: input,
    completedAt: completed ? new Date().toISOString() : undefined,
  };
  localStorage.setItem(key, JSON.stringify(progress));
};

export const getProgress = (
  lang: string,
  book: string,
  chapter: string,
  verse: string
): TranscriptionProgress | null => {
  const key = getStorageKey(lang, book, chapter, verse);
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
};

export const getAllProgress = (): { [key: string]: TranscriptionProgress } => {
  const progress: { [key: string]: TranscriptionProgress } = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("en_") || key.startsWith("ko_"))) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          progress[key] = JSON.parse(value);
        } catch {
          // Skip invalid entries
        }
      }
    }
  }

  return progress;
};

export const getCompletedCount = (): number => {
  const allProgress = getAllProgress();
  return Object.values(allProgress).filter((p) => p.completed).length;
};

export const getTotalVersesCount = (): number => {
  const allProgress = getAllProgress();
  return Object.keys(allProgress).length;
};

export const getLastProgress = (): {
  lang: string;
  book: string;
  chapter: string;
  verse: string;
} | null => {
  const allProgress = getAllProgress();
  const completed = Object.entries(allProgress)
    .filter(([, progress]) => progress.completedAt)
    .sort(
      (a, b) =>
        new Date(b[1].completedAt!).getTime() -
        new Date(a[1].completedAt!).getTime()
    );

  if (completed.length > 0) {
    const [key] = completed[0];
    const [lang, book, chapter, verse] = key.split("_");
    return { lang, book, chapter, verse };
  }

  return null;
};

export const getLastProgressForChapter = (
  lang: string,
  book: string,
  chapter: string
): string | null => {
  const allProgress = getAllProgress();
  const chapterProgress = Object.entries(allProgress)
    .filter(([key, progress]) => {
      const [progressLang, progressBook, progressChapter] = key.split("_");
      return (
        progressLang === lang &&
        progressBook === book &&
        progressChapter === chapter &&
        progress.completedAt
      );
    })
    .sort(
      (a, b) =>
        new Date(b[1].completedAt!).getTime() -
        new Date(a[1].completedAt!).getTime()
    );

  if (chapterProgress.length > 0) {
    const [key] = chapterProgress[0];
    const [, , , verse] = key.split("_");
    return verse;
  }

  return null;
};
