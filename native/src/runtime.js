import {KeepAwake} from '@capacitor-community/keep-awake';
import {sha256} from '@noble/hashes/sha2.js';
let awake=false;
window.NativeTimer={hash(bytes){return Array.from(sha256(bytes),b=>b.toString(16).padStart(2,'0')).join('')},async setAwake(value){if(value===awake)return;try{if(value)await KeepAwake.keepAwake();else await KeepAwake.allowSleep();awake=value;}catch(error){console.warn('Screen wake setting unavailable',error.message)}}};
