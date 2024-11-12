const Path = require('path')
import { RunCli } from '../tools/cli-runner'

describe('parseAndPrint script', () => {
  test('query data', () => {
    const {log, error} = RunCli(
      '../src/parseAndPrint.ts',
      './__tests__/sparql-queries/a.rq',
    );
    expect(error).toEqual([])
    expect(JSON.parse(log[0][0])).toEqual({
      a:1, b:true
    })
  })
})

