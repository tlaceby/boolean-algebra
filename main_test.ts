import { assertEquals } from "https://deno.land/std@0.171.0/testing/asserts.ts";
import { Parser } from "./lib/main.ts";

Deno.test(function compliment() {
  const expr = new Parser("~(X+Y)").simplify();
  assertEquals(expr, "(X*Y)");
});

Deno.test(function compliment() {
  const expr = new Parser("~~X").simplify();
  assertEquals(expr, "X");
});
