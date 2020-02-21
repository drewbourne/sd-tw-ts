const globby = require("globby");
const fs = require("fs").promises;
const { parse, transformAsync, types } = require("@babel/core");
const rollup = require("rollup");
const rollupBabel = require("rollup-plugin-babel");
const pkg = require("./package.json");

async function build() {
  const paths = await globby(["tokens/**/*.json"]);
  console.log("paths", paths);

  const file = paths[0];
  const json = await fs.readFile(file, "utf8");
  console.log("json", json);

  const source = `module.exports = ${json};`;
  console.log("source", source);

  const parsed = parse(source, {
    sourceType: "module",
  });
  console.log("parsed", parsed);

  const transformed = await transformAsync(source, {
    plugins: [babelPluginSource({ pkg, file })],
  });
  console.log("transformed", transformed.code);
}

build();

function babelPluginSource({ file }) {
  return {
    visitor: {
      ObjectProperty(path) {
        // console.log("path.node", path.node);
        // console.log("path.container", path.container);

        if (types.isStringLiteral(path.node.key)) {
          if (path.node.key.value === "value") {
            // ADD
            console.log(path.node);

            path.insertAfter(
              types.objectProperty(
                types.stringLiteral("__package"),
                types.objectExpression([
                  types.objectProperty(
                    types.stringLiteral("name"),
                    types.stringLiteral(pkg.name),
                  ),
                  types.objectProperty(
                    types.stringLiteral("version"),
                    types.stringLiteral(pkg.version),
                  ),
                ]),
              ),
            );

            path.insertAfter(
              types.objectProperty(
                types.stringLiteral("__source"),
                // types.stringLiteral(
                //   `${file}:${path.node.value.loc.start.line}:${path.node.value.loc.start.column}-${path.node.value.loc.end.line}:${path.node.value.loc.end.column}`,
                // ),
                types.objectExpression([
                  types.objectProperty(
                    types.stringLiteral("start"),
                    types.objectExpression([
                      types.objectProperty(
                        types.stringLiteral("line"),
                        types.numericLiteral(path.node.value.loc.start.line),
                      ),
                      types.objectProperty(
                        types.stringLiteral("column"),
                        types.numericLiteral(path.node.value.loc.start.column),
                      ),
                    ]),
                  ),
                  types.objectProperty(
                    types.stringLiteral("end"),
                    types.objectExpression([
                      types.objectProperty(
                        types.stringLiteral("line"),
                        types.numericLiteral(path.node.value.loc.end.line),
                      ),
                      types.objectProperty(
                        types.stringLiteral("column"),
                        types.numericLiteral(path.node.value.loc.end.column),
                      ),
                    ]),
                  ),
                ]),
              ),
            );

            // path.replaceWithMultiple([
            //   types.objectProperty(
            //     types.stringLiteral("value"),
            //     types.stringLiteral(path.node.value.value),
            //   ),
            //   types.objectProperty(
            //     types.stringLiteral("__package"),
            //     types.objectExpression([
            //       types.objectProperty(
            //         types.stringLiteral("name"),
            //         types.stringLiteral(pkg.name),
            //       ),
            //       types.objectProperty(
            //         types.stringLiteral("version"),
            //         types.stringLiteral(pkg.version),
            //       ),
            //     ]),
            //   ),
            //   types.stringLiteral("__source"),
            //   types.stringLiteral(
            //     `${pkg.name}/${file}:${path.node.value.loc.start.line}:${path.node.value.loc.start.column}-${path.node.value.loc.end.line}:${path.node.value.loc.end.column}`,
            //   ),
            // ]);
            // path.insertAfter(
            //   types.objectProperty(

            // types.objectExpression([
            //   types.objectProperty(
            //     types.stringLiteral("file"),
            //     types.stringLiteral(file),
            //   ),
            //   types.objectProperty(
            //     types.stringLiteral("loc"),
            //     // types.stringLiteral(JSON.stringify(path.node.value.loc)),
            //     types.objectExpression([
            //       types.objectProperty(
            //         types.stringLiteral("start"),
            //         types.objectExpression([
            //           types.objectProperty(
            //             types.stringLiteral("line"),
            //             types.numericLiteral(
            //               path.node.value.loc.start.line,
            //             ),
            //           ),
            //           types.objectProperty(
            //             types.stringLiteral("column"),
            //             types.numericLiteral(
            //               path.node.value.loc.start.column,
            //             ),
            //           ),
            //         ]),
            //       ),
            //       types.objectProperty(
            //         types.stringLiteral("end"),
            //         types.objectExpression([
            //           types.objectProperty(
            //             types.stringLiteral("line"),
            //             types.numericLiteral(path.node.value.loc.end.line),
            //           ),
            //           types.objectProperty(
            //             types.stringLiteral("column"),
            //             types.numericLiteral(
            //               path.node.value.loc.end.column,
            //             ),
            //           ),
            //         ]),
            //       ),
            //     ]),
            //   ),
            // ]),
            // ),
            // );
          }
        }

        // if (types.isIdentifier(path.node.key)) {
        //   if (path.node.key.name === "value") {
        //     // ADD
        //     console.log(path.node);
        //   }
        // }
      },
    },
  };
}

// const rollupInput = {
//   input: '',
//   plugins: [
//     babel()
//   ]
// }

// const rollupOutput = {}

// async function build() {
//   const bundle = await rollup.rollup(inputOptions);
//   const { output } = await bundle.generate(outputOptions);

//   for (const chunkOrAsset of output) {
//     if (chunkOrAsset.type === 'asset') {
//       // For assets, this contains
//       // {
//       //   fileName: string,              // the asset file name
//       //   source: string | Buffer        // the asset source
//       //   type: 'asset'                  // signifies that this is an asset
//       // }
//       console.log('Asset', chunkOrAsset);
//     } else {
//       // For chunks, this contains
//       // {
//       //   code: string,                  // the generated JS code
//       //   dynamicImports: string[],      // external modules imported dynamically by the chunk
//       //   exports: string[],             // exported variable names
//       //   facadeModuleId: string | null, // the id of a module that this chunk corresponds to
//       //   fileName: string,              // the chunk file name
//       //   imports: string[],             // external modules imported statically by the chunk
//       //   isDynamicEntry: boolean,       // is this chunk a dynamic entry point
//       //   isEntry: boolean,              // is this chunk a static entry point
//       //   map: string | null,            // sourcemaps if present
//       //   modules: {                     // information about the modules in this chunk
//       //     [id: string]: {
//       //       renderedExports: string[]; // exported variable names that were included
//       //       removedExports: string[];  // exported variable names that were removed
//       //       renderedLength: number;    // the length of the remaining code in this module
//       //       originalLength: number;    // the original length of the code in this module
//       //     };
//       //   },
//       //   name: string                   // the name of this chunk as used in naming patterns
//       //   type: 'chunk',                 // signifies that this is a chunk
//       // }
//       console.log('Chunk', chunkOrAsset.modules);
//     }
//   }
// }

// build()
