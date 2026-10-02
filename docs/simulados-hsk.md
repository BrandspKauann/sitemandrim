# Simulados HSK

Primeira edição de três simulados autorais para estudo, baseada no novo HSK 3.0. Conferência das fontes: 2 de outubro de 2026. Não é uma aplicação oficial CTI.

## Estrutura verificada

| Nível | Escuta | Leitura | Escrita | Questões | Tempo de resposta no app | Total oficial aproximado |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 20 / 12 min | 20 / 20 min | — | 40 | 32 min | 40 min |
| 2 | 25 / 17 min | 25 / 25 min | 10 / 10 min | 60 | 52 min | 60 min |
| 3 | 30 / 23 min | 30 / 30 min | 10 / 20 min | 70 | 73 min | 83 min |

Os totais oficiais incluem procedimentos administrativos. O app não exige preencher dados pessoais ou transferir respostas para cartão. O oral do nível 3 é separado: oito repetições, cinco descrições de imagem e duas perguntas; prática com gravações limitadas a 10, 15 e 90 segundos, respectivamente, e preparação opcional de seis minutos.

Fontes primárias:

- [Portal CTI — HSK 3.0](https://www.chinesetest.cn/)
- [Pacote oficial de amostras](https://hsk-sample-1409982902.cos.ap-beijing.myqcloud.com/HSK3.0.zip)
- [Aviso oficial do piloto de setembro de 2026 e durações](https://admin.chinesetest.cn/gonewcontent.do?id=51236758)

Os PDFs do pacote foram extraídos e inspecionados. A página de escrita do nível 2 demonstra completar caracteres com componentes. A adaptação digital usa pinyin e componentes separados, e informa essa diferença na interface. Não reproduzimos os enunciados, ilustrações ou gravações oficiais.

## Funcionamento e limites

- 170 questões fixas autorais; novas tentativas embaralham alternativas, não inventam novos enunciados.
- Grupos de associação têm seis alternativas estáveis para cinco questões.
- As chaves e transcrições de escuta são mantidas no servidor e aparecem apenas depois da entrega. Trata-se de treino pessoal, não de prova supervisionada ou mecanismo antifraude.
- Modo prova: cronômetro absoluto por seção, sem pausa; a contagem continua fora da página. Se o navegador suspender o processo, o prazo é recalculado na retomada, sem devolver tempo vencido.
- Modo treino: navegação livre, sem prazo, áudio natural ou a 0,75×/0,6×.
- Uma ou duas reproduções por questão são uma configuração do aplicativo, não uma política oficial confirmada. Após o áudio, o modo prova dá dez segundos e avança.
- Respostas ativas são salvas na aba, resultados neste navegador. Não há sincronização entre dispositivos ou upload de gravações.
- Escrita objetiva: caracteres simplificados com normalização Unicode e pontuação/espacos ignorados. Escrita livre: exemplos e rubrica de autoavaliação 0–4; nenhuma promessa de correção semântica ou gramatical automática.
- Resultado por seção em escala de prática 0–100; não aplicamos uma nota oficial de aprovação. CSV, JSON e impressão/salvar PDF do navegador.
- Microfone: só solicitado quando a pessoa clica para gravar; gravações seguem a sessão e o escopo de cada questão, armazenadas localmente em IndexedDB.

## Imagens autorais

Geradas com o gerador de imagens integrado, como três atlas 3×3. Originais preservados; arquivos finais convertidos para WebP sem alteração artística e conferidos visualmente. As imagens são recortadas pela posição do fundo CSS, sem texto que revele a resposta.

Arquivos finais:

- `public/images/simulado/basic.webp`
- `public/images/simulado/daily.webp`
- `public/images/simulado/advanced.webp`

Prompt comum utilizado:

> Use case: scientific-educational. Asset type: ONE sprite atlas of nine picture choices for a Chinese language computer mock exam. Create an EXACT 3 columns by 3 rows grid occupying a square canvas, every cell identical square size, aligned exactly at thirds of canvas. Nine separate black and white textbook line drawings, clear naturalistic educational illustration with white backgrounds and subtle gray hatching. Thin light gray dividers exactly at thirds. No labels, letters, numbers, words, logos or watermarks anywhere. Each scene centered within its own cell with 10% white padding, never crossing cell boundaries. Semantic precision essential; no extraneous objects that could confuse a test-taker.

Conjunto de cenas anexado a cada prompt, em ordem de leitura:

**basic**

> top row: exactly three red apples on a plate; a single teacup with green tea; one closed blue book. Middle row: a cat sitting UNDER a wooden table; a student reading at a desk; a mother with exactly two children. Bottom row: a man eating rice from a bowl; a doctor wearing white coat with stethoscope; a woman sleeping in a bed.

**daily**

> top row: city bus at a bus stop; a woman kicking a soccer ball; a man in light rain holding an umbrella. Middle row: a woman shopping for a red shirt; a man swimming in a pool; an airplane taking off. Bottom row: a man cooking at a stove; a woman drinking water from a clear glass; a young man riding a bicycle outdoors.

**advanced**

> top row: three office workers sitting around a conference table in a meeting; a woman taking a photograph outdoors with a camera; a patient lying in a hospital bed. Middle row: two adults playing badminton with racket and shuttlecock; a man cleaning a room with a broom; a woman looking for a phone underneath a sofa. Bottom row: a cinema auditorium with audience looking at a screen; a teacher teaching two students in a classroom; two friends walking in a park with trees.

A cor da roupa não foi usada como informação avaliada, pois a ilustração final é predominantemente monocromática.

## Áudio e manutenção

83 MP3 autorais, sintetizados em mandarim: 75 de escuta e oito de repetição oral. Vozes Xiaoxiao/Yunxi; diálogo com vozes alternadas. Os níveis 1/2 usam taxas de síntese ligeiramente menores. São arquivos estáticos, sem depender da voz instalada no navegador.

Para regenerar após mudanças nos scripts:

```powershell
node scripts/prepare-hsk-audio.mjs
python scripts/prepare-hsk-audio.py
node scripts/test-hsk-simulado.mjs
npm run build
```

O script Python requer `edge-tts`. Um manifesto de hashes evita manter um áudio antigo após alteração de enunciado. O teste verifica contagens por nível/parte, chaves válidas, ausência de gabarito no formulário público, embaralhamento reproduzível, consistência dos grupos, correção e presença dos arquivos de mídia.
