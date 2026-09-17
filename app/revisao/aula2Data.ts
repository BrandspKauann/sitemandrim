import type { LessonPhrase, LessonTopic, VocabularyGroup } from './aula1Data';

export const AULA2_KEY_PHRASES: LessonPhrase[] = [
  { id: 'a2-son-check', hanzi: '这是您儿子吗？', translation: 'Este é o seu filho?', note: '您 é a forma respeitosa de 你.' },
  { id: 'a2-yes', hanzi: '是的。', translation: 'Sim.' },
  { id: 'a2-not-son', hanzi: '不是，他不是我儿子。', translation: 'Não, ele não é meu filho.' },
  { id: 'a2-student-check', hanzi: '他是你的学生吗？', translation: 'Ele é seu aluno?' },
  { id: 'a2-two-children', hanzi: '我有两个孩子，一个儿子，一个女儿。', translation: 'Tenho dois filhos: um filho e uma filha.' },
  { id: 'a2-how-many-children', hanzi: '您有几个孩子？', translation: 'Quantos filhos o senhor ou a senhora tem?' },
  { id: 'a2-how-many-children-duoshao', hanzi: '您有多少个孩子？', translation: 'Quantos filhos o senhor ou a senhora tem?' },
  { id: 'a2-son-age', hanzi: '您儿子几岁？', translation: 'Quantos anos tem o seu filho?' },
  { id: 'a2-son-five', hanzi: '他今年五岁。', translation: 'Ele tem cinco anos.' },
  { id: 'a2-daughter-age', hanzi: '您女儿多大？', translation: 'Quantos anos tem a sua filha?' },
  { id: 'a2-daughter-twelve', hanzi: '她今年十二岁。', translation: 'Ela tem doze anos.' },
  { id: 'a2-your-age-ji', hanzi: '你几岁了？', translation: 'Quantos anos você tem?' },
  { id: 'a2-your-age-duoda', hanzi: '你多大了？', translation: 'Quantos anos você tem?' },
  { id: 'a2-age-twenty-six', hanzi: '我二十六岁了。', translation: 'Tenho vinte e seis anos.' },
  { id: 'a2-mother-age', hanzi: '您妈妈几岁？', translation: 'Quantos anos tem a sua mãe?' },
  { id: 'a2-mother-fifty-eight', hanzi: '我妈妈今年五十八岁。', translation: 'Minha mãe tem cinquenta e oito anos.' },
  { id: 'a2-brother-age', hanzi: '你哥哥几岁？', translation: 'Quantos anos tem o seu irmão mais velho?' },
  { id: 'a2-brother-thirty-six', hanzi: '我哥哥三十六岁。', translation: 'Meu irmão mais velho tem trinta e seis anos.' },
  { id: 'a2-child-age', hanzi: '小朋友，你几岁了？', translation: 'Criança, quantos anos você tem?' },
  { id: 'a2-six', hanzi: '我六岁了。', translation: 'Tenho seis anos.' },
  { id: 'a2-grade-question', hanzi: '你上几年级了？', translation: 'Em que ano escolar você está?' },
  { id: 'a2-first-grade', hanzi: '我上一年级。', translation: 'Estou no primeiro ano.' },
  { id: 'a2-daughter-fifteen', hanzi: '我女儿十五岁了。', translation: 'Minha filha tem quinze anos.' },
];

export const AULA2_LESSON_TOPICS: LessonTopic[] = [
  {
    marker: '儿', title: '儿子, 女儿 e 孩子', summary: 'As três palavras falam de filhos, mas não têm o mesmo alcance.',
    points: ['儿子 é filho homem.', '女儿 é filha.', '孩子 é criança ou filho de modo geral e pode incluir meninos e meninas.'],
    examples: [AULA2_KEY_PHRASES[4], AULA2_KEY_PHRASES[5]],
  },
  {
    marker: '岁', title: 'Perguntar e dizer a idade', summary: '岁 vem depois do número para indicar anos de idade.',
    points: ['几岁 é muito comum com crianças.', '多大 é frequente com jovens e adultos.', 'Na fala real, as duas formas variam conforme a região e a situação.'],
    examples: [AULA2_KEY_PHRASES[7], AULA2_KEY_PHRASES[9], AULA2_KEY_PHRASES[13]],
  },
  {
    marker: '今', title: '今年 + idade', summary: '今年 localiza a idade no ano atual e costuma vir antes do número.',
    points: ['Modelo: sujeito + 今年 + número + 岁.', '去年 significa “ano passado”.', 'Em português, normalmente basta traduzir como “tem X anos”.'],
    examples: [AULA2_KEY_PHRASES[8], AULA2_KEY_PHRASES[10], AULA2_KEY_PHRASES[15]],
  },
  {
    marker: '几', title: '几个 e 多少个', summary: 'As duas estruturas perguntam quantidade e precisam de classificador.',
    points: ['几个 é natural quando a quantidade esperada é pequena.', '多少个 é uma pergunta mais geral.', 'Na resposta: número + 个 + 孩子.'],
    examples: [AULA2_KEY_PHRASES[5], AULA2_KEY_PHRASES[6], AULA2_KEY_PHRASES[4]],
  },
  {
    marker: '吗', title: 'Identificar pessoas', summary: 'Use 是...吗 para perguntar se alguém é determinada pessoa.',
    points: ['Resposta afirmativa: 是的.', 'Resposta negativa: 不是.', '他 é “ele”; 她 é “ela”. A pronúncia é igual, mas a escrita muda.'],
    examples: [AULA2_KEY_PHRASES[0], AULA2_KEY_PHRASES[2], AULA2_KEY_PHRASES[3]],
  },
  {
    marker: '您', title: 'Tratamento respeitoso', summary: '您 é usado para tratar alguém com respeito.',
    points: ['É apropriado com professores, médicos, pessoas mais velhas e em situações formais.', '你 é a forma cotidiana e informal.', 'Perguntar a idade de adultos mais velhos exige atenção ao contexto e à intimidade.'],
    examples: [AULA2_KEY_PHRASES[0], AULA2_KEY_PHRASES[7], AULA2_KEY_PHRASES[14]],
  },
];

export const AULA2_VOCABULARY_GROUPS: VocabularyGroup[] = [
  {
    title: 'Família e pessoas', description: 'Palavras centrais do diálogo da aula.',
    words: [
      { hanzi: '儿子', translation: 'filho' }, { hanzi: '女儿', translation: 'filha' }, { hanzi: '孩子', translation: 'filho / criança' },
      { hanzi: '男孩', translation: 'menino' }, { hanzi: '女孩', translation: 'menina' }, { hanzi: '妈妈', translation: 'mãe' },
      { hanzi: '哥哥', translation: 'irmão mais velho' }, { hanzi: '学生', translation: 'aluno' }, { hanzi: '小朋友', translation: 'criança' },
    ],
  },
  {
    title: 'Idade e tempo', description: 'Expressões para perguntar e responder a idade.',
    words: [
      { hanzi: '岁', translation: 'anos de idade' }, { hanzi: '今年', translation: 'este ano' }, { hanzi: '去年', translation: 'ano passado' },
      { hanzi: '多大', translation: 'que idade' }, { hanzi: '几岁', translation: 'quantos anos' }, { hanzi: '年龄', translation: 'idade' },
      { hanzi: '青年', translation: 'jovem' }, { hanzi: '中年', translation: 'meia-idade' }, { hanzi: '老人', translation: 'idoso' },
    ],
  },
  {
    title: 'Escola e escrita', description: 'Vocabulário complementar trabalhado na parte final.',
    words: [
      { hanzi: '年级', translation: 'ano escolar' }, { hanzi: '一年级', translation: 'primeiro ano' }, { hanzi: '汉字', translation: 'caractere chinês' },
      { hanzi: '笔画', translation: 'traço' }, { hanzi: '笔顺', translation: 'ordem dos traços' }, { hanzi: '结构', translation: 'estrutura' },
      { hanzi: '上下结构', translation: 'estrutura vertical' }, { hanzi: '左右结构', translation: 'estrutura lateral' },
    ],
  },
];

export const AULA2_HANZI_CORRECTIONS = [
  { hanzi: '一二三', title: 'De cima para baixo', detail: 'Ao empilhar traços horizontais, escreva primeiro o traço superior e avance para baixo.' },
  { hanzi: '笔', title: 'Estrutura superior–inferior', detail: 'Escreva primeiro 竹 na parte de cima e depois 毛 na parte de baixo.' },
  { hanzi: '河', title: 'Estrutura esquerda–direita', detail: 'Escreva primeiro 氵 e depois 可, mantendo os componentes próximos.' },
  { hanzi: '儿', title: 'Gancho curvo', detail: 'Observe o 竖弯钩 no último traço e preserve o espaço interno.' },
  { hanzi: '女', title: '女 em 女儿', detail: 'Mantenha a proporção e a ordem dos traços; 女儿 significa “filha”.' },
  { hanzi: '岁', title: 'Componente superior', detail: '山 fica em cima e 夕 embaixo; escreva seguindo a estrutura vertical.' },
];

export const AULA2_NUMBER_ROWS = [
  { hanzi: '五岁、六岁、十二岁、十五岁', translation: '5, 6, 12 e 15 anos' },
  { hanzi: '二十岁、二十六岁、三十六岁', translation: '20, 26 e 36 anos' },
  { hanzi: '五十八岁、六十岁', translation: '58 e 60 anos' },
  { hanzi: '十二、二十', translation: 'doze e vinte: não confunda a ordem' },
];

export const AULA2_PINYIN_NOTES = [
  { title: '儿子', detail: 'Leia érzi. A segunda sílaba, zi, é leve e costuma ficar em tom neutro.' },
  { title: '孩子', detail: 'Leia háizi. A segunda sílaba também é neutra na fala cotidiana.' },
  { title: '女儿', detail: 'Leia nǚ’ér: duas sílabas, com ü no terceiro tom e ér no segundo.' },
  { title: '今年 e 去年', detail: 'Leia jīnnián e qùnián. Compare o 1º tom de jīn com o 4º tom de qù.' },
  { title: '十二 x 二十', detail: 'Shí’èr é 12; èrshí é 20. A ordem das sílabas muda o número.' },
  { title: 'Dois terceiros tons', detail: 'Em 水果 e 你好, o primeiro 3º tom costuma soar como 2º na fala natural: shuíguǒ, níhǎo.' },
];

export const AULA2_WRITING_EXERCISES = [
  { prompt: 'Este é o seu filho?', answer: '这是您儿子吗', hint: 'Use tratamento respeitoso e uma pergunta de sim ou não.' },
  { prompt: 'Ele não é meu filho.', answer: '他不是我儿子', hint: 'Negue o verbo “ser”.' },
  { prompt: 'Quantos filhos o senhor ou a senhora tem?', answer: '您有几个孩子', hint: 'Use tratamento respeitoso e uma pergunta de quantidade pequena.' },
  { prompt: 'Tenho dois filhos: um filho e uma filha.', answer: '我有两个孩子一个儿子一个女儿', hint: 'Informe o total primeiro e depois detalhe quem são.' },
  { prompt: 'Quantos anos tem o seu filho?', answer: '您儿子几岁', hint: 'Use a forma de perguntar idade mais comum para crianças.' },
  { prompt: 'Ele tem cinco anos.', answer: '他今年五岁', hint: 'Diga a pessoa, o ano atual e depois a idade.' },
  { prompt: 'Quantos anos tem a sua filha?', answer: '您女儿多大', hint: 'Use a pergunta de idade baseada em “quão grande”.' },
  { prompt: 'Ela tem doze anos.', answer: '她今年十二岁', hint: 'Use o pronome feminino e indique que é a idade deste ano.' },
  { prompt: 'Minha mãe tem cinquenta e oito anos.', answer: '我妈妈今年五十八岁', hint: 'Monte 58 como cinco dezenas e oito unidades.' },
  { prompt: 'Meu irmão mais velho tem trinta e seis anos.', answer: '我哥哥三十六岁', hint: 'Monte 36 como três dezenas e seis unidades.' },
  { prompt: 'Em que ano escolar você está?', answer: '你上几年级了', hint: 'Pergunte qual é o nível escolar frequentado.' },
  { prompt: 'Estou no primeiro ano.', answer: '我上一年级', hint: 'Responda com o verbo “frequentar” e o nível escolar.' },
];

export const AULA2_LISTENING_EXERCISES = [
  { phraseId: 'a2-son-check', choices: ['Este é o seu filho?', 'Este é o seu aluno?', 'Quantos filhos você tem?'] },
  { phraseId: 'a2-two-children', choices: ['Tenho duas filhas.', 'Tenho dois filhos: um filho e uma filha.', 'Tenho dois alunos.'] },
  { phraseId: 'a2-son-age', choices: ['Quantos anos tem o seu filho?', 'Quantos filhos você tem?', 'Seu filho estuda?'] },
  { phraseId: 'a2-son-five', choices: ['Ele tem cinco anos.', 'Ele tem quinze anos.', 'Ela tem cinco anos.'] },
  { phraseId: 'a2-daughter-twelve', choices: ['Ela tem vinte anos.', 'Ela tem doze anos.', 'Ele tem doze filhos.'] },
  { phraseId: 'a2-your-age-duoda', choices: ['Qual é o seu nome?', 'Quantos anos você tem?', 'Em que ano você está?'] },
  { phraseId: 'a2-mother-fifty-eight', choices: ['Minha mãe tem cinquenta e oito anos.', 'Minha mãe tem sessenta anos.', 'Minha filha tem dezoito anos.'] },
  { phraseId: 'a2-brother-thirty-six', choices: ['Meu irmão tem vinte e seis anos.', 'Meu irmão mais velho tem trinta e seis anos.', 'Meu pai tem trinta e seis anos.'] },
  { phraseId: 'a2-child-age', choices: ['Criança, quantos anos você tem?', 'Criança, como você se chama?', 'Você tem filhos?'] },
  { phraseId: 'a2-grade-question', choices: ['Em que ano escolar você está?', 'Quantos anos tem a escola?', 'Onde fica a escola?'] },
];

export const AULA2_HOMEWORK = [
  'Repetir o diálogo principal até responder sem olhar: dois filhos, filho de 5 anos e filha de 12 anos.',
  'Treinar em voz alta as duas perguntas de idade: 几岁 e 多大.',
  'Escrever cinco respostas com 今年 + número + 岁, variando a pessoa e a idade.',
  'Comparar e repetir 十二 e 二十 para não inverter 12 e 20.',
  'Praticar a ordem dos traços: de cima para baixo e da esquerda para a direita.',
];
