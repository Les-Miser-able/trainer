import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
test('service worker caches the shell, serves saved models offline, and leaves unselected models uncached',async()=>{
 const listeners={},stores=new Map(),network=[];
 let online=true;
 const key=value=>new URL(typeof value==='string'?value:value.url,'https://sample.test/').href;
 const caches={
  async open(name){if(!stores.has(name))stores.set(name,new Map());const store=stores.get(name);
   return {async addAll(urls){for(const url of urls)store.set(key(url),new Response('shell'));},
    async put(req,res){store.set(key(req),res);},async match(req){return store.get(key(req))?.clone();}};},
  async keys(){return [...stores.keys()];},async delete(name){return stores.delete(name);}
 };
 const self={location:{origin:'https://sample.test'},addEventListener:(name,fn)=>listeners[name]=fn,
  skipWaiting:async()=>{},clients:{claim:async()=>{}}};
 const fetch=async req=>{network.push(key(req));if(!online)throw Error('offline');
  return key(req).endsWith('shell-assets.json')?Response.json(['./','./index.html','./app.js']):new Response('network');};
 vm.runInNewContext(await readFile(new URL('../dist/sw.js',import.meta.url),'utf8'),{self,caches,fetch,URL,Response,Request:class extends Request{constructor(url,options){super(key(url),options);}}});
 let pending;listeners.install({waitUntil:p=>pending=p});await pending;
 assert.ok(![...stores.values()].some(store=>[...store.keys()].some(url=>url.includes('/models/'))));
 const modelUrl='https://sample.test/models/alphabet/version/weights.bin';
 await (await caches.open('fsl-pocket-models-v1')).put(modelUrl,new Response('saved alphabet'));
 online=false;
 const request=async url=>{let response;listeners.fetch({request:new Request(url),respondWith:p=>response=p});return response;};
 assert.equal(await (await request(modelUrl)).text(),'saved alphabet');
 assert.equal((await request('https://sample.test/models/family/version/weights.bin')).type,'error');
 assert.equal(await (await request('https://sample.test/catalog.json')).text(),'shell');
 assert.equal(network.filter(url=>url===modelUrl).length,0);
});
