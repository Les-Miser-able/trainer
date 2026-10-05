import {mkdir,copyFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {constants} from 'node:fs';
const base=path.resolve(import.meta.dirname,'..');
const dist=path.join(base,'dist');
await mkdir(path.join(dist,'vendor','wasm'),{recursive:true});
// Initialize fresh clones without replacing an existing exported catalog.
try {
  await copyFile(path.join(base,'catalog.example.json'),path.join(dist,'catalog.json'),constants.COPYFILE_EXCL);
} catch(error) {
  if(error.code!=='EEXIST')throw error;
}
await copyFile(path.join(base,'node_modules/@tensorflow/tfjs/dist/tf.min.js'),path.join(dist,'vendor/tf.min.js'));
await copyFile(path.join(base,'node_modules/@mediapipe/tasks-vision/vision_bundle.mjs'),path.join(dist,'vendor/vision_bundle.mjs'));
const wasm=await readdir(path.join(base,'node_modules/@mediapipe/tasks-vision/wasm'));
for(const file of wasm) if(/\.(wasm|js)$/.test(file))
  await copyFile(path.join(base,'node_modules/@mediapipe/tasks-vision/wasm',file),path.join(dist,'vendor/wasm',file));
const assets=['./','./index.html','./style.css','./app.js','./core.js','./diagnostics.js','./manifest.webmanifest',
  './icon.svg','./icon-192.png','./icon-512.png','./vendor/tf.min.js','./vendor/vision_bundle.mjs',
  ...wasm.filter(f=>/\.(wasm|js)$/.test(f)).map(f=>'./vendor/wasm/'+f)];
await writeFile(path.join(dist,'shell-assets.json'),JSON.stringify(assets));
console.log('Local browser libraries and offline shell prepared.');
