NPMPATH=./node_modules/.bin
NODE=node
# NODE=node --inspect-brk
# DEBUG=--debug

test: jest analyzeSparql.shortcut analyzeSparql.longcut

src/ShapePathParser.ts: src/ShapePathParser.jison
	$(NODE) $(NPMPATH)/ts-jison -n ShapePath -t typescript -o src/ShapePathParser.ts src/ShapePathParser.jison
	./scripts/redundantBreaks ./src/ShapePathParser.ts

shortcuts: src/ShapePathParser.ts src/SparqlAnalyzer.ts
	$(NODE) $(NPMPATH)/ts-node ./src/parseAndPrint.ts ./__tests__/spz/shortcuts.sp

ANALYZESPARQL=$(NODE) $(NPMPATH)/ts-node ./src/analyzeSparql.ts $(DEBUG)

analyzeSparql.H: src/ShapePathParser.ts src/SparqlAnalyzer.ts
	$(ANALYZESPARQL) -H /shapes --resolve src/resolve.json ../shexTest/schemas/3Eachdot*.json

analyzeSparql.shortcut: src/ShapePathParser.ts src/SparqlAnalyzer.ts
	$(ANALYZESPARQL) '@<http://a.example/S1>.<http://a.example/p1>' schema.json

analyzeSparql.longcut: src/ShapePathParser.ts src/SparqlAnalyzer.ts
	$(ANALYZESPARQL) '/shapes/*[id=<http://a.example/S1>][assert count() = 1]/thisShapeExpr::Shape/expression/thisTripleExpr::TripleConstraint[predicate=<http://a.example/p1>]' schema.json

analyzeSparql.issue: examples/issue/Issue.json examples/issue/Issue2.ttl
	$(ANALYZESPARQL) '@<http://project.example/schema#DiscItem>.<http://project.example/ns#href>,@<http://project.example/schema#Issue>.<http://project.example/ns#spec>/valueExpr/shapeExprs.<http://project.example/ns#href>' examples/issue/Issue.json --data examples/issue/Issue2.ttl --shape-map '<http://instance.example/project1/Issue2>@<http://project.example/schema#Issue>'

jest: src/ShapePathParser.ts src/SparqlAnalyzer.ts
	$(NODE) $(NPMPATH)/jest

