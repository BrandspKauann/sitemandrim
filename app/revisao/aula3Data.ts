import type { LessonPhrase, LessonTopic, VocabularyGroup } from './aula1Data';

export const AULA3_KEY_PHRASES: LessonPhrase[] = [
  { id: 'a3-phone-question', hanzi: '你的手机号是多少？', spokenPinyin: 'nǐ de | shǒujī hào | shì duōshao?', translation: 'Qual é o número do seu celular?' },
  { id: 'a3-phone-answer', hanzi: '我的手机号是六九八五八〇六。', spokenPinyin: 'wǒ de | shǒujī hào shì | liù jiǔ bā, | wǔ bā líng liù.', translation: 'Meu número de celular é 6985806.' },
  { id: 'a3-call-tonight', hanzi: '你晚上给我打电话吧。', spokenPinyin: 'nǐ wǎnshang | gěi wǒ | dǎ diànhuà ba.', translation: 'Ligue para mim à noite.' },
  { id: 'a3-new-phone', hanzi: '这是你的新手机吗？', spokenPinyin: 'zhè shì | nǐ de | xīn shǒujī ma?', translation: 'Este é o seu celular novo?' },
  { id: 'a3-where-now', hanzi: '你现在在哪儿？', spokenPinyin: 'nǐ xiànzài | zài nǎr?', translation: 'Onde você está agora?' },
  { id: 'a3-at-school', hanzi: '我在学校。', spokenPinyin: 'wǒ zài xuéxiào.', translation: 'Estou na escola.' },
  { id: 'a3-where-going', hanzi: '你去哪儿？', spokenPinyin: 'nǐ qù nǎr?', translation: 'Aonde você vai?' },
  { id: 'a3-go-park', hanzi: '我去公园。', spokenPinyin: 'wǒ qù gōngyuán.', translation: 'Vou ao parque.' },
  { id: 'a3-go-friend', hanzi: '我去朋友家。', spokenPinyin: 'wǒ qù péngyou jiā.', translation: 'Vou à casa de um amigo.' },
  { id: 'a3-plan-where', hanzi: '你明天想去哪儿？', spokenPinyin: 'nǐ míngtiān | xiǎng qù nǎr?', translation: 'Aonde você quer ir amanhã?' },
  { id: 'a3-supermarket-things', hanzi: '我想去超市买东西。', spokenPinyin: 'wǒ xiǎng qù chāoshì | mǎi dōngxi.', translation: 'Quero ir ao supermercado comprar coisas.' },
  { id: 'a3-buy-what', hanzi: '你去超市买什么？', spokenPinyin: 'nǐ qù chāoshì | mǎi shénme?', translation: 'O que você vai comprar no supermercado?' },
  { id: 'a3-buy-milk', hanzi: '我想买些牛奶。', spokenPinyin: 'wǒ | xiáng mǎi | xiē niúnǎi.', translation: 'Quero comprar um pouco de leite.', note: '想买 forma um bloco 3º + 3º e soa xiáng mǎi na fala.' },
  { id: 'a3-buy-fruit', hanzi: '我想买些水果。', spokenPinyin: 'wǒ | xiáng mǎi | xiē shuíguǒ.', translation: 'Quero comprar algumas frutas.', note: 'Na fala natural, 想买 soa xiáng mǎi e 水果 soa shuíguǒ.' },
  { id: 'a3-eat-what', hanzi: '你想吃什么？', spokenPinyin: 'ní xiǎng | chī shénme?', translation: 'O que você quer comer?' },
  { id: 'a3-eat-noodles', hanzi: '我想吃面条。', spokenPinyin: 'wǒ xiǎng | chī miàntiáo.', translation: 'Quero comer macarrão.' },
  { id: 'a3-drink-what', hanzi: '你想喝什么？', spokenPinyin: 'ní xiǎng | hē shénme?', translation: 'O que você quer beber?' },
  { id: 'a3-drink-tea', hanzi: '我想喝茶。', spokenPinyin: 'wǒ xiǎng | hē chá.', translation: 'Quero beber chá.' },
  { id: 'a3-not-watch', hanzi: '我不想看电视。', spokenPinyin: 'wǒ bù xiǎng | kàn diànshì.', translation: 'Não quero assistir à televisão.' },
  { id: 'a3-rest-home', hanzi: '我想在家休息。', spokenPinyin: 'wǒ xiǎng | zài jiā xiūxi.', translation: 'Quero descansar em casa.' },
  { id: 'a3-dinner-together', hanzi: '我们一起吃晚饭吧。', spokenPinyin: 'wǒmen yìqǐ | chī wǎnfàn ba.', translation: 'Vamos jantar juntos.' },
  { id: 'a3-okay', hanzi: '好的。', spokenPinyin: 'hǎo de.', translation: 'Está bem.' },
  { id: 'a3-dinner-what', hanzi: '你晚饭吃了什么？', spokenPinyin: 'nǐ wǎnfàn | chīle shénme?', translation: 'O que você comeu no jantar?' },
  { id: 'a3-ate-baozi', hanzi: '我吃了一些包子。', spokenPinyin: 'wǒ chīle | yìxiē bāozi.', translation: 'Comi alguns baozi.' },
  { id: 'a3-jiaozi-good', hanzi: '这个饺子好吃吗？', spokenPinyin: 'zhège jiǎozi | hǎochī ma?', translation: 'Este jiaozi é gostoso?' },
  { id: 'a3-very-tasty', hanzi: '非常好吃。', spokenPinyin: 'fēicháng hǎochī.', translation: 'É muito gostoso.' },
  { id: 'a3-computer-pretty', hanzi: '我新买的电脑好看吗？', spokenPinyin: 'wǒ xīn mǎi de | diànnǎo hǎokàn ma?', translation: 'O computador novo que comprei é bonito?' },
  { id: 'a3-very-pretty', hanzi: '非常好看。', spokenPinyin: 'fēicháng hǎokàn.', translation: 'É muito bonito.' },
  { id: 'a3-sunday-how', hanzi: '星期天你怎么过？', spokenPinyin: 'xīngqītiān | nǐ zěnme guò?', translation: 'Como você vai passar o domingo?' },
  { id: 'a3-may-sit', hanzi: '你好，我可以坐这里吗？', spokenPinyin: 'ní hǎo, | wǒ kěyǐ | zuò zhèli ma?', translation: 'Olá, posso sentar aqui?' },
  { id: 'a3-please-sit', hanzi: '可以，请坐。', spokenPinyin: 'kěyǐ, | qǐng zuò.', translation: 'Pode, sente-se por favor.' },
  { id: 'a3-how-restaurant', hanzi: '我们怎么去西安饭店？', spokenPinyin: 'wǒmen zěnme | qù Xī’ān fàndiàn?', translation: 'Como vamos ao restaurante Xi’an?' },
  { id: 'a3-by-taxi', hanzi: '坐出租车去。', spokenPinyin: 'zuò chūzūchē qù.', translation: 'Vamos de táxi.' },
  { id: 'a3-mother-market', hanzi: '妈妈去菜市场买蔬菜。', spokenPinyin: 'māma qù càishìchǎng | mǎi shūcài.', translation: 'Mamãe vai à feira comprar verduras.' },
  { id: 'a3-subway-school', hanzi: '我坐地铁去学校上课。', spokenPinyin: 'wǒ zuò dìtiě | qù xuéxiào shàngkè.', translation: 'Vou de metrô à escola ter aula.' },
  { id: 'a3-taxi-restaurant', hanzi: '我们坐出租车去饭店。', spokenPinyin: 'wǒmen zuò chūzūchē | qù fàndiàn.', translation: 'Vamos de táxi ao restaurante.' },
  { id: 'a3-usually-shop', hanzi: '你平时在哪里买东西？', spokenPinyin: 'nǐ píngshí | zài nǎli | mǎi dōngxi?', translation: 'Onde você costuma comprar coisas?' },
  { id: 'a3-baozi-there', hanzi: '那边的包子非常好吃。', spokenPinyin: 'nàbian de bāozi | fēicháng hǎochī.', translation: 'Os baozi de lá são muito gostosos.' },
  { id: 'a3-rice-not-baozi', hanzi: '他想吃米饭，不想吃包子。', spokenPinyin: 'tā xiǎng chī mǐfàn, | bù xiǎng chī bāozi.', translation: 'Ele quer comer arroz, mas não quer baozi.' },
  { id: 'a3-supermarket-milk', hanzi: '我想去超市买牛奶。', spokenPinyin: 'wǒ xiǎng qù chāoshì | mǎi niúnǎi.', translation: 'Quero ir ao supermercado comprar leite.' },
];

export const AULA3_LESSON_TOPICS: LessonTopic[] = [
  {
    marker: '号',
    title: 'Telefone e leitura dos algarismos',
    summary: 'Em números de telefone, cada algarismo é lido separadamente e o número 1 costuma ser pronunciado yāo. Não é uma quantidade comum.',
    points: [
      '手机号 é número de celular; 电话号码 é número de telefone em geral.',
      'Pergunte com 你的手机号是多少？ e responda com 我的手机号是……',
      'Em telefone, quarto ou código, 幺 yāo evita confundir 一 yī com 七 qī.',
    ],
    examples: [AULA3_KEY_PHRASES[0], AULA3_KEY_PHRASES[1], AULA3_KEY_PHRASES[2]],
  },
  {
    marker: '哪',
    title: 'Onde está e aonde vai',
    summary: '在 marca localização; 去 introduz o destino. 哪儿 e 哪里 perguntam o lugar.',
    points: [
      '你现在在哪儿？ pergunta onde a pessoa está agora.',
      '你去哪儿？ pergunta o destino do movimento.',
      '这儿 é “aqui”; 那儿 é “ali/lá”; 哪儿 é “onde”.',
    ],
    examples: [AULA3_KEY_PHRASES[4], AULA3_KEY_PHRASES[5], AULA3_KEY_PHRASES[6]],
  },
  {
    marker: '想',
    title: '想 e 不想: vontade ou plano',
    summary: '想 vem antes de outro verbo para dizer o que alguém quer ou pretende fazer. A negação é 不想.',
    points: [
      'Estrutura: sujeito + 想/不想 + verbo + complemento.',
      'Use 你想吃什么？, 你想喝什么？ e 你想去哪儿？ para criar respostas pessoais.',
      'Mantenha 想 antes da ação; omiti-lo pode mudar completamente o sentido da pergunta.',
    ],
    examples: [AULA3_KEY_PHRASES[9], AULA3_KEY_PHRASES[14], AULA3_KEY_PHRASES[18]],
  },
  {
    marker: '买',
    title: 'Comprar coisas e quantidade indefinida',
    summary: '买 é comprar, 卖 é vender e 东西 é “coisa”. 一些 indica alguns ou um pouco, sem quantidade exata.',
    points: [
      '买 e 卖 são parecidos: 卖 tem o componente 十 no topo; 买 não tem.',
      '东西 se pronuncia dōngxi, com a segunda sílaba em tom neutro.',
      '些 não impõe um mínimo fixo: o contexto define se é “alguns” ou “um pouco”.',
    ],
    examples: [AULA3_KEY_PHRASES[10], AULA3_KEY_PHRASES[11], AULA3_KEY_PHRASES[12]],
  },
  {
    marker: '怎',
    title: '怎么 e meios de transporte',
    summary: '怎么 pergunta como uma ação é realizada. Com 去, ele pede o meio ou o caminho usado para chegar a um lugar.',
    points: [
      '怎么去？ significa “como ir?”; 怎么了？ significa “o que aconteceu?”.',
      'Use 坐 com transporte público ou táxi: 坐地铁, 坐公交车, 坐出租车.',
      '开车 é dirigir, 骑自行车 é ir de bicicleta e 走路 é ir a pé.',
    ],
    examples: [AULA3_KEY_PHRASES[28], AULA3_KEY_PHRASES[31], AULA3_KEY_PHRASES[32]],
  },
  {
    marker: '去',
    title: 'Duas ações na mesma frase',
    summary: 'Na frase com verbos em sequência, a primeira ação prepara ou possibilita a segunda. A ordem mostra destino, meio e finalidade.',
    points: [
      'Modelo: sujeito + ir/meio + lugar + ação principal.',
      '我去超市买东西: ir ao supermercado é o movimento; comprar é a finalidade.',
      'Essa ordem é importante em exercícios de reorganizar palavras do HSK.',
    ],
    examples: [AULA3_KEY_PHRASES[10], AULA3_KEY_PHRASES[33], AULA3_KEY_PHRASES[34]],
  },
];

export const AULA3_VOCABULARY_GROUPS: VocabularyGroup[] = [
  {
    title: 'Telefone e contato',
    description: 'Palavras para falar de celular, número e ligações.',
    words: [
      { hanzi: '手机', translation: 'celular' }, { hanzi: '电话', translation: 'telefone / ligação' },
      { hanzi: '打电话', translation: 'telefonar' }, { hanzi: '接电话', translation: 'atender o telefone' },
      { hanzi: '电话号码', translation: 'número de telefone' }, { hanzi: '手机号', translation: 'número de celular' },
      { hanzi: '号', translation: 'número' }, { hanzi: '晚上', translation: 'noite' },
    ],
  },
  {
    title: 'Lugares e direção',
    description: 'Destinos e palavras para localizar alguém ou alguma coisa.',
    words: [
      { hanzi: '哪儿 / 哪里', translation: 'onde' }, { hanzi: '这儿', translation: 'aqui' }, { hanzi: '那儿', translation: 'ali / lá' },
      { hanzi: '学校', translation: 'escola' }, { hanzi: '公司', translation: 'empresa' }, { hanzi: '家里', translation: 'em casa' },
      { hanzi: '图书馆', translation: 'biblioteca' }, { hanzi: '饭店', translation: 'restaurante' }, { hanzi: '公园', translation: 'parque' },
    ],
  },
  {
    title: 'Planos e ações',
    description: 'Verbos usados para montar perguntas e respostas sobre intenção.',
    words: [
      { hanzi: '去', translation: 'ir' }, { hanzi: '想', translation: 'querer / pretender' }, { hanzi: '不想', translation: 'não querer' },
      { hanzi: '买', translation: 'comprar' }, { hanzi: '卖', translation: 'vender' }, { hanzi: '吃', translation: 'comer' },
      { hanzi: '喝', translation: 'beber' }, { hanzi: '休息', translation: 'descansar' }, { hanzi: '上课', translation: 'ter aula' },
    ],
  },
  {
    title: 'Compras e lojas',
    description: 'Onde comprar e como falar de uma quantidade não exata.',
    words: [
      { hanzi: '东西', translation: 'coisa' }, { hanzi: '一些', translation: 'alguns / um pouco' }, { hanzi: '超市', translation: 'supermercado' },
      { hanzi: '商场', translation: 'shopping' }, { hanzi: '商店', translation: 'loja' }, { hanzi: '便利店', translation: 'loja de conveniência' },
      { hanzi: '菜市场', translation: 'feira / mercado' }, { hanzi: '文具店', translation: 'papelaria' }, { hanzi: '花店', translation: 'floricultura' },
      { hanzi: '书店', translation: 'livraria' },
    ],
  },
  {
    title: 'Comida e descrição',
    description: 'Refeições, alimentos e adjetivos usados nos diálogos.',
    words: [
      { hanzi: '米饭', translation: 'arroz cozido' }, { hanzi: '面条', translation: 'macarrão' }, { hanzi: '饺子', translation: 'jiaozi' },
      { hanzi: '包子', translation: 'baozi' }, { hanzi: '牛奶', translation: 'leite' }, { hanzi: '水果', translation: 'fruta' },
      { hanzi: '蔬菜', translation: 'verdura' }, { hanzi: '早餐', translation: 'café da manhã' }, { hanzi: '午餐', translation: 'almoço' },
      { hanzi: '晚饭 / 晚餐', translation: 'jantar' }, { hanzi: '主食', translation: 'alimento básico' },
      { hanzi: '好吃', translation: 'gostoso' }, { hanzi: '好看', translation: 'bonito' }, { hanzi: '非常', translation: 'muito' },
    ],
  },
  {
    title: 'Transporte',
    description: 'Formas de responder à pergunta 怎么去？',
    words: [
      { hanzi: '走路', translation: 'ir a pé' }, { hanzi: '骑自行车', translation: 'ir de bicicleta' },
      { hanzi: '坐公交车', translation: 'ir de ônibus' }, { hanzi: '坐出租车', translation: 'ir de táxi' },
      { hanzi: '坐地铁', translation: 'ir de metrô' }, { hanzi: '开车', translation: 'dirigir' },
    ],
  },
];

export const AULA3_HANZI_CORRECTIONS = [
  { hanzi: '手机', title: 'Celular', detail: '手 deve conservar o gancho vertical; em 机, equilibre 木 e 几 dentro do mesmo quadrado.' },
  { hanzi: '电话', title: 'Telefone', detail: 'Em 电, o último traço sai por baixo do quadro. Em 话, mantenha 讠 estreito à esquerda.' },
  { hanzi: '号', title: 'Número', detail: 'Faça 口 compacto e termine a parte inferior com a dobra e o gancho.' },
  { hanzi: '哪儿', title: 'Onde', detail: '哪 tem 口 à esquerda. 儿 mantém espaço interno e termina com o gancho curvo.' },
  { hanzi: '想', title: 'Querer', detail: 'É uma estrutura superior–inferior: 相 fica em cima e 心, mais largo, sustenta o caractere.' },
  { hanzi: '超市', title: 'Supermercado', detail: 'Em 超, o 口 inferior fica fechado e sem uma haste vertical sobrando. 市 deve permanecer centralizado.' },
  { hanzi: '买 / 卖', title: 'Comprar e vender', detail: '卖 tem 十 no topo; 买 não tem. Esse pequeno componente muda completamente o significado.' },
  { hanzi: '牛奶', title: 'Leite', detail: 'Em 奶, 女 fica estreito à esquerda para dar espaço ao componente da direita.' },
  { hanzi: '包', title: 'Baozi / embrulhar', detail: 'O primeiro traço deve avançar mais para a esquerda e envolver bem a parte interna.' },
  { hanzi: '非常', title: 'Muito', detail: 'Observe as hastes paralelas de 非 e mantenha 常 equilibrado na estrutura superior–inferior.' },
  { hanzi: '好吃', title: 'Gostoso', detail: 'Em 好, aproxime 女 e 子. 吃 combina 口 à esquerda com o componente da direita.' },
  { hanzi: '出租车', title: 'Táxi', detail: 'Em 租, o primeiro traço inclinado de 禾 deve ser longo; mantenha 且 compacto à direita.' },
];

export const AULA3_NUMBER_ROWS = [
  { hanzi: '〇、一、二、三、四', translation: 'líng, yī, èr, sān, sì — zero a quatro' },
  { hanzi: '五、六、七、八、九', translation: 'wǔ, liù, qī, bā, jiǔ — cinco a nove' },
  { hanzi: '电话号码：一读作幺', translation: 'em telefone, 1 costuma ser lido yāo' },
  { hanzi: '六九八、五八〇六', translation: '698-5806 — liù jiǔ bā, wǔ bā líng liù' },
  { hanzi: '幺三五、八〇六、二四九七', translation: '135-806-2497 — leitura algarismo por algarismo' },
  { hanzi: '一百二十二', translation: 'cento e vinte e dois — leitura de quantidade' },
  { hanzi: '一二二号房间', translation: 'quarto 122 — yāo èr èr, como código' },
];

export const AULA3_PINYIN_NOTES = [
  { title: '幺 — yāo', detail: 'Em telefone, quarto ou código, o algarismo 1 costuma ser lido yāo para não ser confundido com 七 qī.' },
  { title: '哪儿 — nǎr', detail: 'O 儿 se incorpora à sílaba anterior: 哪儿 soa nǎr, em um único bloco.' },
  { title: '东西 — dōngxi', detail: 'A segunda sílaba fica leve, em tom neutro: dōngxi.' },
  { title: '西安 — Xī’ān', detail: 'O apóstrofo separa duas sílabas quando a segunda começa por a, o ou e. Ele também aparece em pí’ǎo (皮袄).' },
  { title: '想买 — xiáng mǎi', detail: 'No bloco 3º + 3º, 想 soa como 2º tom antes de 买: xiáng mǎi.' },
  { title: '水果 — shuíguǒ', detail: 'Na fala natural, o primeiro 3º tom do bloco muda: shuíguǒ.' },
  { title: '你想 — ní xiǎng', detail: 'Quando sujeito e modal formam um bloco próximo, o primeiro 3º tom soa como 2º: ní xiǎng.' },
  { title: '超市 — chāoshì', detail: '超 leva 1º tom alto e estável; 市 leva 4º tom com queda firme.' },
  { title: '牛奶 — niúnǎi', detail: '牛 sobe no 2º tom e 奶 faz o contorno do 3º tom.' },
];

export const AULA3_WRITING_EXERCISES = [
  { prompt: 'Qual é o número do seu celular?', answer: '你的手机号是多少', hint: 'Use o substantivo específico para celular e uma pergunta de quantidade geral.' },
  { prompt: 'Ligue para mim à noite.', answer: '你晚上给我打电话吧', hint: 'Coloque o período do dia antes da expressão “telefonar para alguém”.' },
  { prompt: 'Aonde você quer ir amanhã?', answer: '你明天想去哪儿', hint: 'A ordem é tempo, vontade, movimento e destino interrogativo.' },
  { prompt: 'Quero ir ao supermercado comprar coisas.', answer: '我想去超市买东西', hint: 'Primeiro diga o destino; depois, a finalidade da ida.' },
  { prompt: 'O que você vai comprar no supermercado?', answer: '你去超市买什么', hint: 'Mantenha lugar antes da ação principal e deixe o objeto interrogativo no final.' },
  { prompt: 'Quero comprar um pouco de leite.', answer: '我想买些牛奶', hint: 'Use vontade + comprar + quantidade indefinida + produto.' },
  { prompt: 'O que você quer comer?', answer: '你想吃什么', hint: 'A palavra interrogativa ocupa o lugar do alimento na frase.' },
  { prompt: 'Não quero comer arroz.', answer: '我不想吃米饭', hint: 'Negue a vontade antes da ação, não o alimento.' },
  { prompt: 'Como vamos ao restaurante Xi’an?', answer: '我们怎么去西安饭店', hint: 'Pergunte pelo modo antes do verbo de movimento.' },
  { prompt: 'Mamãe vai à feira comprar verduras.', answer: '妈妈去菜市场买蔬菜', hint: 'Organize como pessoa + movimento + lugar + finalidade.' },
  { prompt: 'Vou de metrô à escola ter aula.', answer: '我坐地铁去学校上课', hint: 'Informe meio, destino e atividade nessa ordem.' },
  { prompt: 'Posso sentar aqui?', answer: '我可以坐这里吗', hint: 'Use a possibilidade antes da ação e termine com a partícula de pergunta.' },
];

export const AULA3_LISTENING_EXERCISES = [
  { phraseId: 'a3-phone-question', choices: ['Qual é o número do seu celular?', 'Onde está o seu celular?', 'Este celular é novo?'] },
  { phraseId: 'a3-call-tonight', choices: ['Ligue para mim à noite.', 'Atenda o telefone agora.', 'Compre um celular amanhã.'] },
  { phraseId: 'a3-where-now', choices: ['Onde você está agora?', 'Aonde você vai amanhã?', 'Onde fica a escola?'] },
  { phraseId: 'a3-plan-where', choices: ['Aonde você quer ir amanhã?', 'O que você quer comprar?', 'Como você vai trabalhar?'] },
  { phraseId: 'a3-supermarket-things', choices: ['Quero ir ao supermercado comprar coisas.', 'Quero ir ao restaurante comer.', 'Costumo comprar na papelaria.'] },
  { phraseId: 'a3-buy-milk', choices: ['Quero comprar um pouco de leite.', 'Quero beber um pouco de água.', 'Comprei algumas frutas.'] },
  { phraseId: 'a3-eat-what', choices: ['O que você quer comer?', 'O que você sabe cozinhar?', 'Onde você jantou?'] },
  { phraseId: 'a3-not-watch', choices: ['Não quero assistir à televisão.', 'Não gosto deste computador.', 'Não posso descansar em casa.'] },
  { phraseId: 'a3-dinner-together', choices: ['Vamos jantar juntos.', 'Vamos comprar o jantar.', 'Vou cozinhar sozinho.'] },
  { phraseId: 'a3-how-restaurant', choices: ['Como vamos ao restaurante Xi’an?', 'Onde fica o restaurante Xi’an?', 'O restaurante Xi’an é bom?'] },
  { phraseId: 'a3-mother-market', choices: ['Mamãe vai à feira comprar verduras.', 'Mamãe vai ao mercado vender frutas.', 'Mamãe cozinha no restaurante.'] },
  { phraseId: 'a3-subway-school', choices: ['Vou de metrô à escola ter aula.', 'Vou de táxi à biblioteca estudar.', 'Vou a pé ao trabalho.'] },
];

export const AULA3_HOMEWORK = [
  'Ler o diálogo de compras todos os dias até dizer cada fala sem depender do pinyin.',
  'Gravar respostas pessoais para 你想吃什么？, 你想喝什么？ e 你想去哪儿？',
  'Escrever os caracteres novos, com atenção especial a 超, 包, 租 e à diferença entre 买 e 卖.',
  'Criar cinco frases com duas ações na ordem movimento ou transporte + lugar + finalidade.',
  'Treinar números de telefone inventados, lendo cada algarismo separadamente e usando yāo para 1.',
  'Fazer exercícios de reorganização de palavras e observar se destino, meio e finalidade ficaram na ordem chinesa.',
  'Praticar simulados curtos de HSK e anotar quais assuntos ainda precisam de revisão.',
];
