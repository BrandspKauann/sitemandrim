import type { StudyItem, StudyGroup } from './lesson11Data';
const items = (prefix: string, rows: Array<[string,string,string,string?]>): StudyItem[] => rows.map(([hanzi,pinyin,meaning,speaker],i) => ({id:`l14-${prefix}-${i+1}`,hanzi,pinyin,meaning,...(speaker ? {speaker} : {})}));
export const LESSON14_GROUPS: StudyGroup[] = [
 {id:'l14-vocabulary',name:'Vocabulário · 26 entradas',label:'生词 · shēngcí',description:'26 entradas na ordem do livro, incluindo os dois usos de 上. 汉语 e 汉字 ficam no grupo seguinte.',items:items('v',[
 ['上','shàng','embarcar'],['火车','huǒchē','trem'],['中午','zhōngwǔ','meio-dia'],['开','kāi','partir: veículo'],['有些','yǒuxiē','alguns'],['有的','yǒude','alguns: dentre um grupo'],['了','le','ação realizada'],['写','xiě','escrever'],['都','dōu','todos ou ambos'],['听见','tīngjiàn','ouvir: perceber o som'],['不要','bú yào','não faça'],['说话','shuōhuà','falar'],['听','tīng','escutar'],['哪些','nǎxiē','quais'],['字','zì','caractere'],['明年','míngnián','ano que vem'],['上','shàng','começar a frequentar'],['中学','zhōngxué','escola secundária'],['小学','xiǎoxué','escola primária'],['中学生','zhōngxuéshēng','aluno da escola secundária'],['小学生','xiǎoxuéshēng','aluno da escola primária'],['上学','shàngxué','ir à escola'],['他们','tāmen','eles ou grupo misto'],['她们','tāmen','elas'],['它们','tāmen','eles: coisas ou animais'],['晚','wǎn','tarde: horário'],
 ])},
 {id:'l14-language',name:'Língua e escrita · 2 entradas',label:'汉语 · 汉字',description:'As duas entradas destacadas separadamente pelo livro na página 107.',items:items('language',[
 ['汉语','Hànyǔ','língua chinesa'],['汉字','Hànzì','caractere chinês'],
 ])},
 {id:'l14-text1',name:'Diálogo 1 · Na viagem de trem',label:'课文一 · kèwén yī',description:'Bai Jiayue e Chen Tianzhong conversam sobre uma viagem da escola. Página 104.',items:items('d1',[
 ['你们上火车后看见王老师了吗？','nǐmen shàng huǒchē hòu kànjiàn Wáng lǎoshī le ma?','Depois de embarcarem no trem, vocês viram a professora Wang?','白家月 · Bai Jiayue'],
 ['没看见。中午车开后，有些人在看书，有些人睡觉了。','méi kànjiàn. zhōngwǔ chē kāi hòu, yǒuxiē rén zài kàn shū, yǒuxiē rén shuìjiào le.','Não vimos. Depois que o trem partiu ao meio-dia, algumas pessoas estavam lendo e outras foram dormir.','陈天中 · Chen Tianzhong'],
 ['你呢？','nǐ ne?','E você?','白家月 · Bai Jiayue'],
 ['我看了一个电影。','wǒ kàn le yí ge diànyǐng.','Eu assisti a um filme.','陈天中 · Chen Tianzhong'],
 ])},
 {id:'l14-text2',name:'Diálogo 2 · Aprender a escrever',label:'课文二 · kèwén èr',description:'Wang Yifei pergunta aos alunos sobre sua aprendizagem. Páginas 106–107.',items:items('d2',[
 ['你们会说汉语了，也会写汉字了吗？','nǐmen huì shuō Hànyǔ le, yě huì xiě Hànzì le ma?','Vocês já sabem falar chinês; também já sabem escrever caracteres chineses?','王一飞 · Wang Yifei'],
 ['我们都会写了。','wǒmen dōu huì xiě le.','Todos nós já sabemos escrever.','白家月 · Bai Jiayue'],
 ['老师，我听不见。','lǎoshī, wǒ tīng bu jiàn.','Professora, não consigo ouvir.','陈天中 · Chen Tianzhong'],
 ['请大家不要说话！请听老师的问题：你们都会写哪些汉字了？','qǐng dàjiā bú yào shuōhuà! qǐng tīng lǎoshī de wèntí: nǐmen dōu huì xiě nǎxiē Hànzì le?','Pessoal, por favor, não conversem! Escutem a pergunta da professora: quais caracteres chineses vocês já sabem escrever?','王一飞 · Wang Yifei'],
 ['我会写这些字了，您看！','wǒ huì xiě zhèxiē zì le, nín kàn!','Já sei escrever estes caracteres; veja!','陈天中 · Chen Tianzhong'],
 ])},
 {id:'l14-text3',name:'Diálogo 3 · Os filhos e a escola',label:'课文三 · kèwén sān',description:'Liu Ming e Wang Yixue conversam sobre a escola dos filhos. Páginas 108–110.',items:items('d3',[
 ['明年女儿上中学。','míngnián nǚér shàng zhōngxué.','Ano que vem, nossa filha vai começar a escola secundária.','刘明 · Liu Ming'],
 ['对。儿子也上小学了。','duì. érzi yě shàng xiǎoxué le.','Sim. Nosso filho também vai começar a escola primária.','王一雪 · Wang Yixue'],
 ['我们家有了一个中学生。','wǒmen jiā yǒu le yí ge zhōngxuéshēng.','Nossa família passa a ter um aluno da escola secundária.','刘明 · Liu Ming'],
 ['还有了一个小学生。','hái yǒu le yí ge xiǎoxuéshēng.','E também um aluno da escola primária.','王一雪 · Wang Yixue'],
 ['上学后，他们都忙了。','shàngxué hòu, tāmen dōu máng le.','Depois de começarem a escola, os dois ficam ocupados.','刘明 · Liu Ming'],
 ['是的。太晚了，睡觉吧。','shì de. tài wǎn le, shuìjiào ba.','Sim. Já é tarde demais; vamos dormir.','王一雪 · Wang Yixue'],
 ])},
 {id:'l14-patterns',name:'Estruturas · Ações e todos',label:'练习 · liànxí',description:'Exemplos do livro para distinguir ação concluída, palavras separáveis e 都.',items:items('p',[
 ['我买了一个新电脑。','wǒ mǎi le yí ge xīn diànnǎo.','Eu comprei um computador novo.'],['我昨天没去商店买东西。','wǒ zuótiān méi qù shāngdiàn mǎi dōngxi.','Ontem não fui à loja comprar coisas.'],['我和我的朋友们都去。','wǒ hé wǒ de péngyoumen dōu qù.','Eu e meus amigos vamos todos.'],['同学们都没听见。','tóngxuémen dōu méi tīngjiàn.','Nenhum dos colegas ouviu.'],['他睡了一觉。','tā shuì le yí jiào.','Ele tirou um sono.'],['我上了中文课。','wǒ shàng le Zhōngwén kè.','Eu tive aula de chinês.'],['他下了班。','tā xià le bān.','Ele saiu do trabalho.'],['他说了很多话。','tā shuō le hěn duō huà.','Ele falou bastante.'],['我们都会写了。','wǒmen dōu huì xiě le.','Todos nós já sabemos escrever.'],['请大家不要说话！','qǐng dàjiā bú yào shuōhuà!','Pessoal, por favor, não conversem!'],['我看了一个电影。','wǒ kàn le yí ge diànyǐng.','Eu assisti a um filme.'],['他们都没去。','tāmen dōu méi qù.','Nenhum deles foi.'],
 ])},
];
export const LESSON14_GRAMMAR = [
 {title:'1. Verbo + 了: ação realizada',text:'Nesta lição, 了 depois do verbo indica que uma ação aconteceu ou foi concluída: 看了一个电影. Na negativa dessa ação, use 没 e retire 了: 没去商店买东西.',tip:'了 não é simplesmente o passado: compare o 了 depois do verbo com o 了 final de mudança da lição 12. Contexto e posição importam.',examples:['我看了一个电影。','我买了一个新电脑。','我昨天没去商店买东西。']},
 {title:'2. Palavras separáveis',text:'睡觉、上课、下班、说话 combinam verbo e objeto. Certos elementos podem entrar entre as partes: 睡了一觉、上了中文课、下了班、说了很多话.',tip:'Não separe qualquer palavra aleatoriamente. Pratique os modelos da lição: a partícula de ação concluída vem depois da parte verbal.',examples:['他睡了一觉。','我上了中文课。','他下了班。','他说了很多话。']},
 {title:'3. 都: todos ou ambos',text:'都 vem depois do grupo a que se refere e antes do verbo. 我们都会写了 = todos nós já sabemos escrever. Na negativa ensinada aqui: 都 + 没 + verbo.',tip:'都没去 significa que nenhum foi. Não confunda com 没都去, que nega que todos tenham ido. 他们、她们、它们 soam tāmen, mas têm referentes diferentes.',examples:['我们都会写了。','我和我的朋友们都去。','同学们都没听见。','他们都没去。']},
];
export const LESSON14_QUIZ = [
 {q:'我看了一个电影。',options:['Eu assisti a um filme','Estou procurando um filme','Não vi o filme','Quero ver dois filmes'],correct:0,explanation:'看了 indica ação realizada; 一个 é um.'},
 {q:'Chen Tianzhong viu a professora no trem?',options:['Sim','Não','Só à noite','Só na escola'],correct:1,explanation:'没看见。'},
 {q:'O trem partiu...',options:['de manhã','à noite','ao meio-dia','à meia-noite'],correct:2,explanation:'中午车开后。'},
 {q:'Algumas pessoas estavam lendo; outras...',options:['compravam leite','dirigiam','escreviam','foram dormir'],correct:3,explanation:'有些人在看书，有些人睡觉了。'},
 {q:'Negativa de 我买了一个新电脑:',options:['我没买新电脑。','我不买了新电脑。','我买没了电脑。','我了没买电脑。'],correct:0,explanation:'Para negar a ação realizada, use 没 e omita esse 了.'},
 {q:'Qual frase tem palavra separável usada corretamente?',options:['我睡觉了一觉。','他睡了一觉。','他了睡觉。','他睡了了一觉。'],correct:1,explanation:'睡 + 了 + 一觉.'},
 {q:'我上了中文课。',options:['Eu comecei a trabalhar','Eu li um livro','Eu tive aula de chinês','Eu perdi o trem'],correct:2,explanation:'中文 fica entre 上 e 课.'},
 {q:'他说了很多话。',options:['Ele não ouviu','Ele comprou muitos livros','Ele escreveu pouco','Ele falou bastante'],correct:3,explanation:'说话 separa-se em 说 + 了很多 + 话.'},
 {q:'我们都会写了。',options:['Todos nós já sabemos escrever','Ninguém sabe escrever','Só eu sei escrever','Nós não queremos escrever'],correct:0,explanation:'都 abrange todo o grupo 我们.'},
 {q:'老师，我听不见。',options:['Professora, não quero escutar','Professora, não consigo ouvir','Professora, não sei escrever','Professora, não vi você'],correct:1,explanation:'听不见 é não conseguir perceber o som.'},
 {q:'不要说话！',options:['Falem mais','Escrevam agora','Não conversem!','Não leiam!'],correct:2,explanation:'不要 + verbo pede que não se faça a ação.'},
 {q:'哪些汉字 pergunta...',options:['quantos professores','onde fica a escola','quando começa a aula','quais caracteres chineses'],correct:3,explanation:'哪些 = quais; 汉字 = caracteres chineses.'},
 {q:'明年 significa...',options:['ano que vem','amanhã','ano passado','hoje'],correct:0,explanation:'年 é ano.'},
 {q:'No diálogo 3, a filha vai começar...',options:['a universidade','a escola secundária','o trabalho','a escola primária'],correct:1,explanation:'明年女儿上中学。'},
 {q:'O filho vai começar...',options:['a universidade','a escola secundária','a escola primária','a empresa'],correct:2,explanation:'儿子也上小学了。'},
 {q:'Depois de começarem a escola, os filhos...',options:['não vão estudar','vão trabalhar no trem','vão viajar','ficam ambos ocupados'],correct:3,explanation:'他们都忙了。'},
 {q:'他们都没去。',options:['Nenhum deles foi','Todos foram','Só alguns foram','Todos querem ir'],correct:0,explanation:'都 antes de 没 nega a ida de todo o grupo.'},
 {q:'Qual pronome indica um grupo só de mulheres?',options:['它们','她们','他们','我们'],correct:1,explanation:'她们 = elas. Todos os três primeiros soam tāmen.'},
 {q:'汉语 e 汉字 são...',options:['escola e universidade','professor e aluno','língua chinesa e caractere chinês','trem e carro'],correct:2,explanation:'Distingue-se falar a língua e escrever seus caracteres.'},
 {q:'太晚了，睡觉吧。',options:['É cedo, vamos estudar','Está frio, vamos dormir','É tarde, vamos trabalhar','É tarde demais, vamos dormir'],correct:3,explanation:'晚 refere-se ao horário; 吧 sugere a ação.'},
];
export const LESSON14_WRITING = [
 ['Eu assisti a um filme.','我看了一个电影。','Ação realizada antes da quantidade e do objeto.'],['Eu comprei um computador novo.','我买了一个新电脑。','Use a ação de comprar concluída e o adjetivo novo.'],['Ontem não fui à loja comprar coisas.','我昨天没去商店买东西。','Negue a ação que não aconteceu.'],['Eu tive aula de chinês.','我上了中文课。','Coloque o nome da matéria dentro da palavra separável.'],['Ele saiu do trabalho.','他下了班。','Separe o verbo e o objeto para marcar a ação realizada.'],['Ele falou bastante.','他说了很多话。','Indique a quantidade de fala entre as partes.'],['Todos nós já sabemos escrever.','我们都会写了。','O grupo vem antes do advérbio de totalidade.'],['Professora, não consigo ouvir.','老师，我听不见。','Não conseguir ouvir não é recusar escutar.'],['Pessoal, por favor, não conversem!','请大家不要说话！','Pedido para o grupo não fazer a ação.'],['Ano que vem, nossa filha vai começar a escola secundária.','明年女儿上中学。','Tempo, filha e nível de escola.'],['Nenhum dos colegas ouviu.','同学们都没听见。','Totalidade antes da negação.'],['Já é tarde demais; vamos dormir.','太晚了，睡觉吧。','Situação de horário e sugestão.'],
] as const;
