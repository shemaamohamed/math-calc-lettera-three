import { calculateArabicPower } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR SYSTEM LOGIC   ");
console.log("==================================================");

try {
    // Test 1: Verification for paper sample "جليل" with all cells selected
    const resultJaleel = calculateArabicPower("جليل");
    console.log(`\n--- TEST 1: Paper Sample ("${resultJaleel.original}", all selected: "ج", "ل", "ي", "ل") ---`);
    console.log(`Normalized: [${resultJaleel.normalizedChars.join(', ')}]`);
    console.log(`Cell 1 (ج): ${resultJaleel.section1[0].resultDisplay}`);
    console.log(`Cell 2 (ل): ${resultJaleel.section1[1].resultDisplay}`);
    console.log(`Cell 3 (ي): ${resultJaleel.section1[2].resultDisplay}`);
    console.log(`Cell 4 (ل): ${resultJaleel.section1[3].resultDisplay}`);
    console.log(`Transferred Sum S: ${resultJaleel.transferredSumDisplay}`);
    console.log(`Answer 1 (√S)    : ${resultJaleel.answer1.fullDisplay10} | Formula: ${resultJaleel.answer1.exactFormula} | Digit Sum: ${resultJaleel.answer1.digitSumSteps.join('->')} => ${resultJaleel.answer1.singleDigit}`);
    console.log(`Answer 2 (√(S/N)): ${resultJaleel.answer2.fullDisplay10} | Formula: ${resultJaleel.answer2.exactFormula} | Digit Sum: ${resultJaleel.answer2.digitSumSteps.join('->')} => ${resultJaleel.answer2.singleDigit}`);

    const isJaleelCell1Valid = resultJaleel.section1[0].resultDisplay === "1/16";
    const isJaleelCell2Valid = resultJaleel.section1[1].resultDisplay === "5/1";
    const isJaleelCell3Valid = resultJaleel.section1[2].resultDisplay === "81/16";
    const isJaleelCell4Valid = resultJaleel.section1[3].resultDisplay === "20/1";
    const isJaleelSumValid = resultJaleel.transferredSumDisplay === "241/8";

    if (isJaleelCell1Valid && isJaleelCell2Valid && isJaleelCell3Valid && isJaleelCell4Valid && isJaleelSumValid) {
        console.log("✅ TEST 1 PASSED: Perfectly matches handwritten paper solution for 'جليل'!");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // Test 1B: Verification for paper sample "سلس" with all cells selected
    const resultSals = calculateArabicPower("سلس");
    console.log(`\n--- TEST 1B: Paper Sample ("${resultSals.original}", all selected: "س", "ل", "س") ---`);
    console.log(`Normalized: [${resultSals.normalizedChars.join(', ')}]`);
    console.log(`Cell 1 (س): ${resultSals.section1[0].resultDisplay}`);
    console.log(`Cell 2 (ل): ${resultSals.section1[1].resultDisplay}`);
    console.log(`Cell 3 (س): ${resultSals.section1[2].resultDisplay}`);
    console.log(`Transferred Sum S: ${resultSals.transferredSumDisplay}`);
    console.log(`Answer 1 (√S)    : ${resultSals.answer1.fullDisplay10} | Formula: ${resultSals.answer1.exactFormula} | Digit Sum: ${resultSals.answer1.digitSumSteps.join('->')} => ${resultSals.answer1.singleDigit}`);
    console.log(`Answer 2 (√(S/N)): ${resultSals.answer2.fullDisplay10} | Formula: ${resultSals.answer2.exactFormula} | Digit Sum: ${resultSals.answer2.digitSumSteps.join('->')} => ${resultSals.answer2.singleDigit}`);

    const isSalsCell1Valid = resultSals.section1[0].resultDisplay === "40/27";
    const isSalsCell2Valid = resultSals.section1[1].resultDisplay === "64/27";
    const isSalsCell3Valid = resultSals.section1[2].resultDisplay === "40/3";
    const isSalsSumValid = resultSals.transferredSumDisplay === "464/27";

    const isSalsAns1Valid = resultSals.answer1.fullDisplay10 === "4.1455018013" && resultSals.answer1.singleDigit === 1;
    const isSalsAns2Valid = resultSals.answer2.fullDisplay10 === "2.3934065809" && resultSals.answer2.singleDigit === 2;

    if (isSalsCell1Valid && isSalsCell2Valid && isSalsCell3Valid && isSalsSumValid && isSalsAns1Valid && isSalsAns2Valid) {
        console.log("✅ TEST 1B PASSED: Perfectly matches handwritten paper solution for 'سلس'!");
    } else {
        console.error("❌ TEST 1B FAILED!");
        process.exit(1);
    }

    // Test 2: Large Article Test (1000+ characters)
    const largeText = "بسم الله الرحمن الرحيم ".repeat(50);
    const resultLarge = calculateArabicPower(largeText);
    console.log(`\n--- TEST 2: Large Article Test (${resultLarge.totalChars} cells) ---`);
    console.log(`Processed ${resultLarge.totalChars} cells! Default selected: ${resultLarge.transferredIndices.length}`);
    if (resultLarge.transferredIndices.length === resultLarge.totalChars) {
        console.log("✅ TEST 2 PASSED: Large article selected 100% by default!");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    // Test 3: Normalization rules check for ى, ة, and هـ
    const resultNorm = calculateArabicPower("هدى مدرسة هـ");
    console.log(`\n--- TEST 3: Character Normalization ("هدى مدرسة هـ") ---`);
    console.log(`Normalized: [${resultNorm.normalizedChars.join(', ')}]`);

    // "هدى" -> ه, د, أ (ى converted to أ)
    // "مدرسة" -> م, د, ر, س, ه (ة converted to ه)
    // "هـ" -> ه (tatweel removed, ه kept)
    const isAlefMaqsuraValid = resultNorm.normalizedChars[2] === 'أ';
    const isTaMarbutaValid = resultNorm.normalizedChars[7] === 'ه';
    const isTatweelStrippedValid = !resultNorm.normalizedChars.includes('ـ');

    if (isAlefMaqsuraValid && isTaMarbutaValid && isTatweelStrippedValid) {
        console.log("✅ TEST 3 PASSED: ى correctly mapped to أ, ة correctly mapped to ه, tatweel correctly stripped!");
    } else {
        console.error("❌ TEST 3 FAILED! Norm chars:", resultNorm.normalizedChars);
        process.exit(1);
    }

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("==================================================");

} catch (error) {
    console.error(`Error during calculation:`, error);
    process.exit(1);
}
