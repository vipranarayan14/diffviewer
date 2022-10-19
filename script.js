const skippedLinesEle = document.querySelector(".skipped-lines");
const diffsCountEle = document.querySelector(".diffs-count");
const dropArea = document.querySelector("body");
const diffArea = document.querySelector("main");

// const testStr = `9a10
// OLD:  acaNdiDvam:cad1<verb><luf><23><AP><BvAxi>
// 33a35
// OLD:  caNdaXvam:cad1<verb><viXilif><23><AP><BvAxi>
// 45d46
// NEW:  caNdeXvam:cad1<verb><viXilif><23><AP><BvAxi>
// `;

const preventDefaults = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

dropArea.addEventListener(
  "drop",
  (ev) => {
    const data = ev.dataTransfer.files;
    if (!data) {
      return;
    }

    const file = data[0];

    const reader = new FileReader();

    reader.readAsText(file);

    reader.addEventListener("loadend", () => {
      // console.log(reader.result);
      showDiff(reader.result);
    });

    // file.getAsString((diffStr) => {
    //   // if (!diffStr) return;

    //   console.log(diffStr);
    // });
  },
  false
);

const resetTables = () => {
  diffArea.querySelectorAll("td").forEach((cell) => {
    cell.innerHTML = "&nbsp;";
  });
};

const showDiff = (diffStr) => {
  resetTables();

  const lineRe = /^(OLD|NEW): (.*?):.*?<verb><(.*?)><(.*?)><(.*?)><(.*?)>$/;

  const skippedLines = [];
  const diffs = new Set();

  diffStr.split("\n").forEach((line) => {
    const results = line.match(lineRe);

    if (!results) {
      return skippedLines.push(line);
    }

    const [_, version, form, lakara, pv, padi] = results;

    diffs.add(`${lakara}_${pv}`);

    const cell = diffArea.querySelector(
      `.${version} .${padi} .${lakara} .pv${pv}`
    );

    if (!cell) {
      return console.error("cell not found");
    }

    cell.innerHTML = form;
  });

  diffsCountEle.innerHTML = diffs.size;

  skippedLinesEle.innerHTML = skippedLines
    .map((line) => `<p>${line}</p>`)
    .join("");
};
// document.body.addEventListener("dragleave", (e) => {
//   document.body.style.cssText = `background: white;`;
// });
