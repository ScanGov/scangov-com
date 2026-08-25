import * as fs from 'fs';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const faviconDir = './public/assets/img/favicon';
const svgPath = `${faviconDir}/favicon.svg`;

const svg = fs.readFileSync(svgPath, 'utf8');
// raster formats can't switch on prefers-color-scheme, so bake in the light-mode fill
const lightSvg = svg.replace(/<style>[\s\S]*?<\/style>/, '');

async function renderPng(size) {
  return sharp(Buffer.from(lightSvg)).resize(size, size).png().toBuffer();
}

const png16 = await renderPng(16);
const png32 = await renderPng(32);
const png48 = await renderPng(48);

fs.writeFileSync(`${faviconDir}/apple-touch-icon.png`, await renderPng(180));
fs.writeFileSync(`${faviconDir}/android-chrome-192x192.png`, await renderPng(192));

const ico = await pngToIco([png16, png32, png48]);
fs.writeFileSync(`${faviconDir}/favicon.ico`, ico);

console.log(`[build-favicons] wrote favicon.ico, apple-touch-icon.png, android-chrome-192x192.png from ${svgPath}`);
