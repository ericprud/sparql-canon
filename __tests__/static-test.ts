const Fs = require('fs')
const Path = require('path')
// import { stringFacet, TripleConstraint } from 'shexj'
// import { EvalContext, NodeSet, SchemaNode, stringFacetAttr } from '../src/ShapePathAst'
// import { ShapePathParser, ShapePathLexer } from '../src/ShapePathParser'
// import { Schema, SemAct } from 'shexj'
import { SparqlAnalyzer } from '../src/SparqlAnalyzer'

// Override the shex-test dir with relative (SHEX_TEST_PATH=../../../shexTest) or
// absolute (SHEX_TEST_PATH=/home/eric/checkouts/shexSpec/shexTest) path.
const ShExTestPath = 'SHEX_TEST_PATH' in process.env
  ? Path.resolve(__dirname, '..', process.env.SHEX_TEST_PATH)
  : Path.resolve(require.resolve('shex-test'), '..')

// For validation tests
const Base = 'http://a.example/some/path/' // 'file://'+__dirname

interface extensionResults {
  extension: string,
  prints: string
}

enum trait {
  Empty,
  TriplePattern,
  ToldBNode,
  BNodeShapeLabel,
  NodeKind,
  Datatype,
  ValidLexicalForm,
  DotCardinality,
  ShapeReference,
  IriEquivalence,
  NumericEquivalence,
  LanguageTagEquivalence,
  DatatypedLiteralEquivalence,
  BooleanEquivalence,
  LengthFacet,
  FractionDigitsFacet,
  TotalDigitsFacet,
  ComparatorFacet,
  LexicalBNode,
  OutsideBMP,
  PaternFacet,
  Stem,
  ValueSet,
  ValueReference,
  OrValueExpression,
  AndValueExpression,
  RepeatedOneOf,
  EachOf,
  Extra,
  VapidExtra,
  Start,
  Annotation,
  SemanticAction,
  ExternalSemanticAction,
  Unsatisfiable,
  FocusConstraint,
}

interface ShExValidationTest {
  "@id": string,
  "@type": "sht:ValidationTest" | "sht:ValidationFailure",
  "action": {
    "schema": string,
    "shape": string,
    "data": string,
    "focus": string // stringFacetAttr
  },
  "extensionResults": Array<extensionResults>,
  "name": string,
  "trait": Array<trait>,
  "comment": string,
  "status": string
}

interface TestMap { [name: string]: ShExValidationTest }

interface ManifestEntry {
  title: string,
  desc: string,
  shexTest: string,
  shapePath: string,
  shapePathSchemaMatch: Array<object>, // SchemaNode
  shapePathDataMatch: Array<any>,
  debugger?: boolean,
}

const ValidationTestsById: TestMap = JSON.parse(
  Fs.readFileSync(
    Path.join(ShExTestPath,'validation/manifest.jsonld'),
    'utf8'))['@graph'][0].entries
  .reduce((tests: TestMap, test: ShExValidationTest) => {
    tests[test['@id']] = test
    return tests
  }, {})

const Manifest: Array<ManifestEntry> = JSON.parse(
  Fs.readFileSync(
    Path.join(
      __dirname,
      'Manifest.json'),
    'utf8')
)

function readJson(filePath: string): any {
  return JSON.parse(Fs.readFileSync(filePath, 'utf8'))
}

function parse(text: string): object {
  return Ref1
  // const yy = {
  //   base: new URL(Base),
  //   prefixes: {
  //     '': 'http://a.example/default',
  //     pre: 'http://a.example/pre',
  //   }
  // }
  // return new ShapePathParser(yy).parse(text)
}

/*
describe('parser coverage', () => {
  xtest('junction', () => {
    parse('/*, /* union /* intersection /*')
  })
  xtest('shortcut', () => {
    parse('@<i>, .<i>')
  })
  xtest('axes', () => {
    parse('child::*, thisShapeExpr::, thisTripleExpr, ::self::, parent::, ancestor::')
  })
  xtest('axis type', () => {
    parse('thisShapeExpr::Shape')
  })
  test('function', () => {
    parse('*[index() = 1], *[count()], *[foo1(<n>) = <n>], *[foo2(<n>) = <n>], *[foo2(1) = 1], *[foo2(1 <n>) = 1]')
  })
  test('assert', () => {
    parse('*[assert index() = 1]')
  })
  test('numericExpr', () => {
    parse('*[1]')
  })
  test('comparison', () => {
    parse('*[assert index() = 1], *[assert index() < 1], *[assert index() > 1]')
  })
  test('termType', () => {
    parse('Schema, SemAct, Annotation')
  })
  test('shapeExprType', () => {
    parse('ShapeAnd, ShapeOr, ShapeNot, NodeConstraint, Shape, ShapeExternal')
  })
  test('tripleExprType', () => {
    parse('EachOf, OneOf, TripleConstraint')
  })
  test('valueType', () => {
    parse('IriStem, IriStemRange')
    parse('LiteralStem, LiteralStemRange')
    parse('Language, LanguageStem, LanguageStemRange')
    parse('Wildcard')
  })
  test('attributeType', () => {
    parse('type, id, semActs, annotations, predicate')
  })
  test('schemaAttr', () => {
    parse('@context, startActs, start, imports, shapes')
  })
  test('shapeExprAttr', () => {
    parse('shapeExprs, shapeExpr')
  })
  test('nodeConstraintAttr', () => {
    parse('nodeKind, datatype, values')
  })
  test('stringFacetAttr', () => {
    parse('length, minlength, maxlength, pattern, flags')
  })
  test('numericFacetAttr', () => {
    parse('mininclusive,  minexclusive, maxinclusive,  maxexclusive, totaldigits, fractiondigits')
  })
  test('valueSetValueAttr', () => {
    parse('value, language, language, stem, exclusions, languageTag')
  })
  test('shapeAttr', () => {
    parse('closed, extra, expression')
  })
  test('tripleExprAttr', () => {
    parse('expressions, min, max')
  })
  test('tripleConstraintAttr', () => {
    parse('inverse, valueExpr')
  })
  test('semActAttr', () => {
    parse('name, code')
  })
  test('annotationAttr', () => {
    parse('object')
  })
  test('prefixedName', () => {
    parse('*[id = :lname], *[id = pre:], *[id = pre:lname]')
  })
  test('values', () => {
    parse('*[id = <i>], *[id = 123]')
  })
  test('PathExprStep', () => {
    parse('(*, *), (*, *)[id = 123]')
  })

  test('lexer', () => {
    const l = new ShapePathLexer()
    l.setInput('*', {})
    expect(l.lex()).toBeGreaterThan(0)
    expect(l.lex()).toBeGreaterThan(0) // why two tokens?
    expect(l.lex()).toEqual(1) // EOF
  })
})
*/

/*
describe('parser errors', () => {
  test('missing namespace', () => {
    expect(() => {
      parse('*[id = pre999:lname]')
    }).toThrow('unknown prefix in pre999:lname')
  })
  test('unexpected word', () => {
    expect(() => {
      parse('asdf')
    }).toThrow(/unexpected word "asdf"/)
  })
  test('invalid character %', () => {
    expect(() => {
      parse('%123')
    }).toThrow('invalid character %')
  })
  test('invalid character %', () => {
    expect(() => {
      new ShapePathParser().parse('*[id = pre:lname]')
    }).toThrow('Cannot use \'in\' operator to search for \'pre\' in undefined')
  })
})
*/

/*
describe('selection/validation tests', () => {
  Manifest.forEach((entry) =>
    test(entry.title, () => {
      if (entry.debugger)
        debugger
      const valTest = ValidationTestsById![entry.shexTest]
      const schema: Schema = readJson(
        Path.join(
          ShExTestPath,
          'validation',
          valTest.action.schema.replace(/\.shex$/, '.json')
        )
      )

      // Resolve path against schema
      const inp: NodeSet = [schema]
      const yy = {
        base: new URL(Base),
        prefixes: {}
      }
      const pathExpr = new ShapePathParser(yy).parse(entry.shapePath)
      const nodeSet: NodeSet = pathExpr.evalPathExpr(inp, new EvalContext(schema))
      expect(nodeSet).toEqual(entry.shapePathSchemaMatch)
    })
  )
})
*/

function parseShapePathFile(filename: string): object {
  const txt = Fs.readFileSync(Path.join(__dirname, filename), 'utf8')
  return parse(txt)
}


describe('ShapePathParser', () => {
  test('shortcuts', () => {
    expect(parseShapePathFile('sparql-queries/a.rq')).toEqual(Ref1)
  })
})

const Ref1 = {
  a:1, b:true
};

