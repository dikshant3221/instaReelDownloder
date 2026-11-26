import { execFile } from "node:child_process";
import ff from "ffmpeg-static";
import { execFileSync } from "node:child_process";

execFileSync(ff, ['-hide_banner','-loglevel','error','-f','lavfi','-i','testsrc2=duration=6:size=640x360:rate=30','-pix_fmt','yuv420p','-c:v','libx264','-preset','ultrafast','-y','/tmp/pA.mp4']);
execFileSync(ff, ['-hide_banner','-loglevel','error','-i','/tmp/pA.mp4','-vf','scale=320:180','-c:v','libx264','-preset','ultrafast','-y','/tmp/pB.mp4']);

function phash(file){ return new Promise((res)=>{ execFile(ff,['-hide_banner','-loglevel','error','-ss','0.2','-i',file,'-frames:v','1','-vf','scale=8:8:flags=area,format=gray','-f','rawvideo','-'],{maxBuffer:1e6},(e,out)=>{ if(e) return res(null); const b=Buffer.from(out,'binary'); if(b.length<64) return res(null); let mean=0; for(const p of b.subarray(0,64)) mean+=p; mean/=64; let bits=''; for(const p of b.subarray(0,64)) bits+= p>=mean?'1':'0'; res(bits); }); }); }
function ham(a,b){ if(!a||!b||a.length!==b.length) return 64; let d=0; for(let i=0;i<a.length;i++) if(a[i]!==b[i]) d++; return d; }

const a = await phash('/tmp/pA.mp4');
const b = await phash('/tmp/pB.mp4');
const d = ham(a,b);
console.log('hash bits length:', a?.length, '| re-encode hamming =', d, '| similar (≤8):', d <= 8);
// distinct video → should differ more (different pattern)
execFileSync(ff, ['-hide_banner','-loglevel','error','-f','lavfi','-i','smptebars=duration=6:size=640x360:rate=30','-pix_fmt','yuv420p','-c:v','libx264','-preset','ultrafast','-y','/tmp/pC.mp4']);
const c = await phash('/tmp/pC.mp4');
const d2 = ham(a,c);
console.log('different-video hamming =', d2, '| correctly different:', d2 > 8);
