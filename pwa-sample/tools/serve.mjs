import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../dist');
const port=Number(process.env.PORT || 8080);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json',
  '.webmanifest':'application/manifest+json','.wasm':'application/wasm','.svg':'image/svg+xml',
  '.png':'image/png','.bin':'application/octet-stream','.task':'application/octet-stream'};
http.createServer(async(req,res)=>{
  try {
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
    const url=new URL(req.url,'http://localhost');
    const requested=decodeURIComponent(url.pathname);
    const target=path.resolve(root,'.'+requested+(requested.endsWith('/')?'index.html':''));
    if(target!==root && !target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const info=await stat(target);
    if(!info.isFile())throw new Error('Not a file');
    res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream',
      'Content-Length':info.size,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    if(req.method==='HEAD')res.end();else createReadStream(target).pipe(res);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log('Local preview: http://localhost:'+port));
