const StyleDictionary = require("style-dictionary")
  .registerFormat(require("./src/formats/javascript/esm"))
  .registerFormat(require("./src/formats/tailwind/config"))
  .extend({
    source: ["tokens/**/*.json"],
    platforms: {
      web: {
        buildPath: "css/",
        files: [
          {
            destination: "web/tokens.mjs",
            format: "javascript/esm",
          },
          {
            destination: "tailwind.config.js",
            format: "tailwind/config",
          },
        ],
        transforms: [
          "attribute/cti",
          "name/ti/camel",
          "size/rem",
          "attribute/color",
        ],
      },
    },
  });

StyleDictionary.buildAllPlatforms();
