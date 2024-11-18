#!/usr/bin/env ts-node
// import { Parser as SparqlParser } from 'sparqljs';
import * as Fs from 'fs';
// const Fs = require('fs')
import { SparqlAnalyzer } from './SparqlAnalyzer'
// import { SparqlQuery, Parser as SparqlParser } from 'sparqljs'
// import * as SparqlJs from 'sparqljs';
import {SparqlQuery} from './fhir-sparql-js/RdfUtils';
// import {Query as SparqlQuery1} from 'sparqljs';
import jsonpath from 'jsonpath'
import {QueryAnalyzer, PredicateToShapeDecls} from './fhir-sparql-js/QueryAnalyzer';
import * as ShExJ from 'shexj';
const Bunyan = require('bunyan');

const Base = 'file://' + __dirname

const { Command } = require('commander')

const DebugLevels = [
      'trace',
      'debug',
      'info',
      'warn',
      'error',
      'fatal',
]
const noop = (...args: any) => { }
export let log = DebugLevels.reduce((obj, func) => { obj[func] = noop; return obj }, {} as any)

export const cmd = new Command()
  .arguments('<pathStr> <files...>')
  .option('-r, --json <string>', 'parse JSON directly from following command line argument')
  .option('-H, --with-filename', 'Print the file name for each match.  This is the default when there is more than one file to search.')
  .option('-D, --debug', 'display some debugging:'+DebugLevels.join('|'))

if (require.main === module || process.env._INCLUDE_DEPTH === '0') {
  // test() // uncomment to run a basic test
  cmd.action(report).parse()
  process.exit(0)
}

function test (): void {
  console.log(run(
    '/where[]'
      + 'triples[]'
      + 'subject/termType="Variable"',
    ['examples/issue/Issue.rq'],
    { },
    null
  )[0])
}

export function report (pathStr: string, files: string[], command: any, commander: any) {
  run(pathStr, files, command, commander).forEach(
    ({leader, query, got}, idx) => {
      console.log(idx, pathStr, got, leader + JSON.stringify(query, null, 2))
    }
  )
}

export function run (pathStr: string, files: string[], command: any, commander: any) {
  if (command.debug) {
    log = Bunyan.createLogger({
      name: 'analyzeSparql',
      level: cmd.debug || 'warn',
      streams: [
        // log INFO and above to stdout
        { level: cmd.debug || 'warn', stream: process.stdout },
        // log ERROR and above to a file
        { level: 'error', path: './error.log' }
      ],
    });
    log = console.warn
    log('Executing %s with options %o on files %s', pathStr, command, files.join(','))
  }

  // const pathExpr = new ShapePathParser(yy).parse(pathStr)
  // log('%s compiles to %s', pathStr, JSON.stringify(pathExpr))
  return files.map(filePath => {
    log('Executing %s on %s', pathStr, filePath)
    // const query = readSparql(filePath, command);debugger
    const queryStr = Fs.readFileSync(filePath, 'utf8');
    const parserOpts = {
      prefixes: undefined,
      baseIRI: 'http://localhost/some/path/and/file.txt',
      // factory: N3.DataFactory,
      skipValidation: false,
      skipUngroupedVariableCheck: false,
      pathOnly: false,
    }
    const query = SparqlQuery.parse(queryStr, parserOpts);
    const leader = command['withFilename'] ? filePath + ': ' : ''
    const got = jsonpath.query(query, pathStr);debugger
    const arcTree = new QueryAnalyzer(null as unknown as ShExJ.Schema).getArcTrees(query)
    return {leader, query, got}
    // const schemaNodes: NodeSet = pathExpr.evalPathExpr([schema], new EvalContext(schema))
    // return [leader, schema, schemaNodes]
  })
}
