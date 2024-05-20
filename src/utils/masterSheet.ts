import { Json } from "./supabase/types";

export class Statement {
  public values: Map<string, string>;
  constructor(data?: Json) {
    this.values = new Map<string, string>();
    if (!data || data === null) return;
    Object.entries(data).forEach((eachSS: [string, string]) => {
      this.values.set(eachSS[0], eachSS[1]);
    });
  }
  getAmount(key: string): string | undefined {
    return this.values.get(key);
  }
  setAmount(key: string, value: string): void {
    this.values.set(key, value);
  }
  removeEntry(key: string): void {
    this.values.delete(key);
  }
  toJson(): Json {
    const record: { [key: string]: Json | undefined } = {};
    this.values.forEach((amount, userId) => {
      record[userId] = amount;
    });
    return record;
  }
}

export class MasterStatement {
  perUserStatements: Map<string, Statement>;
  constructor(data?: Json) {
    this.perUserStatements = new Map<string, Statement>();
    if (!data || data === null) return;
    Object.entries(data).forEach((perUserStatement) => {
      const ss = new Statement(perUserStatement[1]);
      this.perUserStatements.set(perUserStatement[0], ss);
    });
  }

  toJson(): Json {
    const masterRecord: { [key: string]: Json | undefined } = {};
    this.perUserStatements.forEach((statement, userId) => {
      const pair: { [key: string]: Json | undefined } = {};
      statement.values.forEach((amount, innerUserId) => {
        pair[innerUserId] = amount;
      });
      masterRecord[userId] = pair;
    });

    // console.log(masterRecord);
    return masterRecord;
  }
  getStatement(key: string): Statement {
    const userStatement = this.perUserStatements.get(key);
    if (!userStatement) {
      throw new Error("No statement found with key");
    }
    return userStatement;
  }
  setStatement(key: string, value: Statement): void {
    this.perUserStatements.set(key, value);
  }
  removeStatement(key: string): void {
    this.perUserStatements.delete(key);
  }
}
