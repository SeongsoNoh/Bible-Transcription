import convertedBibleData from "./convertedBibleData.json";
import kjvData from "./kjv.json";

export interface BibleData {
  [language: string]: {
    [book: string]: {
      [chapter: string]: {
        [verse: string]: string;
      };
    };
  };
}

// KJV 데이터 타입 정의
interface KjvBook {
  name: string;
  chapters: Array<{
    chapter: number;
    verses: Array<{
      verse: number;
      text: string;
    }>;
  }>;
}

interface KjvData {
  books?: KjvBook[];
  [key: string]: any;
}

// KJV 데이터 처리 함수
function processKjvData(): { [book: string]: { [chapter: string]: { [verse: string]: string } } } {
  const processedData: { [book: string]: { [chapter: string]: { [verse: string]: string } } } = {};
  const kjv = kjvData as any;
  
  // KJV JSON이 verses 배열을 가지고 있는 경우 (실제 구조)
  if (kjv.verses && Array.isArray(kjv.verses)) {
    kjv.verses.forEach((verse: any) => {
      const book = verse.book_name;
      const chapter = verse.chapter?.toString();
      const verseNum = verse.verse?.toString();
      const text = verse.text;
      
      if (book && chapter && verseNum && text) {
        if (!processedData[book]) {
          processedData[book] = {};
        }
        if (!processedData[book][chapter]) {
          processedData[book][chapter] = {};
        }
        processedData[book][chapter][verseNum] = text;
      }
    });
  }
  // KJV JSON이 books 배열을 가지고 있는 경우
  else if (kjv.books && Array.isArray(kjv.books)) {
    kjv.books.forEach((book: KjvBook) => {
      const bookName = book.name;
      processedData[bookName] = {};
      
      if (book.chapters && Array.isArray(book.chapters)) {
        book.chapters.forEach((chapter) => {
          const chapterNum = chapter.chapter.toString();
          processedData[bookName][chapterNum] = {};
          
          if (chapter.verses && Array.isArray(chapter.verses)) {
            chapter.verses.forEach((verse) => {
              const verseNum = verse.verse.toString();
              processedData[bookName][chapterNum][verseNum] = verse.text;
            });
          }
        });
      }
    });
  }
  
  // 만약 KJV 데이터가 비어있거나 다른 구조라면 기본 영어 성경 데이터 사용
  if (Object.keys(processedData).length === 0) {
    processedData["Genesis"] = {
      "1": {
        "1": "In the beginning God created the heaven and the earth.",
        "2": "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        "3": "And God said, Let there be light: and there was light.",
        "4": "And God saw the light, that it was good: and God divided the light from the darkness.",
        "5": "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day."
      }
    };
    
    processedData["John"] = {
      "1": {
        "1": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "2": "The same was in the beginning with God.",
        "3": "All things were made by him; and without him was not any thing made that was made.",
        "4": "In him was life; and the life was the light of men.",
        "5": "And the light shineth in darkness; and the darkness comprehended it not."
      }
    };
  }
  
  return processedData;
}

// JSON 데이터를 타입 안전하게 변환
const convertedData = convertedBibleData as BibleData;
const englishBibleData = processKjvData();

export const bibleData: BibleData = {
  en: englishBibleData,
  ko: convertedData.ko,
};

export const bookNames = {
  en: Object.keys(englishBibleData),
  ko: Object.keys(convertedData.ko),
};

export const getBookChapters = (lang: string, book: string): string[] => {
  return Object.keys(bibleData[lang]?.[book] || {});
};

export const getChapterVerses = (
  lang: string,
  book: string,
  chapter: string
): string[] => {
  return Object.keys(bibleData[lang]?.[book]?.[chapter] || {});
};

export const getVerseText = (
  lang: string,
  book: string,
  chapter: string,
  verse: string
): string => {
  return bibleData[lang]?.[book]?.[chapter]?.[verse] || "";
};

export const getNextVerse = (
  lang: string,
  book: string,
  chapter: string,
  verse: string
): { book: string; chapter: string; verse: string } | null => {
  const verses = getChapterVerses(lang, book, chapter);
  const currentIndex = verses.indexOf(verse);

  if (currentIndex < verses.length - 1) {
    return { book, chapter, verse: verses[currentIndex + 1] };
  }

  const chapters = getBookChapters(lang, book);
  const currentChapterIndex = chapters.indexOf(chapter);

  if (currentChapterIndex < chapters.length - 1) {
    const nextChapter = chapters[currentChapterIndex + 1];
    const nextChapterVerses = getChapterVerses(lang, book, nextChapter);
    return { book, chapter: nextChapter, verse: nextChapterVerses[0] };
  }

  const books = bookNames[lang as keyof typeof bookNames];
  const currentBookIndex = books.indexOf(book);

  if (currentBookIndex < books.length - 1) {
    const nextBook = books[currentBookIndex + 1];
    const nextBookChapters = getBookChapters(lang, nextBook);
    const nextBookVerses = getChapterVerses(
      lang,
      nextBook,
      nextBookChapters[0]
    );
    return {
      book: nextBook,
      chapter: nextBookChapters[0],
      verse: nextBookVerses[0],
    };
  }

  return null;
};
