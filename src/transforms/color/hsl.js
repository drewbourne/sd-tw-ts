const Color = require("tinycolor2");

function isColor(property) {
  return property.attributes.category === "color";
}

module.exports = {
  name: "color/hsl",
  type: "value",
  matcher: isColor,
  transformer: function(property, config) {
    var color = Color(property.value);
    return color.toHslString();
  }
};
