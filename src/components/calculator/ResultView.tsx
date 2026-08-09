'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalculationResult, AnswerDetails } from '@/lib/calculate';
import { Trophy, Sparkles, Check, Divide, Calculator, CheckSquare, Square, ListFilter } from 'lucide-react';

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
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            {icon}
            <span className={`text-xs font-black uppercase tracking-wider ${badgeColor}`}>
              {answer.title}
            </span>
          </div>
          <CardTitle className="text-sm font-bold text-slate-200">{answer.subtitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-xs text-slate-300 font-bold block mb-1 font-mono dir-ltr text-center">
              {answer.exactFormula}
            </span>
            <span className={`text-3xl font-black ${badgeColor} block font-mono mb-2`}>
              {answer.exactFraction}
            </span>
            <div className="inline-block bg-black/60 py-1.5 px-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block mb-0.5 font-sans">النتيجة بـ 10 أرقام عشرية:</span>
              <span className="text-base font-bold text-emerald-400 font-mono tracking-wider">
                {answer.fullDisplay10}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">أول 10 أرقام بعد العلامة:</span>
              <span className={`font-mono font-bold ${badgeColor} tracking-widest`}>
                {answer.first10Digits || '0000000000'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">خطوات الاختزال:</span>
              <span className={`font-mono ${badgeColor} font-bold`}>
                {answer.digitSumSteps.join(' ➔ ')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-slate-200 font-bold text-sm">الناتج النهائي (رقم واحد):</span>
              <span className={`text-2xl font-black ${badgeColor} px-4 py-1 bg-white/10 rounded-xl border border-white/20 shadow-inner`}>
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
        <CardHeader className="pb-3 border-b border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-purple-300 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                القسم الأول: قسم الخانات والأرقام المرجعية (البوكس الموحد)
              </CardTitle>
              <p className="text-xs text-slate-400">
                جميع الخانات محددة تلقائياً 100%. يمكنك إلغاء تحديد أو تحديد أي خانة بحرية.
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
          {/* Scrollable Grid Container for Large Cell Numbers (1000+ support) */}
          <div className="max-h-[480px] overflow-y-auto pr-1 pl-1 scrollbar-thin scrollbar-thumb-purple-600/40 scrollbar-track-white/5 rounded-2xl bg-slate-950/40 p-3 border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.section1.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onToggleTransfer?.(idx)}
                  className={`p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between ${
                    item.isTransferred
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[11px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                        الخانة {item.pos}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-lg border border-purple-500/20">
                          {item.char}
                        </span>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          item.isTransferred ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-500 bg-white/5'
                        }`}>
                          {item.isTransferred && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 mb-3 bg-black/40 p-2.5 rounded-lg border border-white/5 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">× 4:</span>
                        <span className="text-cyan-300 font-bold">{item.step2Val}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">مرجعي:</span>
                        <span className="text-yellow-300 font-bold">{item.step3Val}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-sans">النسبة:</span>
                        <span className="text-purple-300 font-bold">{item.ratioDisplay}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">قيمة الخانة:</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {item.resultDisplay}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Items Summary Box (شريط استعراض الخانات المحددة) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-purple-950/40 to-blue-950/40 border border-emerald-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <ListFilter className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs text-emerald-300 font-bold block">
                    صندوق استعراض الخانات المحددة (Selected Items Summary)
                  </span>
                  <span className="text-xs text-slate-400">
                    العدد المحدد ($N$): <strong className="text-white font-mono">{transferredCount}</strong> | المجموع ($S$): <strong className="text-emerald-400 font-mono">{result.transferredSumDisplay}</strong>
                  </span>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30 font-mono text-base font-black text-emerald-300 text-center">
                S = {result.transferredSumDisplay}
              </div>
            </div>

            {/* List of Selected Characters and values */}
            <div className="text-xs font-mono text-slate-300 bg-black/50 p-3 rounded-xl border border-white/5 overflow-x-auto">
              <span className="text-slate-400 font-sans block mb-1">تفاصيل الخانات المحددة حالياً:</span>
              {transferredCount > 0 ? (
                <div className="flex flex-wrap gap-2 items-center">
                  {transferredItems.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-emerald-300">
                      <span className="font-bold text-white font-sans">{item.char}</span>
                      <span className="text-slate-400 text-[10px]">({item.pos}):</span>
                      <span>{item.resultDisplay}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-amber-400/80 font-sans text-xs">
                  لم يتم تحديد أي خانة. يرجى تحديد خانة واحدة على الأقل لإجراء الحسابات.
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: 4 ANSWERS SECTION (الأبواب الأربعة) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          القسم الثاني: شاشة النتائج والأجوبة الأربعة (Results Section)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Answer 1 */}
          {renderAnswerCard(
            result.answer1,
            'text-yellow-400',
            'yellow-500/30',
            'rgba(245,158,11,0.15)',
            <Trophy className="w-5 h-5 text-yellow-400" />
          )}

          {/* Answer 2 */}
          {renderAnswerCard(
            result.answer2,
            'text-cyan-400',
            'cyan-500/30',
            'rgba(6,182,212,0.15)',
            <Sparkles className="w-5 h-5 text-cyan-400" />
          )}

          {/* Answer 3 */}
          {renderAnswerCard(
            result.answer3,
            'text-orange-400',
            'orange-500/30',
            'rgba(249,115,22,0.15)',
            <Divide className="w-5 h-5 text-orange-400" />
          )}

          {/* Answer 4 */}
          {renderAnswerCard(
            result.answer4,
            'text-emerald-400',
            'emerald-500/30',
            'rgba(16,185,129,0.15)',
            <Sparkles className="w-5 h-5 text-emerald-400" />
          )}
        </div>
      </div>
    </div>
  );
}
