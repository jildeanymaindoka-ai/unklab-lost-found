import {config} from './config.js';
import {locations} from './model.js';
let busy=false,last=0;
export async function searchLocations(query){
 if(query.trim().length<3)throw Error('Masukkan minimal 3 karakter.');
 if(!config.locationEndpoint)return locations.filter(x=>x.toLowerCase().includes(query.toLowerCase())).map(display_name=>({display_name}));
 const key='unklab-place:'+query.toLowerCase(),cached=localStorage.getItem(key);if(cached)return JSON.parse(cached);
 if(busy||Date.now()-last<1500)throw Error('Tunggu sebentar sebelum mencari lagi.');busy=true;last=Date.now();
 try{const url=new URL(config.locationEndpoint);url.searchParams.set('q',query+' Universitas Klabat');url.searchParams.set('format','json');url.searchParams.set('limit','5');const r=await fetch(url,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('Layanan lokasi sedang tidak tersedia.');const data=await r.json();if(!Array.isArray(data))throw Error('Respons lokasi tidak valid.');localStorage.setItem(key,JSON.stringify(data));return data;}finally{busy=false;}
}
