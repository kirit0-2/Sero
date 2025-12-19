let add = 0
function sum(numbers) {
    if (numbers.length != 0) {
        for (let index = 0; index < numbers.length; index++) {
            add = add + numbers[index];
        }
    } else {
        return 0
    }
    return add
}

console.log("=== SINGLE ELEMENT IN AN ARRAY ===\n");

// Single element means array has only ONE number
// Your loop will run only ONCE
console.log("Example: [42]");
add = 0;
let result1 = sum([42]);
console.log("- Array length: 1");
console.log("- Loop runs: 1 time (index 0 only)");
console.log("- Iteration 1: add = 0 + 42 = 42");
console.log("- Result:", result1);
console.log("- Logic: Even with one element, the accumulator still starts at 0,");
console.log("  then adds that single element to get the final sum\n");

console.log("=== MULTIPLE NUMBERS SHOULD SUM TO CORRECT TOTAL ===\n");

// Multiple elements means the loop runs multiple times
// Each iteration ADDS the current number to the accumulator
console.log("Example: [10, 5, 3]");
add = 0;
let result2 = sum([10, 5, 3]);
console.log("- Array length: 3");
console.log("- Loop runs: 3 times");
console.log("- Iteration 1 (index 0): add = 0 + 10 = 10");
console.log("- Iteration 2 (index 1): add = 10 + 5 = 15");
console.log("- Iteration 3 (index 2): add = 15 + 3 = 18");
console.log("- Result:", result2);
console.log("- Logic: Each number is added to the previous total, building up the sum\n");

console.log("=== KEY CONCEPT: ACCUMULATOR ===");
console.log("The 'add' variable is like a counter:");
console.log("- Starts at 0");
console.log("- Gets updated on each loop iteration");
console.log("- Previous value + current element = new value");
console.log("- Final value is returned as the sum\n");

// More examples
console.log("=== MORE EXAMPLES ===\n");
add = 0;
console.log("Single element [7]:", sum([7]));

add = 0;
console.log("Two elements [3, 4]:", sum([3, 4]));

add = 0;
console.log("Many elements [1, 2, 3, 4, 5]:", sum([1, 2, 3, 4, 5]));

