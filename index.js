const sharp = require('sharp');

const FULL_COLOR_SIZE = 256 * 256 * 256;
const FULL_COLOR_SIZE_SQRT = Math.sqrt(FULL_COLOR_SIZE);

// ソートしたいので頑張る
// https://www.peko-step.com/tool/hslrgb.html
const colorList = [];
for(let r = 0; r < 256; r++) {
  for(let g = 0; g < 256; g++) {
    for(let b = 0; b < 256; b++) {
      let obj = {
        r,
        g,
        b,
        a: 255,
        h: 0,
        s: 0,
        l: 0,
      };
      // 色相
      let min = Math.min(r, g, b)
      let max = Math.max(r, g, b)
      if(max === r) {
        obj.h = 60 * ((obj.g - obj.b) / (max - min));
      }
      else if(max === g) {
        obj.h = 60 * ((obj.b - obj.r) / (max - min)) + 120;
      }
      else if(max === b) {
        obj.h = 60 * ((obj.r - obj.g) / (max - min)) + 240;
      }
      else {
        obj.h = 0;
      }
      obj.h = (obj.h + 360) % 360;

      // 彩度
      obj.s = (max + min) / 2;
      if(obj.s < 128) {
        obj.s = (max - min) / (max + min);
      }
      else {
        obj.s = (max - min) / (510 - max - min);
      }

      // 輝度
      obj.l = (max + min) / 2,

      colorList.push(obj);
    }
  }
}
colorList.sort((a, b) => {
  let sList = ['l', 's', 'h'];
  for(let i = 0; i < sList.length; i++) {
    if(a[sList[i]] != b[sList[i]]) {
      return(a[sList[i]] - b[sList[i]]);
    }
  }
  return(0);
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