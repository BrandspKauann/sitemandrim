import type { LessonPhrase, LessonTopic, VocabularyGroup } from './aula1Data';

export const AULA2_KEY_PHRASES: LessonPhrase[] = [
  { id: 'a2-date-question', hanzi: '今天是几月几号？', spokenPinyin: 'jīntiān shì | jǐ yuè jǐ hào?', translation: 'Que dia é hoje?' },
  { id: 'a2-date-answer', hanzi: '今天是九月十九号。', spokenPinyin: 'jīntiān shì | jiǔ yuè shíjiǔ hào.', translation: 'Hoje é 19 de setembro.' },
  { id: 'a2-weekday-question', hanzi: '今天星期几？', spokenPinyin: 'jīntiān | xīngqī jǐ?', translation: 'Que dia da semana é hoje?' },
  { id: 'a2-weekday-answer', hanzi: '今天星期四。', spokenPinyin: 'jīntiān | xīngqīsì.', translation: 'Hoje é quinta-feira.' },
  { id: 'a2-time-sequence', hanzi: '昨天、今天、明天、后天。', spokenPinyin: 'zuótiān, jīntiān, míngtiān, hòutiān.', translation: 'Ontem, hoje, amanhã e depois de amanhã.' },
  { id: 'a2-full-date-time', hanzi: '巴西现在的时间是二〇二六年九月十九日上午九点二十一分。', spokenPinyin: 'Bāxī xiànzài de shíjiān shì | èr líng èr liù nián | jiǔ yuè shíjiǔ rì | shàngwǔ jiǔ diǎn èrshíyī fēn.', translation: 'No Brasil, agora são 9h21 da manhã de 19 de setembro de 2026.', note: 'Em chinês, a data vai do maior para o menor: ano, mês, dia, período, hora e minuto.' },
  { id: 'a2-birthday-question', hanzi: '你的生日是几月几日？', spokenPinyin: 'nǐ de shēngrì shì | jǐ yuè jǐ rì?', translation: 'Qual é a data do seu aniversário?' },
  { id: 'a2-birthday-answer', hanzi: '我的生日是一月七日。', spokenPinyin: 'wǒ de shēngrì shì | yī yuè qī rì.', translation: 'Meu aniversário é em 7 de janeiro.' },
  { id: 'a2-rest-when', hanzi: '你什么时候休息？', spokenPinyin: 'nǐ shénme shíhou xiūxi?', translation: 'Quando você descansa?' },
  { id: 'a2-rest-weekly', hanzi: '我每周星期天休息。', spokenPinyin: 'wǒ měizhōu | xīngqītiān xiūxi.', translation: 'Eu descanso todo domingo.' },
  { id: 'a2-eat-together', hanzi: '我们星期天一起吃饭吧。', spokenPinyin: 'wǒmen xīngqītiān | yìqǐ chīfàn ba.', translation: 'Vamos comer juntos no domingo.' },
  { id: 'a2-rest-today', hanzi: '今天我休息。', spokenPinyin: 'jīntiān | wǒ xiūxi.', translation: 'Hoje eu descanso.' },
  { id: 'a2-can-cook', hanzi: '你会做饭吗？', spokenPinyin: 'nǐ huì zuòfàn ma?', translation: 'Você sabe cozinhar?' },
  { id: 'a2-cannot-sing', hanzi: '我不会唱歌。', spokenPinyin: 'wǒ bú huì chànggē.', translation: 'Eu não sei cantar.' },
  { id: 'a2-can-do-what', hanzi: '你会做什么？', spokenPinyin: 'nǐ huì zuò shénme?', translation: 'O que você sabe fazer?' },
  { id: 'a2-can-noodles', hanzi: '我会做面条儿。', spokenPinyin: 'wǒ huì zuò miàntiáor.', translation: 'Eu sei fazer macarrão.' },
  { id: 'a2-can-two-foods', hanzi: '我会做面条，也会做饺子。', spokenPinyin: 'wǒ huì zuò miàntiáo, | yě huì zuò jiǎozi.', translation: 'Eu sei fazer macarrão e também sei fazer jiaozi.' },
  { id: 'a2-also-dishes', hanzi: '我也会做一些菜。', spokenPinyin: 'wó yě | huì zuò | yìxiē cài.', translation: 'Eu também sei fazer alguns pratos.', note: 'Na fala: 我也 forma um bloco 3º + 3º e soa wó yě; 一些 soa yìxiē.' },
  { id: 'a2-making-question', hanzi: '你在做什么呢？', spokenPinyin: 'nǐ zài zuò shénme ne?', translation: 'O que você está fazendo?' },
  { id: 'a2-wrapping-dumplings', hanzi: '我在包饺子。', spokenPinyin: 'wǒ zài bāo jiǎozi.', translation: 'Estou preparando jiaozi.' },
  { id: 'a2-eat-what', hanzi: '我们今天吃什么？', spokenPinyin: 'wǒmen jīntiān chī shénme?', translation: 'O que vamos comer hoje?' },
  { id: 'a2-eat-noodles', hanzi: '吃面条吧。', spokenPinyin: 'chī miàntiáo ba.', translation: 'Vamos comer macarrão.' },
  { id: 'a2-buy-what', hanzi: '你买什么？', spokenPinyin: 'ní mǎi | shénme?', translation: 'O que você vai comprar?', note: 'Na fala natural, 你买 forma um bloco 3º + 3º e soa ní mǎi.' },
  { id: 'a2-buy-vegetables', hanzi: '我买一些蔬菜。', spokenPinyin: 'wó mǎi | yìxiē shūcài.', translation: 'Vou comprar alguns vegetais.' },
  { id: 'a2-finish-work-question', hanzi: '你几点下班？', spokenPinyin: 'nǐ | jí diǎn | xiàbān?', translation: 'A que horas você sai do trabalho?' },
  { id: 'a2-finish-work-answer', hanzi: '我五点下班。', spokenPinyin: 'wǒ | wú diǎn | xiàbān.', translation: 'Eu saio do trabalho às cinco.' },
  { id: 'a2-new-computer-question', hanzi: '这是你的新电脑吗？', spokenPinyin: 'zhè shì | nǐ de | xīn diànnǎo ma?', translation: 'Este é o seu computador novo?' },
  { id: 'a2-new-computer-answer', hanzi: '是的，是我的新电脑。', spokenPinyin: 'shì de, | shì wǒ de | xīn diànnǎo.', translation: 'Sim, é o meu computador novo.' },
  { id: 'a2-really-pretty', hanzi: '真好看！', spokenPinyin: 'zhēn hǎokàn!', translation: 'É muito bonito!' },
  { id: 'a2-like-it', hanzi: '我也很喜欢它。', spokenPinyin: 'wó yě | hén xǐhuan tā.', translation: 'Eu também gosto muito dele.', note: '它 retoma um objeto. Na sequência natural, 我也 e 很喜欢 formam blocos com dois terceiros tons.' },
  { id: 'a2-speak-chinese-question', hanzi: '你会说汉语吗？', spokenPinyin: 'nǐ huì shuō Hànyǔ ma?', translation: 'Você sabe falar chinês?' },
  { id: 'a2-write-hanzi-question', hanzi: '你会写汉字吗？', spokenPinyin: 'nǐ huì xiě Hànzì ma?', translation: 'Você sabe escrever caracteres chineses?' },
  { id: 'a2-read-not-write', hanzi: '这个字我会读，不会写。', spokenPinyin: 'zhège zì | wǒ huì dú, | bú huì xiě.', translation: 'Eu sei ler este caractere, mas não sei escrevê-lo.' },
  { id: 'a2-also-rest', hanzi: '今天我也休息。', spokenPinyin: 'jīntiān | wó yě | xiūxi.', translation: 'Hoje eu também descanso.' },
  { id: 'a2-phone-number', hanzi: '你的手机号是多少？', spokenPinyin: 'nǐ de shǒujī hào | shì duōshao?', translation: 'Qual é o número do seu celular?' },
  { id: 'a2-chinese-food-delicious', hanzi: '中国菜很好吃。', spokenPinyin: 'Zhōngguó cài | hén hǎochī.', translation: 'A comida chinesa é muito gostosa.' },
  { id: 'a2-cannot-chinese-food', hanzi: '我不会做中国菜。', spokenPinyin: 'wǒ bú huì zuò | Zhōngguó cài.', translation: 'Eu não sei fazer comida chinesa.' },
];

export const AULA2_LESSON_TOPICS: LessonTopic[] = [
  {
    marker: '日',
    title: 'Data e hora: do maior para o menor',
    summary: 'Em mandarim, a informação de tempo segue a ordem ano → mês → dia → período → hora → minuto.',
    points: [
      '年 indica ano, 月 indica mês e 日 ou 号 indicam o dia do mês.',
      '号 é mais comum na conversa; 日 aparece mais em registros formais e escritos.',
      '点 marca a hora e 分 marca os minutos: 上午九点二十一分.',
    ],
    examples: [AULA2_KEY_PHRASES[0], AULA2_KEY_PHRASES[1], AULA2_KEY_PHRASES[5]],
  },
  {
    marker: '期',
    title: 'Dias da semana e rotina',
    summary: '星期 + número forma os dias de segunda a sábado; domingo é 星期日 ou 星期天.',
    points: [
      '星期一 é segunda-feira e 星期六 é sábado.',
      'Pergunte o dia com 今天星期几？ e quando algo acontece com 什么时候.',
      '每周 significa “toda semana” e ajuda a descrever uma rotina.',
    ],
    examples: [AULA2_KEY_PHRASES[2], AULA2_KEY_PHRASES[8], AULA2_KEY_PHRASES[9]],
  },
  {
    marker: '会',
    title: '会 para habilidade aprendida',
    summary: '会 antes de um verbo indica saber ou conseguir fazer algo que foi aprendido.',
    points: [
      'Estrutura afirmativa: sujeito + 会 + verbo.',
      'A negação é 不会; diante do 4º tom de 会, 不 soa bú na fala.',
      'Para perguntar, mantenha 会 antes da ação e acrescente 吗 no final.',
    ],
    examples: [AULA2_KEY_PHRASES[12], AULA2_KEY_PHRASES[13], AULA2_KEY_PHRASES[30]],
  },
  {
    marker: '做',
    title: 'Ações com 做 e 在',
    summary: '做 aparece em várias atividades; 在 + verbo mostra uma ação acontecendo agora.',
    points: [
      '做饭 é cozinhar, 做运动 é fazer exercício e 做作业 é fazer a tarefa.',
      '你会做什么？ pergunta qual habilidade a pessoa tem.',
      '你在做什么呢？ pergunta o que a pessoa está fazendo neste momento.',
    ],
    examples: [AULA2_KEY_PHRASES[14], AULA2_KEY_PHRASES[18], AULA2_KEY_PHRASES[19]],
  },
  {
    marker: '些',
    title: '一些 e vocabulário de comida',
    summary: '一些 indica uma quantidade indefinida: “alguns”, “algumas” ou “um pouco de”.',
    points: [
      'Não existe um número mínimo obrigatório: o tamanho da quantidade depende do contexto.',
      'Use 一些 antes do substantivo: 一些菜, 一些书, 一些水果.',
      '面条儿 tem 儿化 na pronúncia; 饺子 e 菜 aparecem nas atividades de cozinhar e comer.',
    ],
    examples: [AULA2_KEY_PHRASES[15], AULA2_KEY_PHRASES[17], AULA2_KEY_PHRASES[23]],
  },
  {
    marker: '也',
    title: 'Organizar a frase com 也, 真 e perguntas',
    summary: 'A posição das palavras muda o sentido e a naturalidade da frase.',
    points: [
      '也 fica depois do sujeito e antes do verbo ou predicado: 今天我也休息.',
      '真 intensifica uma avaliação: 真好看, 真便宜, 真贵.',
      'Use 几 para quantidades pequenas e previstas; para um número de telefone, pergunte 多少.',
    ],
    examples: [AULA2_KEY_PHRASES[28], AULA2_KEY_PHRASES[33], AULA2_KEY_PHRASES[34]],
  },
];

export const AULA2_VOCABULARY_GROUPS: VocabularyGroup[] = [
  {
    title: 'Datas e tempo',
    description: 'Palavras para localizar um acontecimento no calendário e no relógio.',
    words: [
      { hanzi: '今天', translation: 'hoje' }, { hanzi: '昨天', translation: 'ontem' }, { hanzi: '明天', translation: 'amanhã' },
      { hanzi: '后天', translation: 'depois de amanhã' }, { hanzi: '年', translation: 'ano' }, { hanzi: '月', translation: 'mês' },
      { hanzi: '日', translation: 'dia formal' }, { hanzi: '号', translation: 'dia do mês' }, { hanzi: '星期', translation: 'semana / dia da semana' },
      { hanzi: '每周', translation: 'toda semana' }, { hanzi: '什么时候', translation: 'quando' }, { hanzi: '点', translation: 'hora' },
      { hanzi: '分', translation: 'minuto' }, { hanzi: '上午', translation: 'manhã' }, { hanzi: '下午', translation: 'tarde' },
      { hanzi: '生日', translation: 'aniversário' },
    ],
  },
  {
    title: 'Dias da semana',
    description: 'A sequência completa praticada durante a aula.',
    words: [
      { hanzi: '星期一', translation: 'segunda-feira' }, { hanzi: '星期二', translation: 'terça-feira' },
      { hanzi: '星期三', translation: 'quarta-feira' }, { hanzi: '星期四', translation: 'quinta-feira' },
      { hanzi: '星期五', translation: 'sexta-feira' }, { hanzi: '星期六', translation: 'sábado' },
      { hanzi: '星期日 / 星期天', translation: 'domingo' },
    ],
  },
  {
    title: 'Habilidades e rotina',
    description: 'Verbos usados para dizer o que você sabe fazer e como organiza o dia.',
    words: [
      { hanzi: '会', translation: 'saber fazer' }, { hanzi: '不会', translation: 'não saber fazer' }, { hanzi: '休息', translation: 'descansar' },
      { hanzi: '做饭', translation: 'cozinhar' }, { hanzi: '做运动', translation: 'fazer exercício' }, { hanzi: '做作业', translation: 'fazer a tarefa' },
      { hanzi: '唱歌', translation: 'cantar' }, { hanzi: '跳舞', translation: 'dançar' }, { hanzi: '游泳', translation: 'nadar' },
      { hanzi: '说', translation: 'falar' }, { hanzi: '写', translation: 'escrever' }, { hanzi: '读', translation: 'ler' },
      { hanzi: '上班', translation: 'começar / estar no trabalho' }, { hanzi: '下班', translation: 'sair do trabalho' },
    ],
  },
  {
    title: 'Comida e quantidade',
    description: 'Vocabulário usado nos diálogos sobre cozinhar, comprar e comer.',
    words: [
      { hanzi: '面条儿', translation: 'macarrão', note: 'A pronúncia tem 儿化: miàntiáor.' },
      { hanzi: '饺子', translation: 'jiaozi' }, { hanzi: '菜', translation: 'prato / verdura' }, { hanzi: '蔬菜', translation: 'vegetais' },
      { hanzi: '青菜', translation: 'verduras' }, { hanzi: '中国菜', translation: 'comida chinesa' }, { hanzi: '一些', translation: 'alguns / um pouco' },
      { hanzi: '买菜', translation: 'comprar comida' }, { hanzi: '炒菜', translation: 'refogar / cozinhar' },
      { hanzi: '包饺子', translation: 'preparar jiaozi' }, { hanzi: '吃饭', translation: 'comer / fazer uma refeição' },
    ],
  },
  {
    title: 'Objetos e descrições',
    description: 'Palavras do diálogo sobre um computador novo.',
    words: [
      { hanzi: '电脑', translation: 'computador' }, { hanzi: '笔记本电脑', translation: 'notebook' }, { hanzi: '台式电脑', translation: 'computador de mesa' },
      { hanzi: '新', translation: 'novo' }, { hanzi: '真', translation: 'realmente / muito' }, { hanzi: '好看', translation: 'bonito' },
      { hanzi: '喜欢', translation: 'gostar' }, { hanzi: '他', translation: 'ele' }, { hanzi: '她', translation: 'ela' }, { hanzi: '它', translation: 'ele / ela para objeto ou animal' },
    ],
  },
];

export const AULA2_HANZI_CORRECTIONS = [
  { hanzi: '今天', title: 'Hoje', detail: 'Em 今, observe o encontro dos traços no topo. 天 termina com os traços 撇 e 捺 bem abertos.' },
  { hanzi: '号', title: 'Dia do mês', detail: 'Mantenha 口 compacto e faça o último traço com a dobra e o gancho corretos.' },
  { hanzi: '月', title: 'Mês', detail: 'O contorno é estreito e os dois traços internos não devem ultrapassá-lo.' },
  { hanzi: '日', title: 'Dia', detail: 'Escreva como um retângulo vertical, com o traço interno encostando nos dois lados.' },
  { hanzi: '期', title: 'Estrutura esquerda–direita', detail: 'Em 星期, aproxime 其 e 月; não deixe um grande espaço entre os componentes.' },
  { hanzi: '会', title: 'Saber fazer', detail: 'A estrutura é superior–inferior: escreva primeiro a parte de cima e depois 云.' },
  { hanzi: '做', title: 'Fazer', detail: 'Distribua 亻, 古 e 攵 no mesmo quadrado, sem separar demais os três componentes.' },
  { hanzi: '菜', title: 'Prato / verdura', detail: '艹 fica em cima; mantenha a parte inferior centralizada.' },
  { hanzi: '新', title: 'Novo', detail: 'O caractere correto é 新, com 斤 à direita; não confunda com 心.' },
  { hanzi: '真', title: 'Realmente', detail: 'O intensificador é 真; não confunda com 针, que significa “agulha”.' },
  { hanzi: '它', title: 'Pronome para objeto ou animal', detail: 'Ele tem 宀 no topo. Compare com 他, de pessoa masculina, e 她, de pessoa feminina.' },
];

export const AULA2_NUMBER_ROWS = [
  { hanzi: '一月、二月、三月、四月、五月、六月', translation: 'janeiro a junho' },
  { hanzi: '七月、八月、九月、十月、十一月、十二月', translation: 'julho a dezembro' },
  { hanzi: '星期一、星期二、星期三、星期四、星期五、星期六', translation: 'segunda-feira a sábado' },
  { hanzi: '星期日 / 星期天', translation: 'domingo: as duas formas estão corretas' },
  { hanzi: '二〇二六年九月十九日', translation: '19 de setembro de 2026 — forma escrita' },
  { hanzi: '二〇二六年九月十九号', translation: '19 de setembro de 2026 — forma mais coloquial' },
  { hanzi: '上午九点二十一分', translation: '9h21 da manhã' },
  { hanzi: '五月一号，星期四', translation: '1º de maio, quinta-feira' },
];

export const AULA2_PINYIN_NOTES = [
  { title: '月 — yuè', detail: '月 leva 4º tom, com queda firme. Em 八月, 八 é bā no 1º tom e 月 é yuè no 4º.' },
  { title: '面条儿 — miàntiáor', detail: '面 leva 4º tom, 条 leva 2º e o 儿 final se junta à sílaba anterior na pronúncia.' },
  { title: '休息 — xiūxi', detail: 'A segunda sílaba fica leve: xiūxi, com xi em tom neutro.' },
  { title: '喜欢 — xǐhuan', detail: '欢 costuma ficar em tom neutro na palavra cotidiana xǐhuan.' },
  { title: '饺子 — jiǎozi', detail: '子 fica em tom neutro: jiǎozi.' },
  { title: '不 + 会', detail: 'Antes do 4º tom de 会, 不 muda de bù para bú na fala: bú huì.' },
  { title: '一 + 些', detail: 'Antes do 1º tom de 些, 一 soa no 4º tom: yìxiē.' },
  { title: 'Blocos de 3º tom', detail: 'Em 我也, 你买 e 很好, o primeiro 3º tom do bloco soa como 2º: wó yě, ní mǎi, hén hǎo.' },
];

export const AULA2_WRITING_EXERCISES = [
  { prompt: 'Que dia é hoje?', answer: '今天是几月几号', hint: 'Monte a pergunta seguindo a ordem mês → dia.' },
  { prompt: 'Hoje é 19 de setembro.', answer: '今天是九月十九号', hint: 'Informe primeiro o mês e depois o dia.' },
  { prompt: 'Que dia da semana é hoje?', answer: '今天星期几', hint: 'Use a forma de perguntar por um elemento de uma sequência curta.' },
  { prompt: 'Qual é a data do seu aniversário?', answer: '你的生日是几月几日', hint: 'Pergunte mês e dia na mesma frase.' },
  { prompt: 'Quando você descansa?', answer: '你什么时候休息', hint: 'Use a palavra interrogativa que pede um momento.' },
  { prompt: 'Eu descanso todo domingo.', answer: '我每周星期天休息', hint: 'Indique primeiro a frequência e o dia da semana.' },
  { prompt: 'Você sabe cozinhar?', answer: '你会做饭吗', hint: 'Pergunte sobre uma habilidade aprendida.' },
  { prompt: 'Eu não sei cantar.', answer: '我不会唱歌', hint: 'Negue a habilidade antes da ação.' },
  { prompt: 'O que você está fazendo?', answer: '你在做什么呢', hint: 'Marque uma ação em andamento e termine com a partícula de continuidade.' },
  { prompt: 'Vou comprar alguns vegetais.', answer: '我买一些蔬菜', hint: 'A quantidade indefinida vem antes do substantivo.' },
  { prompt: 'Hoje eu também descanso.', answer: '今天我也休息', hint: 'O advérbio de inclusão fica depois do sujeito e antes da ação.' },
  { prompt: 'Qual é o número do seu celular?', answer: '你的手机号是多少', hint: 'Para um número longo ou desconhecido, use a pergunta geral de quantidade.' },
];

export const AULA2_LISTENING_EXERCISES = [
  { phraseId: 'a2-date-question', choices: ['Que dia é hoje?', 'Que horas são?', 'Em que ano estamos?'] },
  { phraseId: 'a2-weekday-question', choices: ['Que dia da semana é hoje?', 'Quando você descansa?', 'Qual é o seu aniversário?'] },
  { phraseId: 'a2-rest-weekly', choices: ['Eu descanso todo domingo.', 'Eu trabalho todo sábado.', 'Hoje eu não descanso.'] },
  { phraseId: 'a2-can-cook', choices: ['Você sabe cozinhar?', 'Você quer comer?', 'Você está fazendo a tarefa?'] },
  { phraseId: 'a2-can-two-foods', choices: ['Eu gosto de macarrão e arroz.', 'Eu sei fazer macarrão e também jiaozi.', 'Eu não sei cozinhar.'] },
  { phraseId: 'a2-making-question', choices: ['O que você está fazendo?', 'O que você sabe fazer?', 'O que você vai comprar?'] },
  { phraseId: 'a2-buy-vegetables', choices: ['Vou comprar alguns vegetais.', 'Vou cozinhar alguns pratos.', 'Quero comer fruta.'] },
  { phraseId: 'a2-finish-work-question', choices: ['A que horas você sai do trabalho?', 'Em que dia você trabalha?', 'Onde fica o seu trabalho?'] },
  { phraseId: 'a2-new-computer-question', choices: ['Este é o seu computador novo?', 'Você gosta deste celular?', 'Onde está o notebook?'] },
  { phraseId: 'a2-read-not-write', choices: ['Eu sei escrever, mas não sei ler.', 'Eu sei ler este caractere, mas não sei escrevê-lo.', 'Como se pronuncia este caractere?'] },
  { phraseId: 'a2-phone-number', choices: ['Qual é o número do seu celular?', 'Quantas pessoas há na sua família?', 'Qual é o número do seu quarto?'] },
  { phraseId: 'a2-chinese-food-delicious', choices: ['A comida chinesa é muito gostosa.', 'Eu sei fazer comida chinesa.', 'A comida está muito cara.'] },
];

export const AULA2_HOMEWORK = [
  'Ler em voz alta os diálogos da aula todos os dias até responder sem depender do pinyin.',
  'Escrever os caracteres novos, com atenção especial a 期, 新, 真 e 它.',
  'Praticar perguntas e respostas com 会 e 不会 usando habilidades reais.',
  'Descrever três datas completas na ordem chinesa: ano, mês, dia e dia da semana.',
  'Escolher um tema simples — rotina, trabalho ou comida — e falar de duas a três frases por cerca de cinco minutos.',
  'Gravar 今天是几月几号？, 今天星期几？ e 你什么时候休息？ e comparar a pronúncia com o áudio.',
];
