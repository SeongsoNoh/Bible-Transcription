import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Calendar, Award, CheckCircle } from 'lucide-react';
import { getAllProgress, getCompletedCount, getTotalVersesCount } from '../utils/storage';

const ProgressPage: React.FC = () => {
  const allProgress = getAllProgress();
  const completedCount = getCompletedCount();
  const totalCount = getTotalVersesCount();
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getRecentProgress = () => {
    const completed = Object.entries(allProgress)
      .filter(([_, progress]) => progress.completed && progress.completedAt)
      .sort((a, b) => new Date(b[1].completedAt!).getTime() - new Date(a[1].completedAt!).getTime())
      .slice(0, 5);
    
    return completed.map(([key, progress]) => {
      const [lang, book, chapter, verse] = key.split('_');
      return {
        key,
        lang,
        book,
        chapter,
        verse,
        completedAt: progress.completedAt!
      };
    });
  };

  const recentProgress = getRecentProgress();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">📊 필사 진행률</h1>
        <p className="text-slate-600">지금까지의 성경 필사 기록을 확인해보세요</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">완료된 절</p>
              <p className="text-3xl font-bold text-slate-800">{completedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">완성도</p>
              <p className="text-3xl font-bold text-slate-800">{completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">총 시도 절</p>
              <p className="text-3xl font-bold text-slate-800">{totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">전체 진행률</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">완료된 절</span>
                <span className="text-slate-800 font-medium">{completedCount} / {totalCount}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-center text-slate-600 text-sm">
                {completionRate === 100 ? '🎉 축하합니다! 모든 절을 완료했습니다!' : '계속해서 말씀을 필사해보세요!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {recentProgress.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>최근 완료한 절</span>
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProgress.map((item) => (
              <div key={item.key} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-800">
                        {item.book} {item.chapter}:{item.verse}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {item.lang === 'ko' ? '한국어' : 'English'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {new Date(item.completedAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalCount === 0 && (
        <div className="text-center space-y-6 py-12">
          <div className="p-4 bg-slate-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-slate-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-800">아직 필사를 시작하지 않았습니다</h3>
            <p className="text-slate-600">홈페이지에서 성경 필사를 시작해보세요!</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <BookOpen className="h-4 w-4" />
            <span>필사 시작하기</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProgressPage;