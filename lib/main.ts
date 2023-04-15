import { BinaryExpr } from "./Binary.ts";
import { NegationExpr } from "./Negation.ts";
import Expr, { Atom, BinaryOp } from "./expr.ts"

export class Parser {
  private readonly expression: string;
  private readonly tokens: string[];
  private position: number;

  constructor(expr: string) {
    this.expression = expr;
    this.tokens = this.tokenize();
    this.position = 0;
  }

  private alpha_numeric() {
    const allowed: string[] = [];
    const az = "abcdefghijklmnopqrstuvwxyz";
    allowed.push(...az.split(""));
    allowed.push(...az.toUpperCase().split(""));
    return allowed;
  }

  private tokenize() {
    const allowed = [" ", "+", "*", "(", ")", "~", ...this.alpha_numeric(), "0", "1"];
    for (const ch of this.expression.split("")) {
      if (!allowed.includes(ch)) {
        throw `Invalid Expression: ${ch} not allowed!`;
      }
    }

    return this.expression.toUpperCase().replaceAll(" ", "").split("");
  }

  private next() {
    const c = this.current() as string;
    this.position++;
    return c;
  }

  private current() {
    return this.tokens.at(this.position) as string;
  }

  public expr(): Expr {
    return this.binary();
  }

  private unary(): Expr {
    if (this.current() === "~") {
      this.next();
      return new NegationExpr(this.unary());
    }

    return this.primary();
  }

  private not_eof() {
    return this.position < this.tokens.length;
  }

  private binary() {
    let left = this.unary();
    while (
      this.not_eof() &&
      (this.current() === "+" || this.current() == "(" ||
        is_alpha(this.current()))
    ) {
      let op = this.next();

      if (op !== "+") {
        op = "*";
        this.position--;
      }

      const right = this.unary();
      left = new BinaryExpr(op as BinaryOp, left, right);
    }

    return left;
  }

  private primary(): Expr {
    if (this.current() == "(") {
      this.next();
      const expr = this.expr();
      if (this.current() !== ")") {
        throw `Expected closing ) at ${this.position + 1} in expression.`;
      }

      return expr;
    }

    return new Atom(this.next());
  }

  public simplify() {
    const expr = this.expr();
    return expr.simplify().as_string();
  }
}

function is_alpha(ch: string) {
  const mn = "a".charCodeAt(0);
  const mx = "z".charCodeAt(0);
  const c = ch.toLowerCase().charCodeAt(0);

  if (ch == "0" || ch == "1") return true;
  return c <= mx && c >= mn;
}

// console.log(new Parser("01").simplify());