import {parentPort} from 'node:worker_threads';
globalThis.self={postMessage:(message,transfer)=>parentPort.postMessage(message,transfer)};
await import('../../src/space/surface-worker.js?v=science-2');
parentPort.on('message',data=>self.onmessage({data}));
