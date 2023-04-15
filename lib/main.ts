export type NodeKind = "atom" | "negation" | "binary";
export type BinaryOp = "+" | "*";

interface Expr {
  readonly kind: NodeKind;
  as_string: ()  => string;
  simplify:  ()  => Expr;
  negate:    ()  => Expr;
}

export class Atom implements Expr {
  readonly kind: NodeKind = "atom";
  public readonly value: string;

  constructor(val: string) {
    this.value = val;
  }

  public as_string(): string { return this.value; }
  public negate () { return this; }
  public simplify() { return this; }
}

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
    return `(${this.lhs.as_string()}${this.operator}${this.rhs.as_string()})`;
  }

  public simplify() {
    return this;
  }

  public negate (): Expr {
    return this.demorgans_law(false);
  }

  // Return the compliment of this expression
  public demorgans_law (simplify = true) {
    // Get this expression either simplified or not
    const expr = simplify ? this.simplify(): this;

    // Swap Operator
    expr.operator = expr.operator === "*"? "+": "*";
    expr.rhs = expr.rhs.negate();
    expr.lhs = expr.lhs.negate();

    return expr;
  }
}

export class NegationExpr implements Expr {
  readonly kind: NodeKind = "negation";
  public rhs: Expr;

  constructor(operand: Expr) {
    this.rhs = operand;
  }

  public as_string(): string {
    return `~${this.rhs.as_string()}`;
  }

  public negate (): Expr {
    return this.simplify();
  }

  public simplify(): Expr {
    // Handle double negation
    if (this.rhs.kind === "negation") {
      return ((this.rhs) as NegationExpr).rhs;
    } else if (this.rhs.kind == "binary") {
      return this.rhs.negate();
    }

    return this;
  }
}

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
    const allowed = [" ", "+", "*", "(", ")", "~", ...this.alpha_numeric()];
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
  return c <= mx && c >= mn;
}
