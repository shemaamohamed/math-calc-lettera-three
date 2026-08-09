'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import ArabicInput from '@/components/calculator/ArabicInput';
import ResultView from '@/components/calculator/ResultView';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateArabicPower, CalculationResult } from '@/lib/calculate';
import { useRouter } from 'next/navigation';
import { Sparkles, LogOut, Calculator } from 'lucide-react';

function HomePage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [transferredIndices, setTransferredIndices] = useState<number[] | undefined>(undefined);
  const [error, setError] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();

  const handleCalculate = (customIndices?: number[]) => {
    setError('');

    if (!text.trim()) {
      setError('الرجاء إدخال نص عربي');
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      try {
        const calcResult = calculateArabicPower(text, customIndices ?? transferredIndices);
        setResult(calcResult);
        if (customIndices !== undefined) {
          setTransferredIndices(customIndices);
        } else if (transferredIndices === undefined) {
          setTransferredIndices(calcResult.transferredIndices);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ في الحساب');
      } finally {
        setIsCalculating(false);
      }
    }, 200);
  };

  const handleToggleTransfer = (index: number) => {
    if (!result) return;
    const currentIndices = result.transferredIndices;
    let nextIndices: number[];
    if (currentIndices.includes(index)) {
      nextIndices = currentIndices.filter(i => i !== index);
    } else {
      nextIndices = [...currentIndices, index];
    }
    setTransferredIndices(nextIndices);
    try {
      const updatedResult = calculateArabicPower(text, nextIndices);
      setResult(updatedResult);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAll = () => {
    if (!result) return;
    const allIndices = result.section1.map((_, i) => i);
    setTransferredIndices(allIndices);
    try {
      const updatedResult = calculateArabicPower(text, allIndices);
      setResult(updatedResult);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeselectAll = () => {
    if (!result) return;
    const emptyIndices: number[] = [];
    setTransferredIndices(emptyIndices);
    try {
      const updatedResult = calculateArabicPower(text, emptyIndices);
      setResult(updatedResult);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-cairo selection:bg-purple-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        {/* Navigation Bar */}
        <header className="flex justify-between items-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-tight">
                القوة العربية
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Ancient Wisdom • Modern Code</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-xl px-6"
          >
            تسجيل الخروج
            <LogOut className="w-4 h-4 mr-2" />
          </Button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Input */}
          <section className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">كبّر كلماتك وقِس <span className="text-purple-400">قوتها الرقمية</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                استخدم خوارزميتنا المتقدمة لتحليل النصوص العربية وتفكيكها إلى عناصرها الأولية، وحساب قيمتها الرقمية المختزلة.
              </p>
            </div>

            <Card className="glass border-white/5 shadow-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-purple-400" />
                  <CardTitle className="text-lg">لوحة الإدخال</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ArabicInput value={text} onChange={(val) => {
                  setText(val);
                  setTransferredIndices(undefined);
                }} />

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in shake-x duration-500">
                    <p className="text-red-400 text-sm font-medium text-center">{error}</p>
                  </div>
                )}

                <Button
                  onClick={() => handleCalculate()}
                  className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-purple-900/40 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 group"
                  disabled={!text.trim() || isCalculating}
                >
                  {isCalculating ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>جاري معالجة البيانات...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span>بدء الحساب الرقمي</span>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-white mb-1">١٠٠٪</div>
                <div className="text-xs text-slate-500 font-semibold uppercase">دقة الحساب</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-2xl font-bold text-white mb-1">لحظي</div>
                <div className="text-xs text-slate-500 font-semibold uppercase">سرعة المعالجة</div>
              </div>
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="lg:col-span-7 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            {result ? (
              <ResultView
                result={result}
                onToggleTransfer={handleToggleTransfer}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
              />
            ) : (
              <div className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-600 gap-6 group">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                  <Calculator className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-center text-lg max-w-xs font-medium">أدخل نصاً في جهة اليمين لرؤية التحليل التفصيلي هنا</p>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-24 pt-8 border-t border-white/5 text-center text-slate-600 text-sm">
          <p>© {new Date().getFullYear()} مشروع القوة العربية • تم التصميم بأحدث التقنيات</p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}

