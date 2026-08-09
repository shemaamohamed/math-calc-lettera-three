import { calculateArabicPower } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR SYSTEM LOGIC   ");
console.log("==================================================");

try {
    // Test 1: Verification for paper sample "محد" with selected cells [0, 1] ("م" and "ح")
    const resultPaper = calculateArabicPower("محد", [0, 1]);
    console.log(`\n--- TEST 1: Paper Sample ("${resultPaper.original}", N=2 selected: "م" and "ح") ---`);
    console.log(`Normalized: [${resultPaper.normalizedChars.join(', ')}]`);
    console.log(`Cell 1 (م): ${resultPaper.section1[0].resultDisplay}`);
    console.log(`Cell 2 (ح): ${resultPaper.section1[1].resultDisplay}`);
    console.log(`Cell 3 (د): ${resultPaper.section1[2].resultDisplay}`);
    console.log(`Transferred Sum S: ${resultPaper.transferredSumDisplay}`);
    console.log(`Answer 1 (√S)    : ${resultPaper.answer1.fullDisplay10} | Digit Sum: ${resultPaper.answer1.digitSumSteps.join('->')} => ${resultPaper.answer1.singleDigit}`);
    console.log(`Answer 2 (√(S/N)): ${resultPaper.answer2.fullDisplay10} | Digit Sum: ${resultPaper.answer2.digitSumSteps.join('->')} => ${resultPaper.answer2.singleDigit}`);

    const isCell1Valid = resultPaper.section1[0].resultDisplay === "4/27";
    const isCell2Valid = resultPaper.section1[1].resultDisplay === "208/27";
    const isCell3Valid = resultPaper.section1[2].resultDisplay === "52/3";

    const isAns1Valid = resultPaper.answer1.fullDisplay10 === "2.8021156028" && resultPaper.answer1.singleDigit === 6;
    const isAns2Valid = resultPaper.answer2.fullDisplay10 === "1.9813949444" && resultPaper.answer2.singleDigit === 1;

    if (isCell1Valid && isCell2Valid && isCell3Valid && isAns1Valid && isAns2Valid) {
        console.log("✅ TEST 1 PASSED: Perfectly matches handwritten paper solution for 'محد'!");
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

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("==================================================");

} catch (error) {
    console.error(`Error during calculation:`, error);
    process.exit(1);
}
