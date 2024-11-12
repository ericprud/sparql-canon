/** SPARQL query toolbox
 */

import { SparqlQuery } from "sparqljs";

abstract class Serializable {
  abstract t: string
}

class Analysis extends Serializable {
  t = 'Analysis'

  constructor(
    public got: string,
  ) { super() }
}

export class SparqlAnalyzer extends Serializable {
  t = 'SparqlAnalyzer'

  constructor(
    public p1: string,
  ) { super() }

  run (parsed: object) {
    return new Analysis(this.p1);
  }
}

export class SparqlGenerifier extends Serializable {
  t = 'SparqlGenerifier'

  constructor(
    public p1: string,
  ) { super() }

  run (parsedQuery1: SparqlQuery) {
    const parsedQuery = JSON.parse(JSON.stringify(parsedQuery1));
    parsedQuery.variables = ['?mickey'];
    return parsedQuery;
  }
}

