// Parse a SPARQL query to a JSON object
const SparqlParser = require('sparqljs').Parser;
const parser = new SparqlParser();
const parsedQuery = parser.parse(
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
  'SELECT * { ?mickey foaf:name "Mickey Mouse"@en; foaf:knows ?other. }');

const { SparqlAnalyzer, SparqlGenerifier } = require('./dist/SparqlAnalyzer');
const analyzer = new SparqlAnalyzer('hi');
const analysis = analyzer.run(parsedQuery);
console.log(analysis);
const generifier = new SparqlGenerifier('there');
const generified = generifier.run(parsedQuery);
// Regenerate a SPARQL query from a JSON object
const SparqlGenerator = require('sparqljs').Generator;
const generator = new SparqlGenerator();
const generatedQuery = generator.stringify(generified);
console.log(JSON.stringify(parsedQuery), generatedQuery)
