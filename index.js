(() => {
  const [buttonsForm] = document.forms;
  const [yearInput, createButtonBtn, createSheetBtn] = buttonsForm;
  const DPI = 600;

  createButtonBtn.addEventListener("click", async () => {
    const btnCanvas = await createButtonCanvas(yearInput.value);
    btnCanvas.toBlob(async (blob) =>
      downloadBlob(
        await changeDpiBlob(blob, DPI),
        "button_" + yearInput.value + ".png"
      )
    );
  });

  createSheetBtn.addEventListener("click", async () =>
    createSheetCanvas(
      await createButtonCanvas(yearInput.value),
      4517,
      6050
    ).toBlob(async (blob) =>
      downloadBlob(
        await changeDpiBlob(blob, DPI),
        "button_sheet_" + yearInput.value + ".png"
      )
    )
  );

  yearInput.value = new Date().getFullYear();

  const createButtonCanvas = (year) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        ctx.font = "288pt CoelnischeCurrentFraktur";
        ctx.fillStyle = "blue";

        const leftDigits = year.substring(0, 2);
        const rightDigits = year.substring(2);

        const measureLeftDigits = ctx.measureText(leftDigits);
        const measureRightDigits = ctx.measureText(rightDigits);

        ctx.fillStyle = "white";
        ctx.fillText(
          leftDigits,
          this.width / 2 - measureLeftDigits.width,
          this.height / 2 + measureLeftDigits.fontBoundingBoxDescent
        );

        ctx.fillStyle = "#F54718";
        ctx.fillText(
          rightDigits,
          this.width / 2,
          this.height / 2 + measureRightDigits.fontBoundingBoxDescent
        );

        resolve(canvas);
      };
      img.src = "./plain_button.png";
    });

  const createSheetCanvas = (buttonCanvas, width, height) => {
    const buttonPositionsByWidth = (
      buttonDimension,
      sheetDimension,
      options = {}
    ) => {
      const isFitting = (top, left, radius) =>
        top >= 0 &&
        left >= 0 &&
        sheetDimension.width > left + 2 * radius &&
        sheetDimension.height > top + 2 * radius;

      const positions = [];
      const { padding = 50 } = options;
      const radius =
        Math.max(buttonDimension.width, buttonDimension.height) / 2 + padding;

      let left = padding;

      let currentCol = 0;

      while (left < sheetDimension.width) {
        let top = currentCol % 2 == 0 ? padding : padding - radius;
        while (top < sheetDimension.height) {
          if (isFitting(top, left, radius)) positions.push([left, top]);
          top = top + 2 * radius;
        }
        left = parseInt(left + Math.sqrt(3) * radius);
        currentCol++;
      }

      return positions;
    };

    const buttonPositionsByHeight = (
      buttonDimension,
      sheetDimension,
      options = {}
    ) => {
      const isFitting = (top, left, radius) =>
        top >= 0 &&
        left >= 0 &&
        sheetDimension.width > left + 2 * radius &&
        sheetDimension.height > top + 2 * radius;

      const positions = [];
      const { padding = 50 } = options;
      const radius =
        Math.max(buttonDimension.width, buttonDimension.height) / 2 + padding;

      let top = padding;

      let currentRow = 0;

      while (top < sheetDimension.height) {
        let left = currentRow % 2 == 0 ? padding : padding - radius;
        while (left < sheetDimension.width) {
          if (isFitting(top, left, radius)) positions.push([left, top]);
          left = left + 2 * radius;
        }
        top = parseInt(top + Math.sqrt(3) * radius);
        currentRow++;
      }

      return positions;
    };

    const sheetCanvas = document.createElement("canvas");
    sheetCanvas.width = width;
    sheetCanvas.height = height;

    const sheetCtx = sheetCanvas.getContext("2d");

    buttonPositionsByWidth(
      { width: buttonCanvas.width, height: buttonCanvas.height },
      { width, height }
    ).forEach(([x, y]) => sheetCtx.drawImage(buttonCanvas, x, y));

    return sheetCanvas;
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
})();
