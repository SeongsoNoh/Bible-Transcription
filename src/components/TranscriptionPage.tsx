import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Edit3,
  BookOpen,
} from "lucide-react";
import { getVerseText, getChapterVerses, getNextVerse } from "../data/bible";
import {
  saveProgress,
  getProgress,
  getLastProgressForChapter,
} from "../utils/storage";
import BookSelector from "./BookSelector";

const TranscriptionPage: React.FC = () => {
  const { lang, book, chapter } = useParams<{
    lang: string;
    book: string;
    chapter: string;
  }>();

  const [currentVerse, setCurrentVerse] = useState("1");
  const [userInput, setUserInput] = useState("");
  const [status, setStatus] = useState<
    "idle" | "typing" | "correct" | "incorrect"
  >("idle");
  const navigate = useNavigate();

  const verses = getChapterVerses(
    lang || "en",
    book || "Genesis",
    chapter || "1"
  );
  const originalText = getVerseText(
    lang || "en",
    book || "Genesis",
    chapter || "1",
    currentVerse
  );

  useEffect(() => {
    if (lang && book && chapter) {
      // 마지막으로 필사한 구절의 다음 구절로 이동
      const lastCompletedVerse = getLastProgressForChapter(lang, book, chapter);
      if (lastCompletedVerse) {
        const verses = getChapterVerses(lang, book, chapter);
        const lastIndex = verses.indexOf(lastCompletedVerse);
        if (lastIndex < verses.length - 1) {
          setCurrentVerse(verses[lastIndex + 1]);
        } else {
          // 마지막 구절을 완료했다면 첫 번째 구절로
          setCurrentVerse("1");
        }
      } else {
        setCurrentVerse("1");
      }
    }
  }, [lang, book, chapter]);

  useEffect(() => {
    if (lang && book && chapter) {
      const saved = getProgress(lang, book, chapter, currentVerse);
      if (saved) {
        setUserInput(saved.userInput);
        setStatus(saved.completed ? "correct" : "idle");
      } else {
        setUserInput("");
        setStatus("idle");
      }
    }
  }, [lang, book, chapter, currentVerse]);

  const handleInputChange = (value: string) => {
    setUserInput(value);

    if (!lang || !book || !chapter) return;

    if (value === "") {
      setStatus("idle");
      return;
    }

    if (originalText.startsWith(value)) {
      if (value === originalText) {
        setStatus("correct");
        saveProgress(lang, book, chapter, currentVerse, value, true);
      } else {
        setStatus("typing");
        saveProgress(lang, book, chapter, currentVerse, value, false);
      }
    } else {
      setStatus("incorrect");
      saveProgress(lang, book, chapter, currentVerse, value, false);
    }
  };

  const goToNextVerse = () => {
    const currentIndex = verses.indexOf(currentVerse);
    if (currentIndex < verses.length - 1) {
      setCurrentVerse(verses[currentIndex + 1]);
    } else {
      // Move to next chapter/book
      const nextLocation = getNextVerse(
        lang || "en",
        book || "Genesis",
        chapter || "1",
        currentVerse
      );
      if (nextLocation) {
        navigate(`/write/${lang}/${nextLocation.book}/${nextLocation.chapter}`);
      }
    }
  };

  const goToPrevVerse = () => {
    const currentIndex = verses.indexOf(currentVerse);
    if (currentIndex > 0) {
      setCurrentVerse(verses[currentIndex - 1]);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "correct":
        return {
          icon: CheckCircle,
          text: "✅ 맞게 입력했습니다!",
          color: "text-emerald-600",
        };
      case "typing":
        return {
          icon: Edit3,
          text: "⌨️ 계속 입력 중...",
          color: "text-blue-600",
        };
      case "incorrect":
        return { icon: XCircle, text: "❌ 틀렸습니다!", color: "text-red-600" };
      default:
        return {
          icon: Edit3,
          text: "입력을 시작해보세요",
          color: "text-slate-500",
        };
    }
  };

  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>홈으로 돌아가기</span>
        </Link>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            {book} {chapter}장
          </h1>
          <p className="text-sm text-slate-600">
            {currentVerse}절 / {verses.length}절
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <BookSelector
            currentLang={lang || "en"}
            currentBook={book || "Genesis"}
            currentChapter={chapter || "1"}
          />
          <Link
            to="/progress"
            className="text-slate-600 hover:text-blue-600 transition-colors"
          >
            진행률 보기
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>원문</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="text-lg leading-relaxed text-slate-700 font-medium">
                <span className="text-blue-600 font-bold">{currentVerse}.</span>{" "}
                {originalText}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevVerse}
              disabled={verses.indexOf(currentVerse) === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>이전 절</span>
            </button>

            <div className="text-sm text-slate-500">
              {verses.indexOf(currentVerse) + 1} / {verses.length}
            </div>

            <button
              onClick={goToNextVerse}
              disabled={verses.indexOf(currentVerse) === verses.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              <span>다음 절</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-emerald-600" />
                <span>필사</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="w-full h-48 p-4 text-lg leading-relaxed border-2 rounded-xl transition-all duration-200 focus-within:border-blue-400 bg-white">
                  <div className="relative">
                    <div className="text-slate-400">
                      <span className="text-blue-400 font-bold">
                        {currentVerse}.
                      </span>{" "}
                      {originalText.split("").map((char, index) => {
                        const userChar = userInput[index];
                        let charClass = "text-slate-400";

                        if (userChar !== undefined) {
                          if (userChar === char) {
                            charClass = "text-emerald-600 font-semibold";
                          } else {
                            charClass = "text-red-600 font-semibold bg-red-100";
                          }
                        }

                        return (
                          <span key={index} className={charClass}>
                            {userChar !== undefined ? userChar : char}
                          </span>
                        );
                      })}
                      {userInput.length < originalText.length && (
                        <span className="inline-block w-0.5 h-6 bg-blue-500 animate-pulse ml-1"></span>
                      )}
                    </div>
                    <input
                      value={userInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center justify-center space-x-3 p-4 rounded-xl transition-all duration-200 ${
              status === "correct"
                ? "bg-emerald-100 border border-emerald-200"
                : status === "incorrect"
                ? "bg-red-100 border border-red-200"
                : status === "typing"
                ? "bg-blue-100 border border-blue-200"
                : "bg-slate-100 border border-slate-200"
            }`}
          >
            <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
            <span className={`font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>

          {status === "correct" && (
            <div className="text-center">
              <button
                onClick={goToNextVerse}
                disabled={verses.indexOf(currentVerse) === verses.length - 1}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>다음 절로 이동</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPage;
