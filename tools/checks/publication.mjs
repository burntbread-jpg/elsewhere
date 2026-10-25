import {readdir,readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();let failed=false;
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory()){await walk(file);continue;}const rel=path.relative(root,file);if(/\.(heic|heif|arw|raw|db|sqlite|mov)$/i.test(file)||/^\.env/i.test(entry.name))throw Error(`비공개 형식 금지: ${rel}`);
if(/\.(mdx|astro|ts|js|json)$/i.test(file)){const text=await readFile(file,'utf8');if(/GPSLatitude|GPSLongitude|-----BEGIN.*PRIVATE KEY|sk-[A-Za-z0-9]{32,}/.test(text))throw Error(`민감정보 패턴 발견: ${rel}`);if(file.endsWith('.mdx')&&(!/^status:\s*published\s*$/m.test(text)||!/^visibility:\s*public\s*$/m.test(text)))throw Error(`비공개 원고는 저장소 밖에 보관하세요: ${rel}`);}
if(/\.(webp|jpe?g|png)$/i.test(file)){const data=await readFile(file);if(data.includes(Buffer.from('Exif\0\0'))||data.includes(Buffer.from('EXIF'))||data.includes(Buffer.from('http://ns.adobe.com/xap/1.0/')))throw Error(`메타데이터 제거가 필요한 이미지: ${rel}`);}}}
try{await walk(path.join(root,'src'));await walk(path.join(root,'public'));console.log('공개 소스 검사 통과 (EXIF/XMP, 금지 형식, 원고 상태, 주요 비밀키 패턴).');}catch(e){failed=true;console.error(e.message);}if(failed)process.exit(1);
