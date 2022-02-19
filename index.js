const [buttonsForm] = document.forms;
const [yearInput, submitButton] = buttonsForm;
const wrapperEl = document.getElementById("wrapper")

yearInput.value = (new Date()).getFullYear();

buttonsForm.onsubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    var img = new Image();
    
    img.onload = function(){
        const canvas = document.createElement("canvas");
        //wrapperEl.innerHTML = "";
        //wrapperEl.appendChild(canvas);
        
        canvas.width = this.width;
        canvas.height = this.height;
                                // 4517, 6050

        const ctx = canvas.getContext("2d");
        
        ctx.drawImage(img,0,0);
        ctx.font         = '312px CoelnischeCurrentFraktur';
        ctx.fillStyle = 'blue';
        
        const leftDigits = yearInput.value.substring(0,2);
        const rightDigits = yearInput.value.substring(2);

        const measureLeftDigits = ctx.measureText(leftDigits);

        ctx.fillStyle = "white";
        ctx.fillText(leftDigits, this.width / 2 - measureLeftDigits.width, this.height / 2);
    
        ctx.fillStyle = "#F54718";
        ctx.fillText(rightDigits, this.width / 2, this.height / 2);
        ctx.save();

        document.getElementById("preview-img").src = changeDpiDataUrl(canvas.toDataURL(), 600);

        const sheetCanvas = document.createElement("canvas");
        sheetCanvas.width = 4517;
        sheetCanvas.height = 6050;

        const sheetCtx = sheetCanvas.getContext("2d");

        buttonPositionsByWidth( { width: this.width, height: this.height }, { width: 4517, height: 6050 } ).forEach( ([x,y ]) => sheetCtx.drawImage(canvas, x,y) )
    
        sheetCanvas.toBlob( (blob) => {
            document.getElementById("sheet-preview").src = URL.createObjectURL(blob);
        }  );
    };
    img.src = './plain_button.png';
};


const buttonPositionsByWidth = ( buttonDimension, sheetDimension, options = {} )  => {

    const isFitting = ( top, left, radius ) => top >= 0 && left >= 0 && sheetDimension.width > left + 2 * radius && sheetDimension.height > top + 2 * radius;

    const positions = [];
    const { padding = 50 } = options;
    const radius = (Math.max(buttonDimension.width, buttonDimension.height) / 2)+ padding;
    
    let left = padding;

    let currentCol = 0;

    while (left < sheetDimension.width) {
        let top = currentCol % 2 == 0 ? padding : padding - radius;
        while (top < sheetDimension.height) {
            if ( isFitting(top, left, radius)) positions.push( [left, top] );
            top = top + 2 * radius;
        }
        left = parseInt(left + (Math.sqrt(3) * radius));
        currentCol++;
    }

    return positions;
};


const buttonPositionsByHeight = ( buttonDimension, sheetDimension, options = {} )  => {

    const isFitting = ( top, left, radius ) => top >= 0 && left >= 0 && sheetDimension.width > left + 2 * radius && sheetDimension.height > top + 2 * radius;

    const positions = [];
    const { padding = 50 } = options;
    const radius = (Math.max(buttonDimension.width, buttonDimension.height) / 2)+ padding;
    
    let top = padding;

    let currentRow = 0;

    while (top < sheetDimension.height) {
        let left = currentRow % 2 == 0 ? padding : padding - radius;
        while (left < sheetDimension.width) {
            if ( isFitting(top, left, radius)) positions.push( [left, top] );
            left = left + 2 * radius;
        }
        top = parseInt(top + (Math.sqrt(3) * radius));
        currentRow++;
    }

    return positions;
};