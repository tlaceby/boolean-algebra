import Expr,{ NodeKind } from "./expr.ts";

export class NegationExpr implements Expr {
  readonly kind: NodeKind = "negation";
  public rhs: Expr;

  constructor(operand: Expr) {
    this.rhs = operand;
  }

  public as_string(): string {
    return `~${this.rhs.as_string()}`;
  }

  public negate(): Expr {
    if (this.rhs.kind === "atom") {
      return this.rhs.negate();
    } else if (this.rhs.kind === "binary") {
      return this.rhs.negate();
    }
    
    // Handle negation of negation
    const rhs_negated = (this.rhs as NegationExpr).rhs.negate();
    return rhs_negated;
  }

  public simplify(): Expr {
    // Goal of function is not to negate only to simplify
    if (this.rhs.kind === "atom") {
      // To simplify a atom inside a negate expr just negate it
      return this.rhs.negate().simplify();
    } else if (this.rhs.kind === "negation") {
      const rhs_negated = (this.rhs as NegationExpr).rhs;

      if (rhs_negated.kind === "negation") {
        return rhs_negated.simplify();
      }
      
      return rhs_negated;

      // IMPL Negation To infinite depts
    } else { // Binary Expression
      return this.rhs.negate().simplify();
    }
  }
}
