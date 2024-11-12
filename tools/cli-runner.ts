/** RunCli: ad-hoc harness to capture console.log and stderr (stdout was riddled with ANCII escapes)
 */

export interface OutsAndErrors {
  log:Array<Array<string>>,
  error:Array<Array<any>>
}

export function RunCli (... command: string[]): OutsAndErrors
{
  const exitErrorString = 'process.exit() was called.'
  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  const consoleErrorSpy = jest.spyOn(process.stderr, 'write')
  jest.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error(exitErrorString)
  });

  const oldArgv = process.argv
  process.argv = [process.argv[0]].concat(command)
  expect(() => {
    process.env._INCLUDE_DEPTH = '0'
    require(command[0])
  }).toThrow(exitErrorString)
  process.argv = oldArgv

  const ret: OutsAndErrors = {
    log: consoleLogSpy.mock.calls,
    error: consoleErrorSpy.mock.calls,
  }
  // expect(process.exit).toHaveBeenCalledWith(0)
  consoleLogSpy.mockRestore()
  consoleErrorSpy.mockRestore()
  return ret
}
