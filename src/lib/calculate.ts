/**
 * Arabic Arbitrary-Precision Math Calculation Library (3-Step Version)
 */

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const TEN = BigInt(10);
const HUNDRED = BigInt(100);

function normalizeChar(ch: string): string {
  if (['ا', 'أ', 'إ', 'آ', 'ٱ', 'ء', 'ئ', 'ؤ'].includes(ch)) return 'أ';
  if (['ت', 'ة'].includes(ch)) return 'ت';
  if (['ه', 'ۥ'].includes(ch)) return 'ه';
  return ch;
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== ZERO) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a < ZERO ? -a : a;
}

function bigIntSqrt(n: bigint): bigint {
  if (n < ZERO) throw new Error('Square root of negative number');
  if (n === ZERO) return ZERO;
  let x0 = n;
  let x1 = (x0 + n / x0) / TWO;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / TWO;
  }
  return x0;
}

export class Fraction {
  num: bigint;
  den: bigint;

  constructor(num: bigint | number, den: bigint | number = ONE) {
    let n = BigInt(num);
    let d = BigInt(den);
    if (d === ZERO) throw new Error('Division by zero');
    if (d < ZERO) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.num = n / g;
    this.den = d / g;
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction {
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  toString(): string {
    return `${this.num}/${this.den}`;
  }

  toDecimalInfo(maxDecimalDigits = 50) {
    let n = this.num;
    let d = this.den;
    const intPart = (n / d).toString();
    let rem = n % d;
    if (rem < ZERO) rem = -rem;

    if (rem === ZERO) {
      return {
        intPart,
        fracPart: '',
        isRepeating: false,
        recurringDigit: null,
        fullString: intPart,
      };
    }

    let fracDigits = '';
    const remainderMap = new Map<bigint, number>();
    let isRepeating = false;
    let repeatStart = -1;
    let recurringCycle = '';

    for (let pos = 0; pos < maxDecimalDigits; pos++) {
      if (remainderMap.has(rem)) {
        isRepeating = true;
        repeatStart = remainderMap.get(rem)!;
        recurringCycle = fracDigits.substring(repeatStart);
        break;
      }
      remainderMap.set(rem, pos);
      rem *= TEN;
      fracDigits += (rem / d).toString();
      rem = rem % d;
      if (rem === ZERO) break;
    }

    if (isRepeating && recurringCycle.length > 0) {
      while (fracDigits.length < maxDecimalDigits) {
        fracDigits += recurringCycle;
      }
      fracDigits = fracDigits.substring(0, maxDecimalDigits);
    }

    return {
      intPart,
      fracPart: fracDigits,
      isRepeating,
      recurringDigit: isRepeating ? recurringCycle : null,
      fullString: `${intPart}.${fracDigits}`,
    };
  }

  sqrtDecimalString(precision = 50) {
    const p = BigInt(precision);
    const scale = TEN ** (p * TWO);
    const scaledNum = (this.num * scale) / this.den;
    const sqrtInt = bigIntSqrt(scaledNum);

    const str = sqrtInt.toString().padStart(precision + 1, '0');
    const intPart = str.slice(0, str.length - precision);
    const fracPart = str.slice(str.length - precision);
    return {
      intPart,
      fracPart,
      fullString: `${intPart}.${fracPart}`,
    };
  }
}

export interface DigitSumResult {
  first10Digits: string;
  steps: number[];
  singleDigit: number;
}

export function reduceToSingleDigit(fracPart: string): DigitSumResult {
  const first10Digits = fracPart.substring(0, 10);
  const digits = first10Digits.split('').map(d => parseInt(d, 10)).filter(d => !isNaN(d));
  let sum = digits.reduce((acc, val) => acc + val, 0);
  const steps = [sum];

  while (sum >= 10) {
    sum = sum.toString().split('').reduce((acc, val) => acc + parseInt(val, 10), 0);
    steps.push(sum);
  }

  return {
    first10Digits,
    steps,
    singleDigit: steps[steps.length - 1] || 0,
  };
}

export interface Section1Item {
  pos: number;
  char: string;
  step1Val: number;
  step2Val: number;
  step3Fraction: Fraction;
  step3Display: string;
  step4Fraction: Fraction;
  step4Display: string;
  ratioFraction: Fraction;
  ratioDisplay: string;
  resultFraction: Fraction;
  resultDisplay: string;
  isTransferred: boolean;
}

export interface AnswerDetails {
  title: string;
  subtitle: string;
  exactFormula: string;
  exactFraction: string;
  decimalFull: string;
  first10Digits: string;
  fullDisplay10: string;
  digitSumSteps: number[];
  singleDigit: number;
}

export interface CalculationResult {
  original: string;
  normalizedChars: string[];
  totalChars: number;
  section1: Section1Item[];
  transferredIndices: number[];
  transferredSumFraction: Fraction;
  transferredSumDisplay: string;
  answer1: AnswerDetails;
  answer2: AnswerDetails;
}

function calculateAnswerDetails(
  title: string,
  subtitle: string,
  exactFormula: string,
  fraction: Fraction,
  isSqrt: boolean
): AnswerDetails {
  if (isSqrt) {
    const sqrtInfo = fraction.sqrtDecimalString(50);
    const digitSum = reduceToSingleDigit(sqrtInfo.fracPart);
    return {
      title,
      subtitle,
      exactFormula,
      exactFraction: `√(${fraction.toString()})`,
      decimalFull: sqrtInfo.fullString,
      first10Digits: digitSum.first10Digits,
      fullDisplay10: `${sqrtInfo.intPart}.${digitSum.first10Digits}`,
      digitSumSteps: digitSum.steps,
      singleDigit: digitSum.singleDigit,
    };
  } else {
    const decInfo = fraction.toDecimalInfo(50);
    const digitSum = reduceToSingleDigit(decInfo.fracPart);
    return {
      title,
      subtitle,
      exactFormula,
      exactFraction: fraction.toString(),
      decimalFull: decInfo.fullString,
      first10Digits: digitSum.first10Digits,
      fullDisplay10: `${decInfo.intPart}.${digitSum.first10Digits}`,
      digitSumSteps: digitSum.steps,
      singleDigit: digitSum.singleDigit,
    };
  }
}

export function calculateArabicPower(
  text: string,
  transferredIndicesInput?: number[]
): CalculationResult {
  const rawChars = text.split('').filter(c => c.trim() !== '');
  const normalizedChars = rawChars.map(normalizeChar);
  const n = normalizedChars.length;

  if (n === 0) {
    throw new Error('الرجاء إدخال أحرف عربية صحيحة');
  }

  // الخطوة 1: العد الطبيعي (1, 2, 3...)
  const step1 = normalizedChars.map((_, i) => i + 1);

  // الخطوة 2: الضرب في 4
  const step2 = step1.map(v => v * 4);
  const lastStep2Val = step2[n - 1]; // قيمة الحرف الأخير في خطوة 2

  // الخطوة 3: القسمة على الحرف الأخير ثم الضرب في نفس الخانة
  // (step2[i] / lastStep2Val) * step2[i]
  const step3Fractions: Fraction[] = step2.map(
    val => new Fraction(val * val, lastStep2Val)
  );

  // الخطوة 4: تجميع قيم الخطوة 3 لكل حرف أبجدي (تجميع الخانات المماثلة لكل حرف)
  const charStep3Sums = new Map<string, Fraction>();

  for (let i = 0; i < n; i++) {
    const c = normalizedChars[i];
    const currentSum = charStep3Sums.get(c) ?? new Fraction(0, 1);
    charStep3Sums.set(c, currentSum.add(step3Fractions[i]));
  }

  const step4Fractions: Fraction[] = normalizedChars.map(c =>
    charStep3Sums.get(c)!
  );

  // الخطوة 5: استخلاص النسب المئوية والضرب في القيمة العددية
  // نسبة الخانة من خطوة 3 بالنسبة للحرف الأخير (step3 / lastStep2Val) * step4Val
  const defaultTransferred = transferredIndicesInput ?? step1.map((_, i) => i);

  const section1: Section1Item[] = normalizedChars.map((c, idx) => {
    const s1 = step1[idx];
    const s2 = step2[idx];
    const s3Frac = step3Fractions[idx];
    const s4Frac = step4Fractions[idx];

    // Ratio = s3Frac / lastStep2Val
    const ratioFraction = s3Frac.div(new Fraction(lastStep2Val, 1));

    // Result Fraction = ratioFraction * s4Frac
    const resultFraction = ratioFraction.mul(s4Frac);

    const isTransferred = defaultTransferred.includes(idx);

    return {
      pos: idx + 1,
      char: c,
      step1Val: s1,
      step2Val: s2,
      step3Fraction: s3Frac,
      step3Display: s3Frac.toString(),
      step4Fraction: s4Frac,
      step4Display: s4Frac.toString(),
      ratioFraction,
      ratioDisplay: ratioFraction.toString(),
      resultFraction,
      resultDisplay: resultFraction.toString(),
      isTransferred,
    };
  });

  // حساب مجموع الخانات المحددة S والعدد N
  const transferredItems = section1.filter(item => item.isTransferred);
  const count = transferredItems.length;

  let S = new Fraction(0, 1);
  if (count > 0) {
    S = transferredItems.reduce(
      (acc, item) => acc.add(item.resultFraction),
      new Fraction(0, 1)
    );
  }

  const transferredSumDisplay = S.toString();
  const N = count;

  // صيغة جمع الخانات المحددة (مثال: 208/27 + 4/27)
  const itemsFormula = count > 0
    ? transferredItems.map(item => item.resultDisplay).reverse().join(' + ')
    : '0';

  // الجواب الأول 🟨
  // 1. جمع الخانات S
  // 2. الجذر التربيعي √S
  // 3. الناتج العشري بـ 10 أرقام بعد العلامة
  // 4. اختزال الناتج إلى رقم واحد
  const answer1 = calculateAnswerDetails(
    'الجواب الأول 🟨',
    'الجذر التربيعي لمجموع الخانات المحددة (√S)',
    `S = ${itemsFormula} = ${S.toString()}`,
    S,
    true
  );

  // الجواب الثاني 🟨
  // 1. جمع الخانات وقسمتها على العدد (S ÷ N)
  // 2. الجذر التربيعي √(S ÷ N)
  // 3. الناتج العشري بـ 10 أرقام بعد العلامة
  // 4. اختزال الناتج إلى رقم واحد
  const sDivN = count > 0 ? S.div(new Fraction(count, 1)) : new Fraction(0, 1);
  const answer2 = calculateAnswerDetails(
    'الجواب الثاني 🟨',
    `الجذر التربيعي لـ (المجموع ÷ عدد الخانات المحددة N)`,
    `${S.toString()} ÷ ${N} = ${sDivN.toString()}`,
    sDivN,
    true
  );

  return {
    original: text,
    normalizedChars,
    totalChars: n,
    section1,
    transferredIndices: section1.filter(item => item.isTransferred).map(item => item.pos - 1),
    transferredSumFraction: S,
    transferredSumDisplay,
    answer1,
    answer2,
  };
}


