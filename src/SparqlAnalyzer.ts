/** ShapePath types
 */

export abstract class Serializable {
  abstract t: string
}

export class SparqlAnalyzer extends Serializable {
  t = 'SparqlAnalyzer'
  constructor(
    public expect: string,
  ) { super() }
}

