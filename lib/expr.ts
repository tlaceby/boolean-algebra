import { NegationExpr } from "./Negation.ts";

export type NodeKind = "atom" | "negation" | "binary";
export type BinaryOp = "+" | "*";

export default interface Expr {
  readonly kind: NodeKind;
  as_string: () => string;
  simplify: () => Expr;
  negate: () => Expr;
}

export class Atom implements Expr {
  readonly kind: NodeKind = "atom";
  public readonly value: string;

  constructor(val: string) {
    this.value = val;
  }

  public as_string(): string { return this.value; }
  public negate() { 
    
    if (this.value === "0") {
      return new Atom("1");
    } else if (this.value === "1") {
      return new Atom("0");
    }

    return new NegationExpr(this);
  }

  public simplify() { 
    return this;
  }
}