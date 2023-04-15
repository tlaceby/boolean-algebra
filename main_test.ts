import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";
import { Parser } from "./lib/main.ts";

// AND
// Deno.test(function zero_and_one() {
//   const expr = new Parser("01").simplify();
//   assertEquals(expr, "0");
// });

// Deno.test(function zero_and_zero() {
//   const expr = new Parser("00").simplify();
//   assertEquals(expr, "0");
// });

// Deno.test(function one_and_zero() {
//   const expr = new Parser("10").simplify();
//   assertEquals(expr, "0");
// });

// Deno.test(function one_and_one() {
//   const expr = new Parser("11").simplify();
//   assertEquals(expr, "1");
// });


// OR
// Deno.test(function zero_or_zero() {
//   const expr = new Parser("0+0").simplify();
//   assertEquals(expr, "0");
// });

// Deno.test(function zero_or_one() {
//   const expr = new Parser("0+1").simplify();
//   assertEquals(expr, "1");
// });

// Deno.test(function one_or_zero() {
//   const expr = new Parser("1+0").simplify();
//   assertEquals(expr, "1");
// });

// Deno.test(function one_or_one() {
//   const expr = new Parser("1+1").simplify();
//   assertEquals(expr, "1");
// });
 
// Negations

Deno.test(function not_zero() {
  const expr = new Parser("~0").simplify();
  assertEquals(expr, "1");
});

Deno.test(function not_one () {
  const expr = new Parser("~1").simplify();
  assertEquals(expr, "0");
});

Deno.test(function demorgans_or() {
  const expr = new Parser("~(X+Y)").simplify();
  assertEquals(expr, "(~X~Y)");
});

Deno.test(function demorgans_and() {
  const expr = new Parser("~(XY)").simplify();
  assertEquals(expr, "(~X+~Y)");
});

Deno.test(function five_negates() {
  const expr = new Parser("~~~~~X").simplify();
  assertEquals(expr, "~X");
});


Deno.test(function double_negate() {
  const expr = new Parser("~~X").simplify();
  assertEquals(expr, "X");
});

// // Identity Laws
// Deno.test(function identity_and() {
//   const expr = new Parser("X1").simplify();
//   assertEquals(expr, "X");
// });

// Deno.test(function identity_and_2() {
//   const expr = new Parser("1X").simplify();
//   assertEquals(expr, "X");
// });

// Deno.test(function identity_or() {
//   const expr = new Parser("X+0").simplify();
//   assertEquals(expr, "X");
// });

// Deno.test(function identity_or_2() {
//   const expr = new Parser("X+0").simplify();
//   assertEquals(expr, "X");
// });

