'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, AnswerDetails } from '@/lib/calculate';
import { Trophy, Sparkles, Check, Calculator, CheckSquare, Square, ListFilter, ArrowLeftRight } from 'lucide-react';

interface ResultViewProps {
  result: CalculationResult | null;
  onToggleTransfer?: (index: number) => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
}

export default function ResultView({
  result,
  onToggleTransfer,
  onSelectAll,
  onDeselectAll,
}: ResultViewProps) {
  if (!result) {
    return null;
  }

  const transferredItems = result.section1.filter(item => item.isTransferred);
  const transferredCount = transferredItems.length;
  const totalCount = result.section1.length;
  const isAllSelected = transferredCount === totalCount && totalCount > 0;

  const renderAnswerCard = (
    answer: AnswerDetails,
    badgeColor: string,
    borderColor: string,
    glowColor: string,
    icon: React.ReactNode
  ) => {
    return (
      <Card className={`glass overflow-hidden border-${borderColor} shadow-[0_0_30px_${glowColor}] relative transition-all duration-500 hover:scale-[1.01]`}>
        <CardHeader className="text-center pb-2 border-b border-white/10">
          <div className="flex items-center justify-center gap-2 mb-1">
            {icon}
            <span className={`text-base font-black uppercase tracking-wider ${badgeColor}`}>
              {answer.title}
            </span>
          </div>
          <CardTitle className="text-sm font-bold text-slate-300">{answer.subtitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          {/* Step 1: Formula & Fractions */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <span className="text-xs text-slate-400 font-medium block">
              1. جمع الخانات المحددة:
            </span>
            <div className="text-sm font-mono text-cyan-300 font-bold dir-ltr text-center bg-black/40 p-2 rounded-xl border border-white/5">
              {answer.exactFormula}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">2. الجذر التربيعي للكسر:</span>
              <span className={`text-2xl font-black ${badgeColor} font-mono dir-ltr`}>
                {answer.exactFraction}
              </span>
            </div>
          </div>

          {/* Step 3: Decimal 10 digits */}
          <div className="p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 space-y-1 text-center">
            <span className="text-xs text-emerald-300 font-bold block mb-1">
              3. الناتج العشري (أول 10 أرقام فقط بعد العلامة العشرية بدون تقريب):
            </span>
            <div className="inline-block bg-black/80 px-4 py-2 rounded-xl border border-emerald-500/40">
              <span className="text-xl font-black text-emerald-400 font-mono tracking-widest dir-ltr">
                {answer.fullDisplay10}
              </span>
            </div>
          </div>

          {/* Step 4: Digit Sum Reduction */}
          <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">أول 10 أرقام المستخرجة:</span>
              <span className={`font-mono font-bold ${badgeColor} tracking-widest text-sm dir-ltr`}>
                {answer.first10Digits || '0000000000'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">4. خطوات الاختزال والجمع:</span>
              <span className={`font-mono ${badgeColor} font-bold text-sm dir-ltr`}>
                {answer.digitSumSteps.join(' ➔ ')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-slate-200 font-bold text-base">الناتج النهائي (اختزال رقم واحد):</span>
              <span className={`text-3xl font-black ${badgeColor} px-5 py-1 bg-white/10 rounded-2xl border border-white/20 shadow-inner font-mono`}>
                {answer.singleDigit}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 dir-rtl font-cairo">
      {/* SECTION 1: CELL BOXES & CONTROL CONTAINER */}
      <Card className="glass border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <CardHeader className="pb-3 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                🔵 القسم الأول: قسم الخانات (المربع) - الحساب بدقة الكسر المطلق
              </CardTitle>
              <p className="text-xs text-slate-400">
                الخطوات الـ 5 الحسابية بالكسور الدقيقة بدون أي تقريب، مع أزرار الانتقال (Transfer Buttons).
              </p>
            </div>

            {/* Select All & Unselect All Control Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {transferredCount} / {totalCount} خانة محددة
              </span>

              <button
                onClick={() => onSelectAll?.()}
                disabled={isAllSelected}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-md ${
                  isAllSelected
                    ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 shadow-purple-900/30'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>تحديد الكل</span>
              </button>

              <button
                onClick={() => onDeselectAll?.()}
                disabled={transferredCount === 0}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 shadow-md ${
                  transferredCount === 0
                    ? 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>إلغاء تحديد الكل</span>
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Scrollable Grid Container for Cell Boxes */}
          <div className="max-h-[550px] overflow-y-auto pr-1 pl-1 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-white/5 rounded-2xl bg-slate-950/40 p-3 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.section1.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between space-y-3 ${
                    item.isTransferred
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Header: Pos & Char */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">
                      الخانة {item.pos}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-purple-300 bg-purple-500/10 px-3 py-0.5 rounded-xl border border-purple-500/20">
                        {item.char}
                      </span>
                    </div>
                  </div>

                  {/* 5 Detailed Steps Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-300 bg-black/50 p-3 rounded-xl border border-white/5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">1. العد الطبيعي:</span>
                      <span className="text-white font-bold">{item.step1Val}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">2. الضرب في 4:</span>
                      <span className="text-cyan-300 font-bold">{item.step2Val}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">3. قسمة × ضرب:</span>
                      <span className="text-yellow-300 font-bold dir-ltr">{item.step3Display}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-sans">4. التجميع الطبيعي:</span>
                      <span className="text-purple-300 font-bold dir-ltr">{item.step4Display}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/10">
                      <span className="text-slate-400 font-sans">5. النسبة والكسر النهائي:</span>
                      <span className="text-emerald-400 font-black text-sm dir-ltr">{item.resultDisplay}</span>
                    </div>
                  </div>

                  {/* Transfer Button (زر الانتقال) */}
                  <button
                    onClick={() => onToggleTransfer?.(idx)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-300 shadow-md ${
                      item.isTransferred
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/40'
                        : 'bg-white/10 text-slate-400 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>زر انتقال ({item.char})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono dir-ltr text-xs">{item.resultDisplay}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        item.isTransferred ? 'bg-white text-emerald-950 border-white' : 'border-slate-500'
                      }`}>
                        {item.isTransferred && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Items Summary Box (صندوق استعراض الخانات المحددة) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-blue-950/40 border border-emerald-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <ListFilter className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-emerald-300 font-bold block">
                    صندوق الخانات المنتقلة (Selected Cells Summary)
                  </span>
                  <span className="text-xs text-slate-400">
                    عدد الخانات المحددة ($N$): <strong className="text-white font-mono">{transferredCount}</strong> | المجموع الكسري ($S$): <strong className="text-emerald-400 font-mono dir-ltr">{result.transferredSumDisplay}</strong>
                  </span>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 font-mono text-base font-black text-emerald-300 text-center dir-ltr">
                S = {result.transferredSumDisplay}
              </div>
            </div>

            {/* List of Selected Characters and values */}
            <div className="text-xs font-mono text-slate-300 bg-black/50 p-3 rounded-xl border border-white/5 overflow-x-auto">
              <span className="text-slate-400 font-sans block mb-1">تفاصيل الخانات المنتقلة:</span>
              {transferredCount > 0 ? (
                <div className="flex flex-wrap gap-2 items-center">
                  {transferredItems.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg border border-white/10 text-emerald-300">
                      <span className="font-bold text-white font-sans">{item.char}</span>
                      <span className="text-slate-400 text-[10px]">({item.pos}):</span>
                      <span className="dir-ltr">{item.resultDisplay}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-amber-400/80 font-sans text-xs">
                  لم يتم نقل/تحديد أي خانة. انقر على [زر انتقال] لنقل الخانات المطلوب حسابها.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: 2 ANSWERS SECTION (قسم النتائج - الجواب الأول والجواب الثاني) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          🟨 القسم الثاني: قسم النتائج (الجواب الأول والجواب الثاني)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Answer 1 */}
          {renderAnswerCard(
            result.answer1,
            'text-yellow-400',
            'yellow-500/30',
            'rgba(245,158,11,0.15)',
            <Trophy className="w-6 h-6 text-yellow-400" />
          )}

          {/* Answer 2 */}
          {renderAnswerCard(
            result.answer2,
            'text-cyan-400',
            'cyan-500/30',
            'rgba(6,182,212,0.15)',
            <Sparkles className="w-6 h-6 text-cyan-400" />
          )}
        </div>
      </div>
    </div>
  );
}

