import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, ArrowRight } from 'lucide-react';
import { bookNames, getBookChapters } from '../data/bible';

interface BookSelectorProps {
  currentLang: string;
  currentBook: string;
  currentChapter: string;
}

const BookSelector: React.FC<BookSelectorProps> = ({ currentLang, currentBook, currentChapter }) => {
  const [selectedLang, setSelectedLang] = useState(currentLang);
  const [selectedBook, setSelectedBook] = useState(currentBook);
  const [selectedChapter, setSelectedChapter] = useState(currentChapter);
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();

  const books = bookNames[selectedLang as keyof typeof bookNames] || [];
  const chapters = getBookChapters(selectedLang, selectedBook);

  const handleNavigate = () => {
    navigate(`/write/${selectedLang}/${selectedBook}/${selectedChapter}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <BookOpen className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-slate-700">성경 선택</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">성경 선택</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">언어</label>
                <select
                  value={selectedLang}
                  onChange={(e) => {
                    setSelectedLang(e.target.value);
                    const newBooks = bookNames[e.target.value as keyof typeof bookNames];
                    if (newBooks && newBooks.length > 0) {
                      setSelectedBook(newBooks[0]);
                      const newChapters = getBookChapters(e.target.value, newBooks[0]);
                      if (newChapters.length > 0) {
                        setSelectedChapter(newChapters[0]);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">성경</label>
                <select
                  value={selectedBook}
                  onChange={(e) => {
                    setSelectedBook(e.target.value);
                    const newChapters = getBookChapters(selectedLang, e.target.value);
                    if (newChapters.length > 0) {
                      setSelectedChapter(newChapters[0]);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {books.map((book) => (
                    <option key={book} value={book}>{book}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">장</label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {chapters.map((chapter) => (
                    <option key={chapter} value={chapter}>{chapter}장</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleNavigate}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSelector;