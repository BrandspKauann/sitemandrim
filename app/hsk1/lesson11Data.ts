export type StudyItem = { id: string; hanzi: string; pinyin: string; meaning: string; speaker?: string };
export type StudyGroup = { id: string; name: string; label: string; description: string; items: StudyItem[] };
const items = (prefix: string, rows: Array<[string,string,string,string?]>): StudyItem[] => rows.map(([hanzi,pinyin,meaning,speaker],i) => ({id:`l11-${prefix}-${i+1}`,hanzi,pinyin,meaning,...(speaker ? {speaker} : {})}));
export const LESSON11_GROUPS: StudyGroup[] = [
  { id:'l11-vocabulary', name:'Vocabulário · 25 palavras', label:'生词 · shēngcí', description:'Todas as 25 entradas de vocabulário da lição, na ordem do livro. Português curto, com contexto quando necessário.', items:items('v',[
    ['时候','shíhou','momento'],['饭店','fàndiàn','restaurante'],['知道','zhīdào','saber'],['正在','zhèngzài','estar fazendo agora'],['找','zhǎo','procurar'],['开车','kāichē','dirigir'],['车','chē','veículo'],
    ['在','zài','ação em andamento'],['读','dú','cursar ou ler'],['大学','dàxué','universidade'],['大学生','dàxuéshēng','universitário'],['学','xué','estudar'],['医','yī','medicina'],
    ['弟弟','dìdi','irmão mais novo'],['起床','qǐchuáng','levantar da cama'],['睡觉','shuìjiào','dormir'],['睡','shuì','dormir: verbo curto'],['那里','nàlǐ','ali'],['哪里','nǎlǐ','onde'],['昨天','zuótiān','ontem'],['问','wèn','perguntar'],['对','duì','para: dirigido a alguém'],['说','shuō','falar'],['要','yào','querer ou pretender'],['小朋友','xiǎopéngyǒu','criança'],
  ])},
  { id:'l11-text1', name:'Diálogo 1 · A caminho', label:'课文一 · kèwén yī', description:'Wang Yifei liga para Li Wen enquanto ele procura o restaurante. Livro: página 79.', items:items('d1',[
    ['喂，李文，你什么时候能到饭店？','wèi, Lǐ Wén, nǐ shénme shíhou néng dào fàndiàn?','Alô, Li Wen, quando você consegue chegar ao restaurante?','王一飞 · Wang Yifei'],
    ['还不知道，正在找呢。它是不是在超市后边？','hái bù zhīdào, zhèngzài zhǎo ne. tā shì bu shì zài chāoshì hòubian?','Ainda não sei, estou procurando. Ele fica atrás do supermercado?','李文 · Li Wen'],
    ['是的。你开车没开车？','shì de. nǐ kāichē méi kāichē?','Sim. Você está dirigindo ou não?','王一飞 · Wang Yifei'],
    ['我没开车，坐车呢。','wǒ méi kāichē, zuò chē ne.','Não estou dirigindo; estou indo de carro como passageiro.','李文 · Li Wen'],
  ])},
  { id:'l11-text2', name:'Diálogo 2 · Universidade', label:'课文二 · kèwén èr', description:'Depois de se encontrarem no restaurante, eles conversam sobre os estudos. Livro: página 81.', items:items('d2',[
    ['你还在读大学吗？','nǐ hái zài dú dàxué ma?','Você ainda está cursando a universidade?','王一飞 · Wang Yifei'],
    ['对，我读大学呢，还是大学生。','duì, wǒ dú dàxué ne, hái shì dàxuéshēng.','Sim, estou na universidade; ainda sou universitário.','李文 · Li Wen'],
    ['你们学习忙不忙？','nǐmen xuéxí máng bu máng?','Vocês estão ocupados com os estudos?','王一飞 · Wang Yifei'],
    ['非常忙，我学医，我们的课很多。','fēicháng máng, wǒ xué yī, wǒmen de kè hěn duō.','Muito ocupados. Eu estudo medicina e temos muitas aulas.','李文 · Li Wen'],
  ])},
  { id:'l11-text3', name:'Diálogo 3 · Planos de sábado', label:'课文三 · kèwén sān', description:'No sábado de manhã, Liu Ming conversa com a filha antes de sair para trabalhar. Livro: páginas 83–84.', items:items('d3',[
    ['弟弟起床没起床呢？','dìdi qǐchuáng méi qǐchuáng ne?','Seu irmão mais novo já levantou ou não?','刘明 · Liu Ming'],
    ['没起床呢，还在睡觉。','méi qǐchuáng ne, hái zài shuìjiào.','Ainda não levantou; ainda está dormindo.','刘小雪 · Liu Xiaoxue'],
    ['还睡呢？他今天去不去那里？','hái shuì ne? tā jīntiān qù bu qù nàlǐ?','Ainda está dormindo? Ele vai lá hoje ou não?','刘明 · Liu Ming'],
    ['去哪里？','qù nǎlǐ?','Ir aonde?','刘小雪 · Liu Xiaoxue'],
    ['去超市。','qù chāoshì.','Ao supermercado.','刘明 · Liu Ming'],
    ['我昨天问他，他对我说，他不去，他今天要和小朋友玩。','wǒ zuótiān wèn tā, tā duì wǒ shuō, tā bú qù, tā jīntiān yào hé xiǎopéngyǒu wán.','Perguntei a ele ontem. Ele me disse que não vai; hoje quer brincar com as outras crianças.','刘小雪 · Liu Xiaoxue'],
  ])},
  { id:'l11-patterns', name:'Estruturas · Ouvir e repetir', label:'练习 · liànxí', description:'Exemplos próprios para treinar os três pontos gramaticais e as diferenças entre eles.', items:items('p',[
    ['你去不去超市？','nǐ qù bu qù chāoshì?','Você vai ao supermercado ou não?'],['昨天你去没去书店？','zuótiān nǐ qù méi qù shūdiàn?','Você foi à livraria ontem ou não?'],['这件衣服贵不贵？','zhè jiàn yīfu guì bu guì?','Esta roupa é cara ou não?'],['我不知道。','wǒ bù zhīdào.','Eu não sei.'],
    ['你在做什么呢？','nǐ zài zuò shénme ne?','O que você está fazendo?'],['我正在看电视。','wǒ zhèngzài kàn diànshì.','Estou assistindo à televisão.'],['学生们正在上课呢。','xuéshengmen zhèngzài shàngkè ne.','Os alunos estão tendo aula.'],['我们读书呢。','wǒmen dúshū ne.','Estamos lendo.'],['我没在看电视。','wǒ méi zài kàn diànshì.','Não estou assistindo à televisão.'],
    ['妈妈要去超市。','māma yào qù chāoshì.','Minha mãe pretende ir ao supermercado.'],['我要在家里学中文。','wǒ yào zài jiāli xué Zhōngwén.','Pretendo estudar chinês em casa.'],['我不想去。','wǒ bù xiǎng qù.','Eu não quero ir.'],['我不要这本书。','wǒ bú yào zhè běn shū.','Eu não quero este livro.'],
    ['我们正在买东西。','wǒmen zhèngzài mǎi dōngxi.','Estamos fazendo compras.'],['桌子上有没有书？','zhuōzi shang yǒu méi yǒu shū?','Há livros sobre a mesa ou não?'],['弟弟没在睡觉，在学习呢。','dìdi méi zài shuìjiào, zài xuéxí ne.','Meu irmão não está dormindo; está estudando.'],
  ])},
];
export const LESSON11_GRAMMAR = [
  { title:'1. Perguntas afirmativa-negativa', text:'Verbo/adjetivo + 不 + verbo/adjetivo: 去不去、忙不忙、贵不贵. Para perguntar se uma ação aconteceu, o livro usa 没: 去没去、起床没起床. Não acrescente 吗 automaticamente a uma pergunta A-não-A.', tip:'Responda com a ação ou sua negação: 去 / 不去; 去了 / 没去. 有 usa 有没有, nunca 有不有. O 不 entre as duas formas costuma ficar leve: qù bu qù.', examples:['你去不去超市？','昨天你去没去书店？','这件衣服贵不贵？'] },
  { title:'2. Ação em andamento: 在 / 正在 / 呢', text:'Três modelos: 在/正在 + ação; 在/正在 + ação + 呢; ação + 呢. 正在 enfatiza que a ação está acontecendo. 在 também pode indicar continuidade de uma atividade, como cursar a universidade.', tip:'Compare 我在学校 (estou na escola: localização) com 我在学习 (estou estudando: ação). Para negar o andamento, use 没(有): 我没在看电视. Não diga 不正在.', examples:['我正在看电视。','学生们正在上课呢。','我们读书呢。'] },
  { title:'3. 要: desejo ou intenção', text:'Sujeito + 要 + ação indica o que alguém quer ou pretende fazer. Coloque tempo e lugar na ordem correta: 我今天要在家里学中文.', tip:'Não confunda 要 com 正在: um plano não é uma ação acontecendo agora. Para “não quero ir”, pratique 不想去. 不要 também pode recusar algo ou dar uma proibição; o contexto importa.', examples:['妈妈要去超市。','我要在家里学中文。','我不想去。'] },
];
export const LESSON11_QUIZ = [
  { q:'你去___超市？', options:['不去','没在','正在','要在'], correct:0, explanation:'去不去 é a pergunta A-não-A: vai ou não vai?' },
  { q:'昨天你去___书店？', options:['不在','没去','正在','要去'], correct:1, explanation:'Com 昨天 e uma ação realizada, 去没去 pergunta se foi ou não.' },
  { q:'这件衣服贵___贵？', options:['没','在','不','呢'], correct:2, explanation:'Adjetivo + 不 + adjetivo: 贵不贵.' },
  { q:'Qual pergunta usa o modelo A-não-A corretamente?', options:['你去不去吗？','你去不去超市？','你不正在去？','你有不有书？'], correct:1, explanation:'A pergunta 去不去 já expressa a alternativa; não precisa de 吗.' },
  { q:'我___看电视。 — Estou assistindo agora.', options:['昨天','没','不想','正在'], correct:3, explanation:'正在 vem antes da ação em andamento.' },
  { q:'学生们正在上课___。', options:['呢','不','没','要'], correct:0, explanation:'呢 pode finalizar a frase de ação em andamento.' },
  { q:'Qual significa “Não estou assistindo à televisão”?', options:['我不想看电视。','我没在看电视。','我要看电视。','我看电视呢。'], correct:1, explanation:'没在 nega o andamento. 不想 é não querer.' },
  { q:'Qual significa “Pretendo ir ao supermercado”?', options:['我在超市。','我正在买东西。','我要去超市。','我没去超市。'], correct:2, explanation:'要 + ação expressa intenção.' },
  { q:'Qual significa “Estou na escola”, sem indicar atividade?', options:['我在学校。','我在学习。','我要去学校。','我读书呢。'], correct:0, explanation:'在 + lugar indica localização; 在 + ação indica andamento.' },
  { q:'Você quer perguntar se há livros. Escolha:', options:['有不有书？','正在书？','有没有书？','要没要书？'], correct:2, explanation:'A negação de 有 é 没有, por isso 有没有.' },
  { q:'No diálogo 1, Li Wen está...', options:['dirigindo o próprio carro','procurando o restaurante','na universidade','dormindo'], correct:1, explanation:'Ele diz 正在找呢 e 我没开车，坐车呢.' },
  { q:'O restaurante fica...', options:['dentro da universidade','na frente da livraria','ao lado do hospital','atrás do supermercado'], correct:3, explanation:'它是不是在超市后边？ — 是的.' },
  { q:'No diálogo 2, Li Wen estuda...', options:['medicina','português','direito','engenharia'], correct:0, explanation:'我学医: estudo medicina.' },
  { q:'我们读书呢 significa...', options:['vamos comprar livros','estamos lendo','não lemos ontem','queremos escrever'], correct:1, explanation:'Ação + 呢 é um dos modelos de andamento.' },
  { q:'No diálogo 3, o irmão...', options:['já saiu para trabalhar','está no supermercado','ainda está dormindo','está dirigindo'], correct:2, explanation:'没起床呢，还在睡觉.' },
  { q:'O irmão pretende...', options:['brincar com outras crianças','estudar medicina','ir à livraria','procurar o restaurante'], correct:0, explanation:'他今天要和小朋友玩.' },
  { q:'那里 e 哪里 significam, respectivamente...', options:['onde e ali','aqui e ali','ali e onde','ontem e agora'], correct:2, explanation:'那 indica aquele lugar; 哪 pergunta onde.' },
  { q:'Qual é uma pergunta sobre quando chegar?', options:['你在哪里？','你什么时候能到饭店？','你要什么？','你学什么？'], correct:1, explanation:'什么时候 pergunta quando; 能到 indica conseguir chegar.' },
  { q:'Qual significa “Ainda não sei”?', options:['还不知道。','还在读书。','还是大学生。','还在睡觉。'], correct:0, explanation:'还不知道 = ainda não saber.' },
  { q:'Qual resposta diz “Não quero ir”?', options:['我没去。','我在去。','我不想去。','我去不去。'], correct:2, explanation:'不想 nega o desejo; 没去 indica que não foi.' },
];
export const LESSON11_WRITING = [
  ['Você vai ao supermercado ou não?','你去不去超市？','Pergunte usando a ação e sua negação.'],
  ['Você foi à livraria ontem ou não?','昨天你去没去书店？','Indique ontem e pergunte se a ação aconteceu.'],
  ['Esta roupa é cara ou não?','这件衣服贵不贵？','Use o classificador de roupas e o adjetivo repetido.'],
  ['Estou assistindo à televisão.','我正在看电视。','Coloque o marcador de andamento antes da ação.'],
  ['Estamos lendo.','我们读书呢。','Finalize com a partícula de andamento.'],
  ['Não estou assistindo à televisão.','我没在看电视。','Negue o andamento, não o desejo.'],
  ['Minha mãe pretende ir ao supermercado.','妈妈要去超市。','Indique intenção antes da ação.'],
  ['Pretendo estudar chinês em casa.','我要在家里学中文。','Intenção, lugar e ação nessa ordem.'],
  ['Eu não sei.','我不知道。','Negue saber, não uma compra realizada.'],
  ['Você ainda está cursando a universidade?','你还在读大学吗？','Diga ainda e use a pergunta de sim ou não.'],
  ['Ir aonde?','去哪里？','Não confunda onde com ali.'],
  ['Ele vai ao supermercado hoje ou não?','他今天去不去超市？','Sujeito, tempo e pergunta afirmativa-negativa.'],
] as const;
