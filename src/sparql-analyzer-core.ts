let to = (f: string) => '../' + f

if (typeof window === 'undefined') {
  to = (f: string) => require('path').join(__dirname, f)
}

import * as Analyzer from './SparqlAnalyzer'
const analyzeSparql = to('analyzeSparql.js')
const examples = to('../examples')
const scripts = {
  analyzeSparql
}

export {
  Analyzer,
  scripts,
  examples
}
