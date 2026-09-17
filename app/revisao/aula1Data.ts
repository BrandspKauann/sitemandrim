export type LessonPhrase = {
  id: string;
  hanzi: string;
  translation: string;
  note?: string;
};

export type LessonTopic = {
  marker: string;
  title: string;
  summary: string;
  points: string[];
  examples: LessonPhrase[];
};

export type VocabularyGroup = {
  title: string;
  description: string;
  words: Array<{ hanzi: string; translation: string; note?: string }>;
};

export const KEY_PHRASES: LessonPhrase[] = [
  { id: 'children-question', hanzi: '你有多少个孩子？', translation: 'Quantos filhos você tem?', note: 'Dois terceiros tons juntos: 你有 costuma soar ní yǒu na fala.' },
  { id: 'two-children', hanzi: '我有两个孩子。', translation: 'Eu tenho dois filhos.' },
  { id: 'yifei-busy', hanzi: '一飞忙吗？', translation: 'Yifei está ocupado?' },
  { id: 'very-busy', hanzi: '他很忙。', translation: 'Ele está muito ocupado.' },
  { id: 'students-question', hanzi: '他有多少个学生？', translation: 'Quantos alunos ele tem?' },
  { id: 'twenty-students', hanzi: '他有二十个学生。', translation: 'Ele tem vinte alunos.' },
  { id: 'one-friend', hanzi: '我有一个朋友。', translation: 'Eu tenho um amigo.' },
  { id: 'no-friend', hanzi: '我没有一个朋友。', translation: 'Eu não tenho um amigo.' },
  { id: 'pen-positive', hanzi: '你有一支笔。', translation: 'Você tem uma caneta.' },
  { id: 'pen-negative', hanzi: '你没有一支笔。', translation: 'Você não tem uma caneta.' },
  { id: 'older-brother-question', hanzi: '你有几个哥哥？', translation: 'Quantos irmãos mais velhos você tem?' },
  { id: 'two-brothers', hanzi: '我有两个哥哥。', translation: 'Eu tenho dois irmãos mais velhos.' },
  { id: 'father-question', hanzi: '这是你爸爸吗？', translation: 'Este é o seu pai?' },
  { id: 'not-father', hanzi: '他不是我爸爸。', translation: 'Ele não é o meu pai.' },
  { id: 'brother-where', hanzi: '你哥哥呢？我哥哥在那儿。', translation: 'E o seu irmão mais velho? Meu irmão está ali.' },
  { id: 'father-where', hanzi: '你爸爸呢？我爸爸在学校。', translation: 'E o seu pai? Meu pai está na escola.' },
  { id: 'mother-where', hanzi: '你妈妈呢？我妈妈在家。', translation: 'E a sua mãe? Minha mãe está em casa.' },
  { id: 'family-count', hanzi: '你家有几口人？', translation: 'Quantas pessoas há na sua família?' },
  { id: 'four-family', hanzi: '我家有四口人：爸爸、妈妈、妹妹和我。', translation: 'Minha família tem quatro pessoas: pai, mãe, irmã mais nova e eu.' },
  { id: 'have-brother', hanzi: '你有没有哥哥？', translation: 'Você tem irmão mais velho ou não?' },
  { id: 'sister-answer', hanzi: '我没有哥哥，我有妹妹。', translation: 'Eu não tenho irmão mais velho; tenho uma irmã mais nova.' },
  { id: 'and-you', hanzi: '我有两个哥哥。你呢？', translation: 'Eu tenho dois irmãos mais velhos. E você?' },
  { id: 'nationality', hanzi: '你是哪国人？我是美国人。你呢？', translation: 'De que país você é? Sou americano. E você?' },
  { id: 'name', hanzi: '你好，你叫什么名字？我叫高安。', translation: 'Olá, como você se chama? Eu me chamo Gao An.' },
  { id: 'teacher-student', hanzi: '我是老师。你呢？我是学生。', translation: 'Eu sou professora. E você? Eu sou aluno.' },
];

export const LESSON_TOPICS: LessonTopic[] = [
  {
    marker: '有',
    title: 'Ter e não ter',
    summary: '有 afirma posse ou existência. A negação é 没有; não se usa 不有.',
    points: [
      'Estrutura: sujeito + 有/没有 + quantidade + classificador + substantivo.',
      'Em uma resposta curta, 有 significa “tenho/tem” e 没有 ou 没 significa “não tenho/não tem”.',
      'Para transformar a afirmação em negativa, troque 有 por 没有 e mantenha o restante da frase.',
    ],
    examples: [
      { id: 'topic-have-1', hanzi: '他有一个姐姐。', translation: 'Ele tem uma irmã mais velha.' },
      { id: 'topic-have-2', hanzi: '我没有姐姐。', translation: 'Eu não tenho irmã mais velha.' },
      { id: 'topic-have-3', hanzi: '你有没有哥哥？', translation: 'Você tem irmão mais velho ou não?' },
    ],
  },
  {
    marker: '几',
    title: 'Perguntar quantidade',
    summary: '几 e 多少 perguntam “quantos”. A resposta traz um número e, normalmente, um classificador.',
    points: [
      '几 costuma aparecer quando se espera uma quantidade pequena ou limitada: 几个人, 几个哥哥.',
      '多少 é mais geral: 多少个学生, 多少个孩子.',
      'Se a pergunta contém 几 ou 多少, procure um número na resposta.',
    ],
    examples: [
      { id: 'topic-count-1', hanzi: '你有几个哥哥？', translation: 'Quantos irmãos mais velhos você tem?' },
      { id: 'topic-count-2', hanzi: '他有多少个学生？', translation: 'Quantos alunos ele tem?' },
      { id: 'topic-count-3', hanzi: '我家有三口人。', translation: 'Minha família tem três pessoas.' },
    ],
  },
  {
    marker: '个',
    title: 'Números e classificadores',
    summary: 'Em mandarim, o número não vai direto antes do substantivo: entre eles aparece um classificador.',
    points: [
      'Modelo: número + classificador + substantivo, como 两个苹果.',
      '个 é geral; 口 conta pessoas da família; 本 conta livros; 支 conta canetas; 根 conta objetos longos; 瓶 e 杯 contam recipientes.',
      '两个人 serve para duas pessoas em geral. 两口人 destaca duas pessoas da mesma família.',
    ],
    examples: [
      { id: 'topic-measure-1', hanzi: '两个苹果', translation: 'duas maçãs' },
      { id: 'topic-measure-2', hanzi: '五个朋友', translation: 'cinco amigos' },
      { id: 'topic-measure-3', hanzi: '一根香蕉', translation: 'uma banana' },
      { id: 'topic-measure-4', hanzi: '两本书', translation: 'dois livros' },
    ],
  },
  {
    marker: '二',
    title: '二 e 两',
    summary: 'Os dois significam “dois”, mas aparecem em posições diferentes.',
    points: [
      'Use 二 em números, contas, ordinais e sequências: 十二, 二十二, 第二.',
      'Use 两 antes de classificadores: 两个人, 两本书, 两瓶水.',
      'Na fala, valores como “dois yuan” normalmente usam 两元 ou 两块钱.',
    ],
    examples: [
      { id: 'topic-two-1', hanzi: '十二', translation: 'doze' },
      { id: 'topic-two-2', hanzi: '第二个', translation: 'o segundo' },
      { id: 'topic-two-3', hanzi: '两个人', translation: 'duas pessoas' },
      { id: 'topic-two-4', hanzi: '两瓶水', translation: 'duas garrafas de água' },
    ],
  },
  {
    marker: '吗',
    title: 'Perguntas com 吗 e 呢',
    summary: '吗 transforma uma afirmação em pergunta de sim ou não. 呢 retoma um assunto ou pergunta onde algo/alguém está.',
    points: [
      '吗 fica no final: 你吃饭了吗？ e 这是你妈妈吗？',
      '呢 pode significar “e...?” ou “onde está...?”: 你呢？书呢？你爸爸呢？',
      'Não use 你呢？ de forma automática depois de uma situação negativa; confirme se faz sentido perguntar o mesmo à outra pessoa.',
    ],
    examples: [
      { id: 'topic-question-1', hanzi: '这是你的家吗？', translation: 'Esta é a sua casa?' },
      { id: 'topic-question-2', hanzi: '你呢？', translation: 'E você?' },
      { id: 'topic-question-3', hanzi: '我的书呢？', translation: 'Onde está o meu livro?' },
    ],
  },
  {
    marker: '和',
    title: 'Ligar pessoas e coisas',
    summary: '和 liga substantivos ou pronomes com o sentido de “e”.',
    points: [
      'Use 和 entre duas pessoas ou coisas: 我和妈妈, 老师和学生.',
      'Na lista da família: 爸爸、妈妈、妹妹和我.',
      'Pratique trocando as palavras, sem mudar a estrutura.',
    ],
    examples: [
      { id: 'topic-and-1', hanzi: '我和妈妈', translation: 'eu e minha mãe' },
      { id: 'topic-and-2', hanzi: '老师和学生', translation: 'professora e aluno' },
      { id: 'topic-and-3', hanzi: '哥哥和妹妹', translation: 'irmão mais velho e irmã mais nova' },
    ],
  },
];

export const VOCABULARY_GROUPS: VocabularyGroup[] = [
  {
    title: 'Pessoas e família',
    description: 'Os segundos caracteres repetidos costumam ser pronunciados em tom neutro.',
    words: [
      { hanzi: '你', translation: 'você' }, { hanzi: '我', translation: 'eu' }, { hanzi: '他', translation: 'ele' }, { hanzi: '她', translation: 'ela' },
      { hanzi: '爸爸', translation: 'pai' }, { hanzi: '妈妈', translation: 'mãe' }, { hanzi: '哥哥', translation: 'irmão mais velho' },
      { hanzi: '姐姐', translation: 'irmã mais velha' }, { hanzi: '弟弟', translation: 'irmão mais novo' }, { hanzi: '妹妹', translation: 'irmã mais nova' },
      { hanzi: '儿子', translation: 'filho' }, { hanzi: '女儿', translation: 'filha' }, { hanzi: '孩子', translation: 'filho / criança' },
      { hanzi: '爷爷', translation: 'avô paterno' }, { hanzi: '奶奶', translation: 'avó paterna' },
      { hanzi: '外公 / 姥爷', translation: 'avô materno' }, { hanzi: '外婆 / 姥姥', translation: 'avó materna' },
      { hanzi: '叔叔', translation: 'tio paterno' }, { hanzi: '姑姑', translation: 'tia paterna' }, { hanzi: '姨妈 / 阿姨', translation: 'tia materna / tia' },
    ],
  },
  {
    title: 'Quantidade e classificadores',
    description: 'O número vem antes do classificador; o objeto ou a pessoa vem depois.',
    words: [
      { hanzi: '有', translation: 'ter / haver' }, { hanzi: '没有', translation: 'não ter / não haver' },
      { hanzi: '多少', translation: 'quanto(s)' }, { hanzi: '几', translation: 'quantos' },
      { hanzi: '个', translation: 'classificador geral' }, { hanzi: '口', translation: 'pessoas da família' },
      { hanzi: '本', translation: 'livros' }, { hanzi: '支', translation: 'canetas' }, { hanzi: '根', translation: 'objetos longos' },
      { hanzi: '瓶', translation: 'garrafas' }, { hanzi: '杯', translation: 'copos / xícaras' },
      { hanzi: '学生', translation: 'aluno' }, { hanzi: '朋友', translation: 'amigo' },
    ],
  },
  {
    title: 'Perguntas e frases da aula',
    description: 'Palavras que organizam as perguntas e as respostas praticadas.',
    words: [
      { hanzi: '吗', translation: 'partícula de pergunta sim/não' }, { hanzi: '呢', translation: 'e...? / onde está...?' },
      { hanzi: '和', translation: 'e' }, { hanzi: '很', translation: 'muito' }, { hanzi: '忙', translation: 'ocupado' },
      { hanzi: '家', translation: 'lar / família', note: '房子 é a construção; 家 também representa o lar e a família.' },
      { hanzi: '学校', translation: 'escola' }, { hanzi: '那儿', translation: 'ali' }, { hanzi: '名字', translation: 'nome' },
      { hanzi: '老师', translation: 'professora' }, { hanzi: '中国人', translation: 'chinês / pessoa chinesa' },
    ],
  },
];

export const HANZI_CORRECTIONS = [
  { hanzi: '他', title: 'O “他” de 他们', detail: 'Observe o radical de pessoa 亻 à esquerda e não confunda a estrutura com outro componente.' },
  { hanzi: '们', title: 'O “们” de 他们', detail: 'Também começa com o radical de pessoa 亻. Ele não pode ser omitido.' },
  { hanzi: '有', title: 'Não acrescente um traço', detail: 'A professora indicou que havia uma linha horizontal a mais. Compare sempre com o modelo.' },
  { hanzi: '可', title: 'Deixe o traço sair', detail: 'No 可 de 可以, o traço horizontal precisa ultrapassar o componente vertical.' },
  { hanzi: '门', title: 'Feche com gancho', detail: 'O contorno usa 横折钩: a dobra termina com um pequeno gancho.' },
  { hanzi: '口', title: 'Mantenha quase quadrado', detail: 'Não deixe o caractere achatado ou comprido; isso pode fazê-lo parecer outro caractere.' },
  { hanzi: '妹', title: '女 como radical', detail: 'À esquerda, 女 fica mais estreito e o último traço não atravessa como quando é escrito sozinho.' },
  { hanzi: '河', title: 'Junte os componentes', detail: 'Na estrutura esquerda–direita, não deixe um espaço grande entre 氵 e 可.' },
  { hanzi: '今', title: 'Atenção ao topo', detail: 'No 今 de 今年, o traço superior precisa aparecer um pouco para fora.' },
  { hanzi: '岁', title: '山 mais alto', detail: 'Em cima está 山; a linha vertical central deve ser um pouco mais alta. Embaixo está 夕.' },
];

export const NUMBER_ROWS = [
  { hanzi: '零、一、二、三、四、五、六、七、八、九、十', translation: '0 a 10' },
  { hanzi: '二十、三十、四十、五十、六十、七十、八十、九十', translation: '20 a 90' },
  { hanzi: '十一、二十二、二十六、三十七、四十六、六十四、七十三、八十二、九十一', translation: 'combinações praticadas' },
  { hanzi: '百、千、万、十万、百万、千万、亿', translation: 'cem, mil, dez mil, cem mil, milhão, dez milhões, cem milhões' },
  { hanzi: '二百零八、九百九十九、一千、一万', translation: '208, 999, 1.000, 10.000' },
];

export const PINYIN_NOTES = [
  { title: 'Escreva em minúsculas', detail: 'A professora pediu para reescrever a parte de pinyin usando letras minúsculas, o que facilita a leitura e a correção.' },
  { title: '苹果', detail: 'A sílaba píng leva o 2º tom: píngguǒ.' },
  { title: '工作', detail: 'A leitura é gōngzuò; zuò leva o 4º tom.' },
  { title: '2º x 4º tom', detail: 'O 2º tom sobe; o 4º tom cai. Essa foi a principal diferença de tons a praticar.' },
  { title: 'Dois terceiros tons', detail: 'Em 你有, o primeiro 3º tom muda na fala e costuma soar como 2º: ní yǒu.' },
  { title: 'Tom neutro na família', detail: 'Na repetição de caracteres, a segunda sílaba costuma ficar leve: gēge, bàba, māma, mèimei, yéye.' },
];

export const WRITING_EXERCISES = [
  { prompt: 'Eu tenho dois filhos.', answer: '我有两个孩子', hint: 'Use a estrutura de posse com numeral e classificador.' },
  { prompt: 'Quantos alunos ele tem?', answer: '他有多少个学生', hint: 'É uma pergunta aberta de quantidade.' },
  { prompt: 'Ele tem vinte alunos.', answer: '他有二十个学生', hint: 'A quantidade fica entre o verbo e o substantivo.' },
  { prompt: 'Eu não tenho irmã mais velha.', answer: '我没有姐姐', hint: 'Lembre-se da forma negativa do verbo “ter”.' },
  { prompt: 'Você tem irmão mais velho ou não?', answer: '你有没有哥哥', hint: 'Use o padrão afirmativo–negativo para perguntar.' },
  { prompt: 'Quantas pessoas há na sua família?', answer: '你家有几口人', hint: 'Pessoas da mesma família usam um classificador próprio.' },
  { prompt: 'Minha família tem quatro pessoas.', answer: '我家有四口人', hint: 'Comece apresentando a sua família e depois informe a quantidade.' },
  { prompt: 'Este é o seu pai?', answer: '这是你爸爸吗', hint: 'Transforme uma afirmação em pergunta de sim ou não.' },
  { prompt: 'Ele não é o meu pai.', answer: '他不是我爸爸', hint: 'Negue o verbo “ser”.' },
  { prompt: 'E a sua mãe?', answer: '你妈妈呢', hint: 'Retome o assunto anterior com a partícula adequada.' },
  { prompt: 'Minha mãe está em casa.', answer: '我妈妈在家', hint: 'Use a estrutura pessoa + estar + lugar.' },
  { prompt: 'Eu tenho dois irmãos mais velhos. E você?', answer: '我有两个哥哥你呢', hint: 'Depois da afirmação, devolva a pergunta ao interlocutor.' },
];

export const LISTENING_EXERCISES = [
  { phraseId: 'children-question', choices: ['Quantos filhos você tem?', 'Quantos alunos você tem?', 'Onde estão seus filhos?'] },
  { phraseId: 'twenty-students', choices: ['Ele tem dois alunos.', 'Ele tem vinte alunos.', 'Ele não tem alunos.'] },
  { phraseId: 'pen-negative', choices: ['Você não tem uma caneta.', 'Você tem dois livros.', 'Esta caneta é sua?'] },
  { phraseId: 'older-brother-question', choices: ['Você tem irmão mais velho?', 'Quantos irmãos mais velhos você tem?', 'Onde está seu irmão mais velho?'] },
  { phraseId: 'father-question', choices: ['Este é o seu pai?', 'Onde está o seu pai?', 'O seu pai é professor?'] },
  { phraseId: 'mother-where', choices: ['Minha mãe está na escola.', 'E a sua mãe? Minha mãe está em casa.', 'Esta é a minha mãe.'] },
  { phraseId: 'family-count', choices: ['Quantas pessoas há na sua família?', 'Quem é da sua família?', 'Você mora com a família?'] },
  { phraseId: 'sister-answer', choices: ['Tenho um irmão mais velho.', 'Não tenho irmã mais nova.', 'Não tenho irmão mais velho; tenho uma irmã mais nova.'] },
  { phraseId: 'nationality', choices: ['Qual é o seu nome?', 'De que país você é? Sou americano. E você?', 'Você é professor?'] },
  { phraseId: 'teacher-student', choices: ['Eu sou professora. E você? Eu sou aluno.', 'Eu sou chinês. E você?', 'Ela é minha professora.'] },
];

export const HOMEWORK = [
  'Reescrever o pinyin em letras minúsculas e revisar especialmente o 2º e o 4º tom.',
  'Praticar diariamente as frases e os diálogos em voz alta, primeiro devagar e depois em ritmo natural.',
  'Preparar duas ou três frases em chinês antes da próxima aula: apresentação, saudação ou algo que aconteceu no dia.',
  'Treinar 有/没有, 吗/呢, 几/多少 e número + classificador + substantivo trocando as palavras dos exemplos.',
  'Repetir a escrita dos caracteres corrigidos sem depender do pinyin ou de um tradutor.',
];
