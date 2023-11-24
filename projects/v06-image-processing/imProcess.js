// List of input images (in sample_images/ subfolder)
let input_image_names = [
    "monalisa.png",
    "lighthouse.png",
    "landscape.png",
    "knight.png",
    "kunsthauswein.png",
    "lego_tex.png",
    "checkerboard.png",
    "xochimilco.jpg",
    "colorful.jpg",
];

let input_images = []; // array to store all input images
let input = null;
let output = null;

let mosaic_names = ["musicBig", "musicSmall", "movieBig", "movieSmall"];
let mosaic_files = [
    "https://raw.githubusercontent.com/cmpsci373/CS373HW2/master/musicBig.png",
    "https://raw.githubusercontent.com/cmpsci373/CS373HW2/master/musicSmall.png",
    "https://raw.githubusercontent.com/cmpsci373/CS373HW2/master/movieBig.png",
    "https://raw.githubusercontent.com/cmpsci373/CS373HW2/master/movieSmall.png",
];
let mosaic_img_size = [
    [24, 24],
    [12, 12],
    [24, 45],
    [12, 23],
];
let mosaic_nimages = [599, 599, 951, 951];
let mosaic_montages = [];
let mosaics = []; // array to store mosaic image datasets

/* ===================================================
 *                 Pixel Operations
 * =================================================== */
// Adjust brightness.
function brighten(input, output, brightness) {
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    for (let i = 0; i < input.width * input.height; i++) {
        let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
        op[idx + 0] = pixelClamp(ip[idx + 0] * brightness); // red
        op[idx + 1] = pixelClamp(ip[idx + 1] * brightness); // green
        op[idx + 2] = pixelClamp(ip[idx + 2] * brightness); // blue
    }
}

// Adjust contrast.
// If contrast is 0, the result is a medium gray image (medium gray is [127, 127, 127])
// If contrast is 1, the result is the original image
function adjustContrast(input, output, contrast) {
    // ===YOUR CODE STARTS HERE===
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    for (let i = 0; i < input.width * input.height; i++) {
        let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
        let r = ip[idx + 0];
        let g = ip[idx + 1];
        let b = ip[idx + 2];
        op[idx + 0] = pixelClamp(contrast * r + (1 - contrast) * 127); // red
        op[idx + 1] = pixelClamp(contrast * g + (1 - contrast) * 127); // green
        op[idx + 2] = pixelClamp(contrast * b + (1 - contrast) * 127); // blue
    }
    // ---YOUR CODE ENDS HERE---
}

// Adjust saturation.
// If saturation is 0, the result is a grayscale version of the image
// If saturation is 1, the result is the original image
function adjustSaturation(input, out, saturation) {
    // ===YOUR CODE STARTS HERE===
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    for (let i = 0; i < input.width * input.height; i++) {
        let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
        let r = ip[idx + 0];
        let g = ip[idx + 1];
        let b = ip[idx + 2];
        let grayscaleValue = 0.3 * r + 0.59 * g + 0.11 * b;
        op[idx + 0] = pixelClamp(
            saturation * r + (1 - saturation) * grayscaleValue
        ); // red
        op[idx + 1] = pixelClamp(
            saturation * g + (1 - saturation) * grayscaleValue
        ); // green
        op[idx + 2] = pixelClamp(
            saturation * b + (1 - saturation) * grayscaleValue
        ); // blue
    }
    // ---YOUR CODE ENDS HERE---
}
/* ===================================================
 *                 Image Convolution
 * =================================================== */
// Box blur.
function boxBlur(input, output, ksize) {
    // create box kernel of ksize x ksize, each element of value 1/(ksize*ksize)
    let boxkernel = Array(ksize)
        .fill()
        .map(() => Array(ksize).fill(1.0 / ksize / ksize));
    filterImage(input, output, boxkernel);
}

// Gaussian blur.
function gaussianBlur(input, output, sigma) {
    let gkernel = gaussianKernel(sigma); // compute Gaussian kernel using sigma
    filterImage(input, output, gkernel);
}

// Edge detection.
function edgeDetect(input, output) {
    let ekernel = [
        [0, -2, 0],
        [-2, 8, -2],
        [0, -2, 0],
    ];
    filterImage(input, output, ekernel);
}

// Sharpen using the 3x3 kernel we covered in lecture.
function sharpen(input, output, sharpness) {
    // ===YOUR CODE STARTS HERE===
    let s = sharpness;
    let ekernel = [
        [0, -s, 0],
        [-s, 1 + 4 * s, -s],
        [0, -s, 0],
    ];
    filterImage(input, output, ekernel);
    // ---YOUR CODE ENDS HERE---
}

/* ===================================================
 *                 Dithering
 * =================================================== */

// Uniform dithering (quantization)
function uniformQuantization(input, output) {
    // ===YOUR CODE STARTS HERE===
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    for (let i = 0; i < input.width * input.height; i++) {
        let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
        let r = ip[idx + 0];
        let g = ip[idx + 1];
        let b = ip[idx + 2];

        let grayscaleValue = 0.3 * r + 0.59 * g + 0.11 * b;
        op[idx + 0] = grayscaleValue; // red
        op[idx + 1] = grayscaleValue; // green
        op[idx + 2] = grayscaleValue; // blue

        if (r > 127 || g > 127 || b > 127) {
            r = 255; // red
            g = 255; // green
            b = 255; // blue
        } else {
            r = 0; // red
            g = 0; // green
            b = 0; // blue
        }
        op[idx + 0] = r; // red
        op[idx + 1] = g; // green
        op[idx + 2] = b; // blue
    }
    // ---YOUR CODE ENDS HERE---
}

// Random dithering
function randomDither(input, output) {
    // ===YOUR CODE STARTS HERE===
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    for (let i = 0; i < input.width * input.height; i++) {
        let idx = i * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
        let r = ip[idx + 0];
        let g = ip[idx + 1];
        let b = ip[idx + 2];

        let grayscaleValue = 0.3 * r + 0.59 * g + 0.11 * b;
        op[idx + 0] = grayscaleValue; // red
        op[idx + 1] = grayscaleValue; // green
        op[idx + 2] = grayscaleValue; // blue

        // Per-pixel random number as the threshold
        let threshold = Math.random() * 255;
        if (r > threshold || g > threshold || b > threshold) {
            r = 255; // red
            g = 255; // green
            b = 255; // blue
        } else {
            r = 0; // red
            g = 0; // green
            b = 0; // blue
        }
        op[idx + 0] = r; // red
        op[idx + 1] = g; // green
        op[idx + 2] = b; // blue
    }
    // ---YOUR CODE ENDS HERE---
}

// Ordered dithering
function orderedDither(input, output) {
    let bayers =
        // 4x4 ordered matrix
        [
            [15 / 16.0, 7 / 16.0, 13 / 16.0, 5 / 16.0],
            [3 / 16.0, 11 / 16.0, 1 / 16.0, 9 / 16.0],
            [12 / 16.0, 4 / 16.0, 14 / 16.0, 6 / 16.0],
            [0, 8 / 16.0, 2 / 16.0, 10 / 16.0],
        ];
    // ===YOUR CODE STARTS HERE===
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    for (y = 0; y < input.height; y++) {
        for (x = 0; x < input.width; x++) {
            let idx = (y * input.width + x) * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
            let r = ip[idx + 0];
            let g = ip[idx + 1];
            let b = ip[idx + 2];

            let grayscaleValue = 0.3 * r + 0.59 * g + 0.11 * b;
            op[idx + 0] = grayscaleValue; // red
            op[idx + 1] = grayscaleValue; // green
            op[idx + 2] = grayscaleValue; // blue

            let threshold = bayers[x % 4][y % 4] * 255;
            if (ip[idx] > threshold) {
                r = 255; // red
                g = 255; // green
                b = 255; // blue
            } else {
                r = 0; // red
                g = 0; // green
                b = 0; // blue
            }
            op[idx + 0] = r; // red
            op[idx + 1] = g; // green
            op[idx + 2] = b; // blue
        }
    }
    // ---YOUR CODE ENDS HERE---
}
/* ===================================================
 *                 Image Mosaic
 * =================================================== */
// Image Mosaic using a given mosaic image dataset
function imageMosaic(input, output, mosaic_name) {
    // I(i, j) - input image of resolution WxH
    let width = input.width;
    let height = input.height;

    // M(i,j) - candidate images of resolution WxH
    let mimages = mosaics[mosaic_name]; // mimages is an array of mosaic images
    let w = mimages[0].width; // all mosaic images have the same size wxh
    let h = mimages[0].height;
    // console.log("There are how many images on this mosaic: ", mimages.length);
    let num = mimages.length; // number of mosaic images

    console.log("Computing Image Mosaic...");
    // Below you can do any precomputation necessary (it's optional)
    // to help increase the speed of mosaic computation

    // ===YOUR CODE STARTS HERE===
    let ip = input.pixels; // an alias for input pixels array
    let op = output.pixels; // an alias for output pixels array
    let numOfBlocksWidth = Math.ceil(width / w);
    let numOfBlocksHeight = Math.ceil(height / h);
    let numOfBlocks = numOfBlocksWidth * numOfBlocksHeight;

    // Getting average color for each mosaic image
    let red = 0;
    let green = 0;
    let blue = 0;
    let sumMosaic = 0;
    let rgbAvgMosaicArray = [];

    for (let i = 0; i < mimages.length; i++) {
        for (let a = 0; a < mimages[i].width * mimages[i].height; a++) {
            let idx = a * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
            red += mimages[i].pixels[idx + 0];
            green += mimages[i].pixels[idx + 1];
            blue += mimages[i].pixels[idx + 2];
            sumMosaic++;
        }
        rgbAvgMosaicArray.push([
            Math.floor(red / sumMosaic),
            Math.floor(green / sumMosaic),
            Math.floor(blue / sumMosaic),
        ]);
        red = 0;
        green = 0;
        blue = 0;
        sumMosaic = 0;
    }
    console.log("rgbAvgMosaicArray: ", rgbAvgMosaicArray.length);
    console.log("mimages Length: ", mimages.length);
    console.log("M Width: ", w);
    console.log("M Height: ", h);
    console.log("Input Width: ", width);
    console.log("Input Height: ", height);

    console.log("Number of Blocks Width: ", numOfBlocksWidth);
    console.log("Number of Blocks Height: ", numOfBlocksHeight);
    console.log("Number of Blocks: ", numOfBlocks);

    console.log("Pixel size of input image: ", input.width * input.height);
    console.log("rgbAvgMosaicArray", rgbAvgMosaicArray);
    // ---YOUR CODE ENDS HERE---
    let y = 0;
    (function chunk() {
        for (x = 0; x <= width - w; x += w) {
            // //     // x loop
            // //     // ===YOUR CODE STARTS HERE===
            // // For each block
            for (let j = 0; j < w; j++) {
                let idx = (y * width + x) * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
                let r = input.pixels[idx + 0];
                let g = input.pixels[idx + 1];
                let b = input.pixels[idx + 2];
                let minDiff = 255 * 255 * 3;
                let minIndexOfMosaic = 0;
                for (let i = 0; i < rgbAvgMosaicArray.length; i++) {
                    let diff =
                        Math.pow(r - rgbAvgMosaicArray[i][0], 2) +
                        Math.pow(g - rgbAvgMosaicArray[i][1], 2) +
                        Math.pow(b - rgbAvgMosaicArray[i][2], 2);
                    // Adding noise to the diff
                    diff *= Math.random() * (2 - 1) + 1;
                    if (diff < minDiff) {
                        minDiff = diff;
                        minIndexOfMosaic = i;
                    }
                }
                // Best match array
                let block = mimages[minIndexOfMosaic];
                // When replacing pixels in the image multiply M(i,j) by the following formula:
                for (let i = 0; i < h; i++) {
                    for (let j = 0; j < w; j++) {
                        let idx3 = (i * w + j) * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
                        let idx4 = ((y + i) * width + x + j) * 4; // each pixel takes 4 bytes: red, green, blue, alpha(not used in this project)
                        let a =
                            r * rgbAvgMosaicArray[i][0] +
                            g * rgbAvgMosaicArray[i][1] +
                            (b * rgbAvgMosaicArray[i][2]) /
                                (rgbAvgMosaicArray[i][0] *
                                    rgbAvgMosaicArray[i][0] +
                                    rgbAvgMosaicArray[i][1] *
                                        rgbAvgMosaicArray[i][1] +
                                    rgbAvgMosaicArray[i][2] *
                                        rgbAvgMosaicArray[i][2]);

                        output.pixels[idx4 + 0] = block.pixels[idx3 + 0];
                        output.pixels[idx4 + 1] = block.pixels[idx3 + 1];
                        output.pixels[idx4 + 2] = block.pixels[idx3 + 2];
                    }
                }
            }
            // // ---YOUR CODE ENDS HERE---
        }
        output.updatePixels();
        y += h;
        if (y <= height - h) {
            // y loop in non-blocking version
            setTimeout(chunk, 0);
        } else {
            console.log("Done.");
        }
    })();
}

/* ===================================================
 * ===================================================
 *      The section below are utility functions.
 *      You do NOT need to modify anything below.
 * ===================================================
 * =================================================== */

// Load mosaic datasets from image montages
function loadMosaicImages() {
    for (let mosaic_id = 0; mosaic_id < mosaic_names.length; mosaic_id++) {
        let montage = mosaic_montages[mosaic_id];
        let mosaic_name = mosaic_names[mosaic_id];
        mosaics[mosaic_name] = [];

        let w = mosaic_img_size[mosaic_id][0];
        let h = mosaic_img_size[mosaic_id][1];
        let nimgs = mosaic_nimages[mosaic_id];

        let i = 1;
        for (let y = 0; y < montage.height; y += h) {
            for (let x = 0; x < montage.width; x += w, i++) {
                let new_image = createImage(w, h);
                new_image.copy(montage, x, y, w, h, 0, 0, w, h);
                new_image.loadPixels();
                mosaics[mosaic_name].push(new_image);

                if (i >= nimgs) break;
            }
            if (i >= nimgs) break;
        }
    }
}

// Load input images
function loadInputImages() {
    for (let i = 0; i < input_image_names.length; i++) {
        input_images[input_image_names[i]] = loadImage(
            "https://raw.githubusercontent.com/cmpsci373/CS373HW2/master/sample_images/" +
                input_image_names[i]
        );
    }
}
// Apply brightness, contrast, saturation adjustments
function applyPixelOperations() {
    brighten(input, output, params.brightness);
    adjustContrast(output, output, params.contrast); // output of the previous operation is fed as input
    adjustSaturation(output, output, params.saturation); // output of the previous operation is fed as input
    output.updatePixels();
}

// Clamp pixel value to be between [0,255]
function pixelClamp(value) {
    return value < 0 ? 0 : value > 255 ? 255 : value >> 0;
}

// Preload all images
function preload() {
    for (let mosaic_id = 0; mosaic_id < mosaic_names.length; mosaic_id++) {
        mosaic_montages[mosaic_id] = loadImage(mosaic_files[mosaic_id]);
    }
    loadInputImages();
}

function loadSelectedInput() {
    input = input_images[params.Image];
    input.loadPixels();
    output = createImage(input.width, input.height);
    output.copy(
        input,
        0,
        0,
        input.width,
        input.height,
        0,
        0,
        input.width,
        input.height
    );
    output.loadPixels();
    params.Reset(true);
}

let ParameterControl = function () {
    this.Image = "monalisa.png";
    this.brightness = 1.0;
    this.contrast = 1.0;
    this.saturation = 1.0;
    this.boxsize = 2;
    this.sigma = 1;
    this.sharpness = 0.3;
    this.Reset = function (partial) {
        this.brightness = 1.0;
        this.contrast = 1.0;
        this.saturation = 1.0;
        if (partial == "undefined" || partial == false) {
            this.boxsize = 2;
            this.sigma = 1;
            this.sharpness = 0.3;
        }
        output.copy(
            input,
            0,
            0,
            input.width,
            input.height,
            0,
            0,
            input.width,
            input.height
        );
        output.loadPixels();
    };
    this["Apply Box Blur"] = function () {
        boxBlur(input, output, this.boxsize * 2 + 1);
    };
    this["Apply Gaussian Blur"] = function () {
        gaussianBlur(input, output, this.sigma);
    };
    this["Apply Sharpen"] = function () {
        sharpen(input, output, this.sharpness);
    };
    this["Edge Detect"] = function () {
        edgeDetect(input, output);
        output.updatePixels();
    };
    this.uniform = function () {
        uniformQuantization(input, output);
        output.updatePixels();
    };
    this.random = function () {
        randomDither(input, output);
        output.updatePixels();
    };
    this.ordered = function () {
        orderedDither(input, output);
        output.updatePixels();
    };
    this["Mosaic Dataset"] = "musicBig";
    this["Apply Mosaic"] = function () {
        imageMosaic(input, output, this["Mosaic Dataset"]);
    };
};

let params = new ParameterControl();

// Setup function (p5.js callback)
function setup() {
    loadMosaicImages();

    canvas = createCanvas(window.innerWidth, window.innerHeight);

    let gui = new dat.GUI();
    let ctrl = gui.add(params, "Image", input_image_names);
    ctrl.onFinishChange(function (value) {
        loadSelectedInput();
    });

    let panel1 = gui.addFolder("Pixel Operations");
    ctrl = panel1.add(params, "brightness", 0, 4.0).step(0.05).listen();
    ctrl.onFinishChange(function (value) {
        applyPixelOperations();
    });

    ctrl = panel1.add(params, "contrast", 0, 4.0).step(0.05).listen();
    ctrl.onFinishChange(function (value) {
        applyPixelOperations();
    });

    ctrl = panel1.add(params, "saturation", 0, 4.0).step(0.05).listen();
    ctrl.onFinishChange(function (value) {
        applyPixelOperations();
    });

    panel1.add(params, "Reset");
    panel1.open();

    let panel2 = gui.addFolder("Image Convolution");
    panel2.add(params, "boxsize", 1, 7).step(1).listen();
    panel2.add(params, "Apply Box Blur");
    panel2.add(params, "sigma", 0.1, 4.0).step(0.1).listen();
    panel2.add(params, "Apply Gaussian Blur");
    panel2.add(params, "sharpness", 0, 1.0).step(0.05).listen();
    panel2.add(params, "Apply Sharpen");
    panel2.add(params, "Edge Detect");
    panel2.open();

    let panel3 = gui.addFolder("Dither");
    panel3.add(params, "uniform");
    panel3.add(params, "random");
    panel3.add(params, "ordered");
    panel3.open();

    let panel4 = gui.addFolder("Image Mosaic");
    panel4.add(params, "Mosaic Dataset", mosaic_names);
    panel4.add(params, "Apply Mosaic");
    panel4.open();

    loadSelectedInput();
}

// Rendering loop (p5.js callback)
function draw() {
    clear();
    image(output, 0, 0);
}

function gaussianKernel(std) {
    // compute Gaussian kernel
    let sigma = std;
    let ksize =
        Math.floor(6.0 * std) % 2
            ? Math.floor(6.0 * std)
            : Math.floor(6.0 * std) + 1;
    if (ksize < 1) ksize = 1;
    let r = 0.0;
    let s = 2.0 * sigma * sigma;
    let sum = 0.0;
    let gkernel = Array(ksize)
        .fill()
        .map(() => Array(ksize)); // create 2D array
    let offset = Math.floor(ksize / 2);

    if (ksize == 1) {
        gkernel[0][0] = 1;
        return gkernel;
    }

    for (let x = -offset; x <= offset; x++) {
        for (let y = -offset; y <= offset; y++) {
            r = Math.sqrt(x * x + y * y);
            gkernel[x + offset][y + offset] =
                (Math.exp(-(r * r) / s) / Math.PI) * s;
            sum += gkernel[x + offset][y + offset];
        }
    }
    // normalize coefficients
    for (let x = 0; x < ksize; x++) {
        for (let y = 0; y < ksize; y++) {
            gkernel[x][y] /= sum;
        }
    }
    return gkernel;
}

function filterImage(input, output, kernel) {
    console.log("Computing Image Convolution...");
    input.loadPixels();
    output.loadPixels();
    let ip = input.pixels;
    let op = output.pixels;
    let index = 0;
    for (let y = 0; y < input.height; y++) {
        for (let x = 0; x < input.width; x++, index += 4) {
            op.set(applyKernel(input, x, y, kernel), index);
        }
    }
    output.updatePixels();
    console.log("Done.");
}

function applyKernel(image, x, y, kernel) {
    let ksize = kernel.length;
    let rtotal = 0,
        gtotal = 0,
        btotal = 0;
    let xloc = 0,
        yloc = 0,
        idx = 0,
        coeff = 0;
    let offset = (ksize / 2) >> 0;
    let p = image.pixels;

    for (let i = 0; i < ksize; i++) {
        for (let j = 0; j < ksize; j++) {
            xloc = x + i - offset;
            xloc =
                xloc < 0 ? 0 : xloc > image.width - 1 ? image.width - 1 : xloc; // constant border extension
            yloc = y + j - offset;
            yloc =
                yloc < 0
                    ? 0
                    : yloc > image.height - 1
                    ? image.height - 1
                    : yloc;

            idx = (yloc * image.width + xloc) * 4;
            coff = kernel[i][j];
            rtotal += p[idx + 0] * coff;
            gtotal += p[idx + 1] * coff;
            btotal += p[idx + 2] * coff;
        }
    }
    // technically for certain operations like edge detection
    // we should take the absolute value of the result
    // will ignore that for now
    return [pixelClamp(rtotal), pixelClamp(gtotal), pixelClamp(btotal)]; // return resulting color as 3-element array
}
