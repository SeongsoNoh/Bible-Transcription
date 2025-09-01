import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    login(email);
    setIsLoading(false);
    navigate('/');
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="p-4 bg-emerald-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
            <User className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">로그인 완료</h1>
          <p className="text-slate-600">안녕하세요, {user.name}님!</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 space-y-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-slate-600">로그인된 계정</p>
              <p className="text-lg font-medium text-slate-800">{user.email}</p>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-4">
                이제 성경 필사 기록이 계정에 저장됩니다.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <LogIn className="h-4 w-4" />
                  <span>필사 시작하기</span>
                </button>
                
                <button
                  onClick={logout}
                  className="w-full px-6 py-3 text-slate-600 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">로그인</h1>
        <p className="text-slate-600">이메일로 간편하게 로그인하세요</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              이메일 주소
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!email.trim() || isLoading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>로그인</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            로그인하면 필사 기록이 저장되어 언제든 이어서 학습할 수 있습니다.
            <br />
            개인정보는 안전하게 보호됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;