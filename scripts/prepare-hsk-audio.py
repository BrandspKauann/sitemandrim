"""Generate the original Mandarin mock-exam audio (requires edge-tts).
Synthetic educational voices, not official CTI recordings. Never synthesizes private lesson material.
"""
import asyncio
import json
import hashlib
from pathlib import Path
import edge_tts

OUTPUT = Path('public/audio/simulado')
OUTPUT.mkdir(parents=True, exist_ok=True)
ITEMS = json.loads(Path('tmp/hsk-reference/audio-scripts.json').read_text(encoding='utf-8'))
MANIFEST_PATH = OUTPUT / 'manifest.json'
MANIFEST = json.loads(MANIFEST_PATH.read_text(encoding='utf-8')) if MANIFEST_PATH.exists() else {}

async def generate(item, semaphore):
    destination = OUTPUT / (item['id'] + '.mp3')
    digest = hashlib.sha256(json.dumps(item,ensure_ascii=False,sort_keys=True).encode()).hexdigest()
    if destination.exists() and destination.stat().st_size > 1000 and MANIFEST.get(item['id']) == digest:
        return
    async with semaphore:
        for retry in range(3):
            try:
                chunks = []
                for index, text in enumerate(item['turns']):
                    voice = 'zh-CN-XiaoxiaoNeural' if index % 2 == 0 else 'zh-CN-YunxiNeural'
                    rate = {1: '-8%', 2: '-4%', 3: '+0%'}[item['level']]
                    async for chunk in edge_tts.Communicate(text, voice, rate=rate).stream():
                        if chunk['type'] == 'audio':
                            chunks.append(chunk['data'])
                payload = b''.join(chunks)
                if len(payload) < 1000:
                    raise RuntimeError('Empty synthesized audio')
                destination.write_bytes(payload)
                MANIFEST[item['id']] = digest
                print(item['id'], len(payload), flush=True)
                return
            except Exception:
                if retry == 2:
                    raise
                await asyncio.sleep(2 * (retry + 1))

async def main():
    semaphore = asyncio.Semaphore(4)
    await asyncio.gather(*(generate(item, semaphore) for item in ITEMS))
    MANIFEST_PATH.write_text(json.dumps(MANIFEST,indent=2),encoding='utf-8')

asyncio.run(main())
