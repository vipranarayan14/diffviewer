const dhatuIdEle = document.querySelector(".dhatuId");
const ganaEle = document.querySelector(".gana");
const skippedLinesEle = document.querySelector(".skipped-lines");
const diffsCountEle = document.querySelector(".diffs-count");
const dropArea = document.querySelector("body");
const diffArea = document.querySelector("main");

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
      showDiff(reader.result);
    });
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

  const lineRe = /^(OLD|NEW): (.*?):(.*?)<verb><(.*?)><(.*?)><(.*?)><(.*?)>$/;

  const skippedLines = [];
  const diffs = new Set();
  let isTitleSet = false;

  const lines = diffStr.split("\n");

  lines.forEach((line) => {
    const results = line.match(lineRe);

    if (!results) {
      return skippedLines.push(line);
    }

    const [, version, form, dhatuId, lakara, pv, padi, gana] = results;

    if (!isTitleSet) {
      dhatuIdEle.innerHTML = dhatuId;
      ganaEle.innerHTML = gana;
    }

    diffs.add(`${lakara}_${pv}`);

    const cell = diffArea.querySelector(
      `.${version} .${padi} .${lakara} .pv${pv}`
    );

    if (!cell) {
      return console.error("cell not found");
    }

    cell.innerHTML += ` ${form}`;
  });

  diffsCountEle.innerHTML = diffs.size;

  skippedLinesEle.innerHTML = skippedLines
    .map((line) => `<p>${line}</p>`)
    .join("");
};
