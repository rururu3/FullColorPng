const sharp = require('sharp');

const FULL_COLOR_SIZE = 256 * 256 * 256;
const FULL_COLOR_SIZE_SQRT = Math.sqrt(FULL_COLOR_SIZE);

// ソートしたいので頑張る
// https://www.peko-step.com/tool/hslrgb.html
const colorList = [];
for(let r = 0; r < 256; r++) {
  for(let g = 0; g < 256; g++) {
    for(let b = 0; b < 256; b++) {
      colorList.push({
        r,
        g,
        b,
        a: 255,
        l: (Math.max(r, g, b) + Math.min(r, g, b)) / 2,
      });
    }
  }
}
colorList.sort((a, b) => {
  if(a.l != b.l) {
    return(a.l - b.l);
  }
  if(a.r != b.r) {
    return(a.r - b.r);
  }
  if(a.g != b.g) {
    return(a.g - b.g);
  }
  return(a.b - b.b);
});

sharp({
  create: {
    width: FULL_COLOR_SIZE_SQRT,
    height: FULL_COLOR_SIZE_SQRT,
    channels: 4,
    background: { r: 0, g: 0, b: 255, alpha: 255 }
  }
})
.raw()
.toBuffer((err, data, info) => {
  let cnt = 0;
  for(let x = 0; x < info.width * 2; x++) {
    for(let wx = 0; wx <= x; wx++) {
      let wy = x - wx;
      if(wy < info.height && wx < info.width) {
        let idx = (wy * info.width + wx) * 4;
        data[idx + 0] = colorList[cnt].r;
        data[idx + 1] = colorList[cnt].g;
        data[idx + 2] = colorList[cnt].b;
        data[idx + 3] = 255;
        cnt++;
      }
    }
  }
  sharp(data, {
    raw : {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
  .png()
  .toFile('fullcolor2.png');
});


sharp({
  create: {
    width: FULL_COLOR_SIZE_SQRT,
    height: FULL_COLOR_SIZE_SQRT,
    channels: 4,
    background: { r: 0, g: 0, b: 255, alpha: 255 }
  }
})
.raw()
.toBuffer((err, data, info) => {
  for(let r = 0; r < 256; r++) {
    for(let g = 0; g < 256; g++) {
      for(let b = 0; b < 256; b++) {
        let idx = (r * 256 * 256 + g * 256 + b) * 4;

        data[idx + 0] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
  }
  sharp(data, {
    raw : {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
  .png()
  .toFile('fullcolor1.png');
});