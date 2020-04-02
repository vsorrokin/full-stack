const fontfacegen = require('fontfacegen');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

const source = path.resolve('src/assets/fonts/');
const dest = path.resolve('src/assets/web_fonts/');

const iconsOnly = process.argv[2] === '--icons';

rimraf(dest + (iconsOnly ? '/icomoon.css' : ''), () => {
  let fonts = [];

  if (iconsOnly) {
    fonts.push('icomoon.ttf');
  } else {
    fonts = fs.readdirSync(source);
  }

  fonts.forEach(font => {
    let extension = path.extname(font);
    let fontname = path.basename(font, extension);

    if (extension === '.ttf' || extension === '.otf') {
      fontfacegen({
        source: path.join(source, font),
        dest: dest
      });
    }
  });
});
