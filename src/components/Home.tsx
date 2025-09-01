import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Languages, ArrowRight } from "lucide-react";
import { getLastProgress } from "../utils/storage";
import { getNextVerse } from "../data/bible";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const lastProgress = getLastProgress();

  const handleResumeProgress = () => {
    if (lastProgress) {
      // 마지막으로 필사한 구절의 다음 구절로 이동
      const nextLocation = getNextVerse(
        lastProgress.lang,
        lastProgress.book,
        lastProgress.chapter,
        lastProgress.verse
      );
      if (nextLocation) {
        navigate(
          `/write/${lastProgress.lang}/${nextLocation.book}/${nextLocation.chapter}`
        );
      } else {
        // 다음 구절이 없다면 현재 챕터로 이동 (TranscriptionPage에서 자동으로 마지막 진행 위치로 이동)
        navigate(
          `/write/${lastProgress.lang}/${lastProgress.book}/${lastProgress.chapter}`
        );
      }
    }
  };

  return (
    <div className="text-center space-y-12">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-blue-100 rounded-full">
            <BookOpen className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
            📖 성경 필사
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            성경을 직접 필사하며 말씀을 마음에 새겨보세요. 타이핑하면서
            자연스럽게 암송할 수 있습니다.
          </p>
        </div>
      </div>

      {lastProgress && (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 rounded-2xl border border-blue-200 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">
              📚 이어서 필사하기
            </h3>
            <p className="text-slate-600">
              마지막으로 필사한 곳:{" "}
              <span className="font-medium">
                {lastProgress.book} {lastProgress.chapter}:{lastProgress.verse}
              </span>
            </p>
            <button
              onClick={handleResumeProgress}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <BookOpen className="h-4 w-4" />
              <span>이어서 필사하기</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link
          to="/write/en/Genesis/1"
          className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Languages className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                English Bible
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Start transcribing the English Bible (KJV)
              </p>
            </div>

            <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 transition-colors">
              <span className="font-medium">Start Writing</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        <Link
          to="/write/ko/창세기/1"
          className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-blue-300"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
                <Languages className="h-8 w-8 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                한국어 성경
              </h3>
              <p className="text-slate-600 leading-relaxed">
                한국어 성경 필사를 시작해보세요 (개역개정)
              </p>
            </div>

            <div className="flex items-center justify-center text-emerald-600 group-hover:text-emerald-700 transition-colors">
              <span className="font-medium">필사 시작</span>
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200 max-w-3xl mx-auto">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-800">필사의 유익</h4>
            <p className="text-slate-600 leading-relaxed">
              손으로 쓰며 말씀을 묵상하는 것처럼, 타이핑하며 성경을 필사하면
              말씀이 마음에 더 깊이 새겨집니다. 정확하게 입력해야 하므로
              자연스럽게 집중하게 되고, 반복을 통해 암송 효과도 얻을 수
              있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
