const fs = require("fs");
const path = require("path");
const stylus = require("stylus");

function styles() {
  const content = fs.readFileSync(path.join(__dirname, "styles", "index.styl"));
  stylus(content.toString("utf8"))
    .set("paths", [path.join(__dirname, "styles")])
    .set("filename", "index.styl")
    .render((err, css) => {
      if (err) {
        return error(err);
      }
      fs.writeFileSync(path.join(process.cwd(), "public", "index.css"), css);
    });
}

fs.watch(path.join(__dirname, "./styles"), (e, filename) => styles());

styles();
