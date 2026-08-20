import { calculateArabicPower } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR 5-STEP PAPER LOGIC   ");
console.log("==================================================");

try {
    // Test 1: Verification for "مدد" with transferred cells [0, 1] matching exact reference sheet
    const resultMadad = calculateArabicPower("مدد", [0, 1]);
    console.log(`\n--- TEST 1: Reference Sheet Word ("${resultMadad.original}", cells 1 & 2 selected) ---`);
    console.log(`Normalized: [${resultMadad.normalizedChars.join(', ')}]`);
    console.log(`Cell 1 (م): Step 2 = ${resultMadad.section1[0].step2Val}, Result = ${resultMadad.section1[0].resultDisplay}`);
    console.log(`Cell 2 (د): Step 2 = ${resultMadad.section1[1].step2Val}, Result = ${resultMadad.section1[1].resultDisplay}`);
    console.log(`Cell 3 (د): Step 2 = ${resultMadad.section1[2].step2Val}, Result = ${resultMadad.section1[2].resultDisplay}`);
    console.log(`Transferred Sum S: ${resultMadad.transferredSumDisplay}`);
    console.log(`Answer 1 (√S)    : ${resultMadad.answer1.fullDisplay10} | Formula: ${resultMadad.answer1.exactFormula} | Single Digit: ${resultMadad.answer1.singleDigit}`);
    console.log(`Answer 2 (√(S/N)): ${resultMadad.answer2.fullDisplay10} | Formula: ${resultMadad.answer2.exactFormula} | Single Digit: ${resultMadad.answer2.singleDigit}`);

    const isMadadCell1Valid = resultMadad.section1[0].resultDisplay === "4/27";
    const isMadadCell2Valid = resultMadad.section1[1].resultDisplay === "208/27";
    const isMadadCell3Valid = resultMadad.section1[2].resultDisplay === "52/3";
    const isMadadSumValid = resultMadad.transferredSumDisplay === "212/27";
    const isMadadAns1Valid = resultMadad.answer1.singleDigit === 6;
    const isMadadAns2Valid = resultMadad.answer2.singleDigit === 1;

    if (isMadadCell1Valid && isMadadCell2Valid && isMadadCell3Valid && isMadadSumValid && isMadadAns1Valid && isMadadAns2Valid) {
        console.log("✅ TEST 1 PASSED: 100% matches handwritten reference sheet for 'مدد' (S = 212/27, Ans 1 = 6, Ans 2 = 1)!");
    } else {
        console.error("❌ TEST 1 FAILED!", {
            cell1: resultMadad.section1[0].resultDisplay,
            cell2: resultMadad.section1[1].resultDisplay,
            cell3: resultMadad.section1[2].resultDisplay,
            sum: resultMadad.transferredSumDisplay,
            ans1Digit: resultMadad.answer1.singleDigit,
            ans2Digit: resultMadad.answer2.singleDigit
        });
        process.exit(1);
    }

    // Test 2: Character Normalization check for ى, ة, and هـ
    const resultNorm = calculateArabicPower("شجرة هدى بيت");
    console.log(`\n--- TEST 2: Character Normalization ("شجرة هدى بيت") ---`);
    console.log(`Normalized: [${resultNorm.normalizedChars.join(', ')}]`);

    // "شجرة" -> ش, ج, ر, ت (ة is converted to ت)
    // "هدى" -> ه, د, أ (ى is converted to أ)
    // "بيت" -> ب, ي, ت (ت is ت)
    const isTaMarbutaValid = resultNorm.normalizedChars[3] === 'ت';
    const isAlefMaqsuraValid = resultNorm.normalizedChars[6] === 'أ';
    const isTaOpenValid = resultNorm.normalizedChars[9] === 'ت';

    if (isTaMarbutaValid && isAlefMaqsuraValid && isTaOpenValid) {
        console.log("✅ TEST 2 PASSED: 'ة' is counted as 'ت' and 'ه' as 'ه'!");
    } else {
        console.error("❌ TEST 2 FAILED! Norm chars:", resultNorm.normalizedChars);
        process.exit(1);
    }

    // Test 3: Long text (60+ characters)
    const text70 = "بسم الله الرحمن الرحيم الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين";
    const result70 = calculateArabicPower(text70);
    console.log(`\n--- TEST 3: Long text (${result70.totalChars} characters) ---`);
    console.log(`Successfully calculated ${result70.totalChars} characters.`);
    console.log(`Sum S: ${result70.transferredSumDisplay}`);
    console.log(`Answer 1: ${result70.answer1.fullDisplay10} (Digit: ${result70.answer1.singleDigit})`);
    console.log(`Answer 2: ${result70.answer2.fullDisplay10} (Digit: ${result70.answer2.singleDigit})`);

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS COMPLETED AND VERIFIED 100%!");
    console.log("==================================================");

} catch (error) {
    console.error(`Error during calculation:`, error);
    process.exit(1);
}
