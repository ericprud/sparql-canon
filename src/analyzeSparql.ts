#!/usr/bin/env ts-node
const Fs = require('fs')
import { SparqlAnalyzer } from './SparqlAnalyzer'

const Base = 'file://' + __dirname

const { Command } = require('commander')

export let log = (...args: any) => { }

export const cmd = new Command()
  .arguments('<pathStr> <files...>')
  .option('-r, --resolve <resolve.json>', 'JSON resolve file to use for URI resolution')
  .option('-H, --with-filename', 'Print the file name for each match.  This is the default when there is more than one file to search.')
  .option('-D, --debug', 'display some debugging')

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
  run(pathStr, files, command, commander).forEach( ([leader, schema, schemaNodes]) => {
    console.log(leader + JSON.stringify(schemaNodes, null, 2))
  })
}

export function run (pathStr: string, files: string[], command: any, commander: any) {
  if (command.debug) {
    log = console.warn
    log('Executing %s with options %o on files %s', pathStr, command, files.join(','))
  }
  let yy = {
    base: new URL(Base),
    prefixes: {}
  }
  if (command.resolve) {
    yy = readJson(command.resolve)
    log('Loaded URI resolution spec from %s', command.resolve)
  }

  // const pathExpr = new ShapePathParser(yy).parse(pathStr)
  // log('%s compiles to %s', pathStr, JSON.stringify(pathExpr))
  return files.map(filePath => {
    log('Executing %s on %s', pathStr, filePath)
    const schema: object = readJson(filePath)
    const leader = command['with-filename'] ? filePath + ': ' : ''
    return [leader, schema]
    // const schemaNodes: NodeSet = pathExpr.evalPathExpr([schema], new EvalContext(schema))
    // return [leader, schema, schemaNodes]
  })
}

function readJson(filePath: string): any {
  return JSON.parse(Fs.readFileSync(filePath, 'utf8'))
}

