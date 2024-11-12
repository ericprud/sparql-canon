// Parse a SPARQL query to a JSON object
console.log("BEFORE");
import * as SparqlJs from 'sparqljs'; console.log("HERE", SparqlJs);
// import SparqlJs = require('sparqljs');console.log("HERE",
// SparqlJs);
// const SparqlParser = SparqlJs.Parser;
// const parser = new SparqlParser();
// const parsedQuery = parser.parse(
//   'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
//   'SELECT * { ?mickey foaf:name "Mickey Mouse"@en; foaf:knows ?other. }');


export function setupCounter(element: HTMLInputElement) {
  let counter = 0;

  const adjustCounterValue = (value: number)  => {
    if (value >= 10) return value - 10;
    if (value <= -10) return value + 10;
    return value;
  };

  const setCounter = (value: number) => {
    counter = adjustCounterValue(value);
    element.value = '' + counter;
  };

  document.getElementById('increaseByOne')?.addEventListener('click', () => setCounter(counter + 1));
  document.getElementById('decreaseByOne')?.addEventListener('click', () => setCounter(counter - 1));
  document.getElementById('increaseByTwo')?.addEventListener('click', () => setCounter(counter + 2));
  document.getElementById('decreaseByTwo')?.addEventListener('click', () => setCounter(counter - 2));

  // setCounter(0);
  element.value = `
BASE   <http://example.org/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX schema: <http://schema.org/>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT (?o AS ?predicate) ?title WHERE {
  {
    ?s foaf:knows ?o .
    ?s a ?title
  } UNION {
    ?s schema:birthDate ?val
    BIND (schema:birthDate AS ?o)
    BIND (datatype(?val) AS ?dt)
    BIND (substr(str(?dt), strlen(str(xsd:)) + 1) AS ?title1)
    OPTIONAL {
      VALUES (?dt ?type_code) {
        (xsd:time "Time")
        (xsd:date "Date")
      }
    }
    BIND (COALESCE(?type_code, "UNKNOWN") as ?title)
  } UNION {
    {
      ?s foaf:topic_interest ?o .
    }
    {
      ?o dcterms:title ?title
    }
  } 
  VALUES (?s) {
    (<bob#me>)
    (<bob#me>)
  }
}
LIMIT 100`;
}

setupCounter(<HTMLInputElement>document.getElementById('counter-value'));

