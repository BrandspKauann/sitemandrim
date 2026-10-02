import { bank } from '../app/simulado/questionBank.ts';
import {ORAL_ITEMS} from '../app/simulado/oralData.ts';
import {writeFile,mkdir} from 'node:fs/promises';
await mkdir('tmp/hsk-reference',{recursive:true});
await writeFile('tmp/hsk-reference/audio-scripts.json',JSON.stringify([...bank.filter(q=>q.transcript).map(q=>({id:q.id,level:q.level,turns:q.transcript.split('|')})),...ORAL_ITEMS.filter(q=>q.audio).map(q=>({id:q.id,level:3,turns:[q.text]}))],null,2));
console.log('83 original listening scripts exported. Run scripts/prepare-hsk-audio.py to synthesize.');
