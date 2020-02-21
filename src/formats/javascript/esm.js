/**
JavaScript ES Modules
 */
module.exports = {
  name: "javascript/esm",
  formatter: function(dictionary) {
    const lines = [];
    lines.push(...dictionary.allProperties.map(propertyToExport));
    lines.push("\n");
    return lines.join("\n");
  },
};

function propertyToExport(property) {
  const lines = [];

  // console.log(JSON.stringify(property, null, 2));

  lines.push(`\n/**`);
  lines.push(`\n \`${property.name}\``);

  if (property.comment) {
    lines.push(`\n`, property.comment);
  }

  lines.push(`\n */`);

  // TODO escape property name for JS
  // TODO escape property value for JS
  lines.push(`\nexport const ${property.name} = ${toValue(property.value)};`);

  return lines.join("");
}

function toValue(value) {
  // return typeof value === "number" ? value : `"${value}"`;
  return JSON.stringify(value, null, 2);
}
