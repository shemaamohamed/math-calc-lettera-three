import { calculateArabicPower } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR SYSTEM LOGIC   ");
console.log("==================================================");

try {
    // Test 0: Verify Initial Default Selection is 100% Select All
    const resultDefault = calculateArabicPower("مدد");
    console.log(`\n--- TEST 0: Default Selection on Input ("${resultDefault.original}") ---`);
    console.log(`Total Cells: ${resultDefault.totalChars}, Transferred Cells: ${resultDefault.transferredIndices.length}`);
    if (resultDefault.transferredIndices.length === resultDefault.totalChars) {
        console.log("✅ TEST 0 PASSED: 100% of cells selected by default on input!");
    } else {
        console.error("❌ TEST 0 FAILED: Default selection was not 100%!");
        process.exit(1);
    }

    // Test 1: Handwritten Paper Sample ("مدد" with 2 checked cells: indices 1 and 2)
    const resultPaper = calculateArabicPower("مدد", [1, 2]);
    console.log(`\n--- TEST 1: Paper Sample ("${resultPaper.original}", N=2) ---`);
    console.log(`Normalized: [${resultPaper.normalizedChars.join(', ')}]`);
    console.log(`Transferred Sum S: ${resultPaper.transferredSumDisplay}`);
    console.log(`Answer 1 (S)    : ${resultPaper.answer1.fullDisplay10} | Digit Sum: ${resultPaper.answer1.digitSumSteps.join('->')} => ${resultPaper.answer1.singleDigit}`);
    console.log(`Answer 2 (√S)   : ${resultPaper.answer2.fullDisplay10} | Digit Sum: ${resultPaper.answer2.digitSumSteps.join('->')} => ${resultPaper.answer2.singleDigit}`);
    console.log(`Answer 3 (S/N)  : ${resultPaper.answer3.fullDisplay10} | Digit Sum: ${resultPaper.answer3.digitSumSteps.join('->')} => ${resultPaper.answer3.singleDigit}`);
    console.log(`Answer 4 (√(S/N)): ${resultPaper.answer4.fullDisplay10} | Digit Sum: ${resultPaper.answer4.digitSumSteps.join('->')} => ${resultPaper.answer4.singleDigit}`);

    const isCell1Valid = resultPaper.section1[0].resultDisplay === "4/3";
    const isCell2Valid = resultPaper.section1[1].resultDisplay === "40/3";
    const isCell3Valid = resultPaper.section1[2].resultDisplay === "20/1";

    const isAns1Valid = resultPaper.answer1.singleDigit === 3 && resultPaper.answer1.digitSumSteps[0] === 30;
    const isAns2Valid = resultPaper.answer2.singleDigit === 3 && resultPaper.answer2.digitSumSteps[0] === 48;
    const isAns3Valid = resultPaper.answer3.singleDigit === 6 && resultPaper.answer3.digitSumSteps[0] === 60;
    const isAns4Valid = resultPaper.answer4.singleDigit === 7 && resultPaper.answer4.digitSumSteps[0] === 43;

    if (isCell1Valid && isCell2Valid && isCell3Valid && isAns1Valid && isAns2Valid && isAns3Valid && isAns4Valid) {
        console.log("✅ TEST 1 PASSED: Perfectly matches handwritten paper solution!");
    } else {
        console.error("❌ TEST 1 FAILED!");
        process.exit(1);
    }

    // Test 2: Select All Cells ("مدد" with all 3 cells selected, N=3)
    const resultAll = calculateArabicPower("مدد", [0, 1, 2]);
    console.log(`\n--- TEST 2: Select All ("مدد", N=3) ---`);
    console.log(`Transferred Sum S: ${resultAll.transferredSumDisplay}`);
    console.log(`Answer 1 (S)    : ${resultAll.answer1.fullDisplay10}`);
    console.log(`Answer 3 (S/3)  : ${resultAll.answer3.fullDisplay10}`);
    if (resultAll.transferredSumDisplay === "104/3" && resultAll.answer3.exactFormula.includes("÷ 3")) {
        console.log("✅ TEST 2 PASSED: N=3 division correctly calculated!");
    } else {
        console.error("❌ TEST 2 FAILED!");
        process.exit(1);
    }

    // Test 3: Large Article Test (1000+ characters)
    const largeText = "بسم الله الرحمن الرحيم ".repeat(50);
    const resultLarge = calculateArabicPower(largeText);
    console.log(`\n--- TEST 3: Large Article Test (${resultLarge.totalChars} cells) ---`);
    console.log(`Processed ${resultLarge.totalChars} cells in instant time! Default selected: ${resultLarge.transferredIndices.length}`);
    if (resultLarge.transferredIndices.length === resultLarge.totalChars) {
        console.log("✅ TEST 3 PASSED: Large article (950 cells) selected 100% by default!");
    } else {
        console.error("❌ TEST 3 FAILED: Large article default selection failed!");
        process.exit(1);
    }

    // Test 4: Unselect All Test (N=0)
    const resultNone = calculateArabicPower("مدد", []);
    console.log(`\n--- TEST 4: Unselect All (N=0) ---`);
    console.log(`Transferred Sum S: ${resultNone.transferredSumDisplay}`);
    console.log(`Answer 1: ${resultNone.answer1.fullDisplay10}`);
    if (resultNone.transferredSumDisplay === "0/1" && resultNone.answer3.fullDisplay10.startsWith("0")) {
        console.log("✅ TEST 4 PASSED: Safe calculation with N=0!");
    } else {
        console.error("❌ TEST 4 FAILED!");
        process.exit(1);
    }

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("==================================================");

} catch (error) {
    console.error(`Error during calculation:`, error);
    process.exit(1);
}
