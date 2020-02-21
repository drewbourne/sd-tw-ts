const { pipe, filter, indexBy, path, pick, map } = require("ramda");

const isCategory = (category) => {
  return (property) => property.attributes.category === category;
};

function toColor(properties) {
  const colors = {};

  properties.forEach((p) => {
    if (!colors[p.attributes.type]) colors[p.attributes.type] = {};

    colors[p.attributes.type][p.attributes.item] = p.value;
  });

  return colors;
}

const toTailwindColor = pipe(filter(isCategory("color")), toColor);

const toTailwindSpacing = pipe(
  filter(isCategory("size")),
  indexBy(path(["attributes", "item"])),
  map((property) => property.value),
);

/**
JavaScript ES Modules
 */
module.exports = {
  name: "tailwind/config",
  formatter: function(dictionary, options) {
    const config = propertiesToConfig(dictionary, options);
    const lines = [];
    lines.push(`module.exports = ${JSON.stringify(config, null, 2)};`);
    lines.push("\n");
    return lines.join("\n").trim();
  },
};

function propertiesToConfig(dictionary, options) {
  console.log("tailwind/config", dictionary.allProperties);

  const config = {
    prefix: "omni-",
    theme: {
      colors: toTailwindColor(dictionary.allProperties),
      spacing: toTailwindSpacing(dictionary.allProperties),

      // colors: propertiesToColors(
      //   dictionary.allProperties.filter(p => p.attributes.category === "color")
      // ),
      // spacing: {}
    },
    corePlugins: ["margin", "padding", "backgroundColor"],
  };
  return config;
}
