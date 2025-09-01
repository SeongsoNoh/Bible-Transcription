import convertedBibleData from "./convertedBibleData.json";

export interface BibleData {
  [language: string]: {
    [book: string]: {
      [chapter: string]: {
        [verse: string]: string;
      };
    };
  };
}

// JSON 데이터를 타입 안전하게 변환
const convertedData = convertedBibleData as BibleData;

export const bibleData: BibleData = {
  en: {
    Genesis: {
      "1": {
        "1": "In the beginning God created the heaven and the earth.",
        "2": "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
        "3": "And God said, Let there be light: and there was light.",
        "4": "And God saw the light, that it was good: and God divided the light from the darkness.",
        "5": "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
        "6": "And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.",
        "7": "And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.",
        "8": "And God called the firmament Heaven. And the evening and the morning were the second day.",
        "9": "And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.",
        "10": "And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.",
      },
      "2": {
        "1": "Thus the heavens and the earth were finished, and all the host of them.",
        "2": "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
        "3": "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.",
        "4": "These are the generations of the heavens and of the earth when they were created, in the day that the LORD God made the earth and the heavens.",
        "5": "And every plant of the field before it was in the earth, and every herb of the field before it grew: for the LORD God had not caused it to rain upon the earth, and there was not a man to till the ground.",
      },
    },
    John: {
      "1": {
        "1": "In the beginning was the Word, and the Word was with God, and the Word was God.",
        "2": "The same was in the beginning with God.",
        "3": "All things were made by him; and without him was not any thing made that was made.",
        "4": "In him was life; and the life was the light of men.",
        "5": "And the light shineth in darkness; and the darkness comprehended it not.",
      },
    },
  },
  ko: convertedData.ko,
};

export const bookNames = {
  en: ["Genesis", "John"],
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
