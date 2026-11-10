import {config} from './config.js';
import {seed, validateReport} from './model.js';
const key='unklab-reports-v1';
function read(k,fallback) { try {return JSON.parse(localStorage.getItem(k))??fallback;} catch {return fallback;} }
let rows=read(key,seed); if (!Array.isArray(rows)) rows=structuredClone(seed);
let user=null, fb;
export const store={
 get user(){return user;}, get demo(){return config.mode==='demo';},
 async init(onChange){
  if(this.demo) {user=read('unklab-demo-user',null); onChange(); return;}
  fb=await import('./firebase.js'); await fb.init(u=>{user=u;onChange();});
 },
 async list(){return this.demo?structuredClone(rows):fb.list();},
 async login(email,password,register=false){if(this.demo) throw Error('Gunakan tombol akun demo.'); return fb.login(email,password,register);},
 demoLogin(admin=false){if(!this.demo)return;user={uid:admin?'demo-admin':'demo-user',email:admin?'admin@demo.local':'user@demo.local',admin};localStorage.setItem('unklab-demo-user',JSON.stringify(user));},
 async logout(){if(!this.demo)await fb.logout();user=null;localStorage.removeItem('unklab-demo-user');},
 async save(data,id){
  if(!user)throw Error('Silakan masuk terlebih dahulu.');validateReport(data);
  if(!this.demo)return fb.save(data,id);
  const old=rows.find(r=>r.id===id); if(id&&!old)throw Error('Laporan tidak ditemukan.');
  if(old&&old.ownerId!==user.uid&&!user.admin)throw Error('Tidak memiliki akses.');
  const next={...data,id:id||crypto.randomUUID(),ownerId:old?.ownerId||user.uid,createdAt:old?.createdAt||Date.now(),status:'pending'};
  rows=id?rows.map(r=>r.id===id?next:r):[next,...rows];localStorage.setItem(key,JSON.stringify(rows));
 },
 async remove(id){if(!this.demo)return fb.remove(id);const r=rows.find(r=>r.id===id);if(!user||(!user.admin&&r?.ownerId!==user.uid))throw Error('Tidak memiliki akses.');rows=rows.filter(r=>r.id!==id);localStorage.setItem(key,JSON.stringify(rows));},
 async status(id,status){if(!user?.admin)throw Error('Khusus admin.');if(!['verified','returned','pending'].includes(status))throw Error('Status tidak valid.');if(!this.demo)return fb.status(id,status); rows=rows.map(r=>r.id===id?{...r,status}:r);localStorage.setItem(key,JSON.stringify(rows));}
};
