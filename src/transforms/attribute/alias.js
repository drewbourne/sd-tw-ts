const ALIAS_PATTERN = /\{(.+)\}/;

function isAlias(property) {
  return ALIAS_PATTERN.test(property.original.value);
}

/*
{
  "aliases": {
    "<source-path>": [ "<property-path>", ... ]
  }
}

{
  "references": WeakMap<Property, Property[]>
}
*/

const __alias = new Symbol("transform/attribute/alias");

module.exports = {
  name: "attribute/alias/track",
  type: "attribute",
  matcher: isAlias,
  transformer: function(property, options) {
    prepare(options);

    const aliases = extractAliases(property);

    trackAliases(property, aliases, options);

    // NOPE won't work
    // for each property -> run matching transforms
    // BUT we need a hook to run: after all properties are transformed but not yet resolved

    return {
      get aliases() {
        return options[__alias].get(property.path.join(".")) || [];
      }
    };

    // const [, path] = ALIAS_PATTERN.exec(property.original.value) || [];
    // if (path) {
    //   if (!options.aliases[path]) {
    //     options.aliases[path] = [];
    //   }
    //   options.aliases[path].push(property.path.join("."));
    // }
    // console.log("transforms attribute/alias %o", options);
  }
};

function prepare(options) {
  if (!options[__alias]) {
    options[__alias] = new Map();
  }
}

function track(property, options) {
  const properties = options[__alias].get(property);
  options[__alias].set(property);
}
