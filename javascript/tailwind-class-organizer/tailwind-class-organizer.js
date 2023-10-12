const fs = require("fs");

const fileName = process.argv[2];

if (!fileName) {
  console.error("Please provide the file name as an argument.");
  process.exit(1);
}

fs.readFile(fileName, "utf8", (err, data) => {
  if (err) {
    console.error(
      `\x1b[31m\x1b[1mError reading the file ${fileName}: ${err}\x1b[0m 😞`,
    );
    process.exit(1);
  }

  const classes = data.match(/class="([^"]+)"/g);

  if (!classes) {
    console.error(
      "\x1b[34m\x1b[1mNo Tailwind classes found in the file.\x1b[0m 😞",
    );
    process.exit(1);
  }

  const sortedClasses = classes.map((classString) => {
    const classList = classString.match(/class="([^"]+)"/);
    if (classList && classList[1]) {
      const classes = classList[1].split(" ").sort().join(" ");
      return `class="${classes}"`;
    }
    return classString;
  });

  const updatedData = data.replace(
    /class="([^"]+)"/g,
    () => sortedClasses.shift(),
  );

  console.log(
    "\x1b[42m\x1b[30m\x1b[1m[Success]\x1b[0m Tailwind classes organized in " +
      fileName +
      " 😄",
  );

  fs.writeFile(fileName, updatedData, "utf8", (err) => {
    if (err) {
      console.error(
        `\x1b[31m\x1b[1mError writing the file ${fileName}: ${err}\x1b[0m 😞`,
      );
      process.exit(1);
    }
  });
});
