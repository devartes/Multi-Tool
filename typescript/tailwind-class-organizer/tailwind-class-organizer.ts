import { walk } from "https://deno.land/std@0.201.0/fs/mod.ts";

const folderPath = "./components";

for await (
  const entry of walk(folderPath, {
    includeDirs: false,
    exts: [".tsx"],
  })
) {
  if (entry.isFile) {
    try {
      const data = await Deno.readTextFile(entry.path);
      const classes = data.match(/class="([^"]+)"/g);

      if (!classes || classes.length === 0) {
        console.error(
          `\x1b[48;5;236m\x1b[97m[Nothing happened]\x1b[0m No Tailwind classes found in ${entry.path}. 😞`,
        );
        continue;
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
        () => sortedClasses.shift() || "",
      );

      console.log(
        `\x1b[42m\x1b[30m\x1b[1m[Success]\x1b[0m Tailwind classes organized in ${entry.path} ✔️`,
      );

      await Deno.writeTextFile(entry.path, updatedData);
    } catch (err) {
      console.error(
        `\x1b[48;5;196m\x1b[97m[Error]\x1b[0m processing the file ${entry.path}: ${err} 😭`,
      );
    }
  }
}
