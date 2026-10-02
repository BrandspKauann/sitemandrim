import { NextRequest, NextResponse } from 'next/server';
import { BANK_VERSION, formFor, grade } from '../../simulado/examEngine';
import type { Answer, Level } from '../../simulado/types';
export const runtime='nodejs';
export const dynamic='force-dynamic';
function validLevel(value:unknown): value is Level{return value===1||value===2||value===3;}
export function GET(request:NextRequest){
  const level=Number(request.nextUrl.searchParams.get('level'));
  if(!validLevel(level))return NextResponse.json({error:'Nível inválido.'},{status:400});
  const seed=(request.nextUrl.searchParams.get('seed')??'').slice(0,80);
  if(!/^[a-zA-Z0-9-]{1,80}$/.test(seed))return NextResponse.json({error:'Identificador inválido.'},{status:400});
  return NextResponse.json({...formFor(level,seed),version:BANK_VERSION},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:NextRequest){
  try{
    if(Number(request.headers.get('content-length'))>100000)return NextResponse.json({error:'Respostas muito grandes.'},{status:413});
    const input=await request.text();
    if(input.length>100000)return NextResponse.json({error:'Respostas muito grandes.'},{status:413});
    const raw:unknown=JSON.parse(input);
    if(!raw||typeof raw!=='object'||Array.isArray(raw))return NextResponse.json({error:'Tentativa inválida.'},{status:400});
    const body=raw as Record<string,unknown>;
    if(!validLevel(body.level)||body.version!==BANK_VERSION||!body.answers||typeof body.answers!=='object'||Array.isArray(body.answers))return NextResponse.json({error:'Tentativa inválida. Atualize a página.'},{status:400});
    const answers:Record<string,Answer>={};
    for(const [id,answer] of Object.entries(body.answers).slice(0,80))if(answer&&typeof answer==='object'&&'value' in answer&&typeof answer.value==='string')answers[id]={value:answer.value.slice(0,1000)};
    return NextResponse.json(grade(body.level,answers),{headers:{'Cache-Control':'no-store'}});
  }catch{return NextResponse.json({error:'Não foi possível corrigir as respostas.'},{status:400});}
}
