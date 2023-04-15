import Expr,{ NodeKind,BinaryOp } from "./expr.ts";

export class BinaryExpr implements Expr {
  readonly kind: NodeKind = "binary";
  public operator: BinaryOp;
  public lhs: Expr;
  public rhs: Expr;

  constructor(op: BinaryOp, lhs: Expr, rhs: Expr) {
    this.operator = op;
    this.lhs = lhs;
    this.rhs = rhs;
  }

  public as_string() {
    const op = this.operator === "*"? "": "+";
    return `(${this.lhs.as_string()}${op}${this.rhs.as_string()})`;
  }

  public simplify() {
    return this;
  }

  public negate(): Expr {
    return this.demorgans_law(true);
  }

  // Return the compliment of this expression
  public demorgans_law(simplify = true) {
    // Get this expression either simplified or not
    const expr = simplify ? this.simplify() : this;

    // Swap Operator
    expr.operator = expr.operator === "*" ? "+" : "*";
    expr.rhs = expr.rhs.negate();
    expr.lhs = expr.lhs.negate();

    return expr;
  }
}