import type { StudyItem, StudyGroup } from './lesson11Data';
const items = (prefix: string, rows: Array<[string,string,string,string?]>): StudyItem[] => rows.map(([hanzi,pinyin,meaning,speaker],i) => ({id:`l13-${prefix}-${i+1}`,hanzi,pinyin,meaning,...(speaker ? {speaker} : {})}));
export const LESSON13_GROUPS: StudyGroup[] = [
 {id:'l13-vocabulary',name:'Vocabulário · 20 palavras',label:'生词 · shēngcí',description:'Todas as entradas da lição 13, na ordem do livro, páginas 97, 99 e 100.',items:items('v',[
 ['可以','kěyǐ','poder: permissão ou possibilidade'],['再','zài','novamente'],['问题','wèntí','pergunta ou problema'],['卖','mài','vender'],['打电话','dǎ diànhuà','telefonar'],['一下','yíxià','um instante'],['服务员','fúwùyuán','atendente'],['女士','nǚshì','senhora'],['请','qǐng','por favor'],['坐','zuò','sentar'],['给','gěi','dar'],['杯','bēi','copo: classificador'],['要','yào','querer ou pedir'],['早饭','zǎofàn','café da manhã'],['这个','zhè ge','este'],['面包','miànbāo','pão'],['鸡蛋','jīdàn','ovo'],['先生','xiānsheng','senhor'],['一半','yíbàn','metade'],['茶','chá','chá'],
 ])},
 {id:'l13-text1',name:'Diálogo 1 · Mais uma pergunta',label:'课文一 · kèwén yī',description:'Bai Jiayue conversa com a professora Wang Yifei depois da aula. Página 96.',items:items('d1',[
 ['王老师，我可以再问您一个问题吗？','Wáng lǎoshī, wǒ kěyǐ zài wèn nín yí ge wèntí ma?','Professora Wang, posso lhe fazer mais uma pergunta?','白家月 · Bai Jiayue'],
 ['可以。你有什么问题？','kěyǐ. nǐ yǒu shénme wèntí?','Pode. Qual é a sua pergunta?','王一飞 · Wang Yifei'],
 ['那个小店卖不卖手机？','nà ge xiǎo diàn mài bu mài shǒujī?','Aquela lojinha vende celulares?','白家月 · Bai Jiayue'],
 ['我不知道。你可以打电话问一下。','wǒ bù zhīdào. nǐ kěyǐ dǎ diànhuà wèn yíxià.','Eu não sei. Você pode telefonar para perguntar.','王一飞 · Wang Yifei'],
 ])},
 {id:'l13-text2',name:'Diálogo 2 · Café da manhã',label:'课文二 · kèwén èr',description:'Wang Yixue pede seu café da manhã na cafeteria. Página 98.',items:items('d2',[
 ['女士，请坐！您喝什么？','nǚshì, qǐng zuò! nín hē shénme?','Senhora, sente-se, por favor! O que vai beber?','服务员 · Atendente'],
 ['我看一下。请给我一杯牛奶。','wǒ kàn yíxià. qǐng gěi wǒ yì bēi niúnǎi.','Vou dar uma olhada. Por favor, me dê um copo de leite.','王一雪 · Wang Yixue'],
 ['好的。您还要什么？','hǎo de. nín hái yào shénme?','Certo. O que mais deseja?','服务员 · Atendente'],
 ['我还没吃早饭，再要这个面包和鸡蛋吧。','wǒ hái méi chī zǎofàn, zài yào zhè ge miànbāo hé jīdàn ba.','Ainda não tomei café da manhã; vou pedir também este pão e o ovo.','王一雪 · Wang Yixue'],
 ])},
 {id:'l13-text3',name:'Diálogo 3 · Pedir jiaozi',label:'课文三 · kèwén sān',description:'Liu Ming pede bolinhos e chá. Página 100. As quantidades são as deste diálogo, não uma regra de tamanho dos bolinhos.',items:items('d3',[
 ['先生，请坐！您要什么？','xiānsheng, qǐng zuò! nín yào shénme?','Senhor, sente-se, por favor! O que deseja?','服务员 · Atendente'],
 ['我要一斤饺子。','wǒ yào yì jīn jiǎozi.','Quero um jin de jiaozi.','刘明 · Liu Ming'],
 ['好的。一斤饺子四十个。','hǎo de. yì jīn jiǎozi sìshí ge.','Certo. Um jin de jiaozi tem quarenta unidades.','服务员 · Atendente'],
 ['四十个太多了，我要一半吧。','sìshí ge tài duō le, wǒ yào yíbàn ba.','Quarenta são demais; vou querer metade.','刘明 · Liu Ming'],
 ['半斤二十个。您想喝什么？','bàn jīn èrshí ge. nín xiǎng hē shénme?','Meio jin são vinte unidades. O que gostaria de beber?','服务员 · Atendente'],
 ['请给我一杯茶吧。','qǐng gěi wǒ yì bēi chá ba.','Por favor, me dê uma xícara de chá.','刘明 · Liu Ming'],
 ])},
 {id:'l13-patterns',name:'Estruturas · Permissão e pedidos',label:'练习 · liànxí',description:'Modelos do livro e prática guiada para pedir, perguntar e dar algo a alguém.',items:items('p',[
 ['我可以坐吗？','wǒ kěyǐ zuò ma?','Posso sentar?'],['可以，请坐！','kěyǐ, qǐng zuò!','Pode, sente-se, por favor!'],['你们可以看这本书。','nǐmen kěyǐ kàn zhè běn shū.','Vocês podem ler este livro.'],['请休息一下。','qǐng xiūxi yíxià.','Descanse um pouco, por favor.'],['你看一下吧。','nǐ kàn yíxià ba.','Dê uma olhada.'],['白家月给安妮一个苹果。','Bái Jiāyuè gěi Ānnī yí ge píngguǒ.','Bai Jiayue dá uma maçã a Annie.'],['我问老师两个问题。','wǒ wèn lǎoshī liǎng ge wèntí.','Eu faço duas perguntas ao professor.'],['请给我一杯牛奶。','qǐng gěi wǒ yì bēi niúnǎi.','Por favor, me dê um copo de leite.'],['我可以再问您一个问题吗？','wǒ kěyǐ zài wèn nín yí ge wèntí ma?','Posso lhe fazer mais uma pergunta?'],['你可以打电话问一下。','nǐ kěyǐ dǎ diànhuà wèn yíxià.','Você pode telefonar para perguntar.'],['我要半斤饺子。','wǒ yào bàn jīn jiǎozi.','Quero meio jin de jiaozi.'],['您还要什么？','nín hái yào shénme?','O que mais deseja?'],
 ])},
];
export const LESSON13_GRAMMAR = [
 {title:'1. 可以: poder e pedir permissão',text:'可以 vem antes do verbo e pode indicar permissão ou possibilidade. 我可以坐吗？ pede licença para sentar. Responda 可以 e, se desejar, acrescente 请坐.',tip:'Não confunda com 会, usado para uma habilidade aprendida, como saber dirigir. O contexto distingue os sentidos de poder.',examples:['我可以坐吗？','可以，请坐！','你们可以看这本书。']},
 {title:'2. Verbo + 一下: ação breve',text:'Depois de um verbo, 一下 indica uma tentativa ou ação rápida, frequentemente suavizando o pedido: 看一下, 问一下, 休息一下.',tip:'Em 打电话问一下, telefonar é o meio de fazer a pergunta. Não transforme 一下 em uma duração fixa em segundos.',examples:['请休息一下。','你看一下吧。','你可以打电话问一下。']},
 {title:'3. Dois objetos: dar a alguém / perguntar a alguém',text:'给 e 问 podem receber a pessoa primeiro e a coisa depois: 给 + pessoa + coisa; 问 + pessoa + pergunta. Em 请给我一杯牛奶, 我 é quem recebe o leite.',tip:'Em 一杯牛奶, 杯 conta copos; em 两个问题, 个 conta perguntas. Preserve a ordem pessoa → coisa.',examples:['请给我一杯牛奶。','白家月给安妮一个苹果。','我问老师两个问题。']},
];
export const LESSON13_QUIZ = [
 {q:'我可以坐吗？',options:['Posso sentar?','Sei dirigir?','Onde está a cadeira?','Já sentei?'],correct:0,explanation:'可以 aqui pede permissão.'},
 {q:'Bai Jiayue quer saber se a loja vende...',options:['livros','celulares','leite','roupas'],correct:1,explanation:'那个小店卖不卖手机？'},
 {q:'Wang Yifei recomenda...',options:['ir ao hospital','comprar pão','telefonar e perguntar','esperar amanhã'],correct:2,explanation:'你可以打电话问一下。'},
 {q:'Wang Yixue pede para beber...',options:['chá','água','café','leite'],correct:3,explanation:'请给我一杯牛奶。'},
 {q:'我还没吃早饭 significa...',options:['Ainda não tomei café da manhã','Não gosto de café da manhã','Já almocei','Vou jantar'],correct:0,explanation:'还没 expressa ainda não; 早饭 é café da manhã.'},
 {q:'O que acompanha o leite no diálogo?',options:['arroz e carne','pão e ovo','fruta e chá','macarrão e peixe'],correct:1,explanation:'这个面包和鸡蛋。'},
 {q:'Liu Ming começa pedindo...',options:['meio copo','dois jin','um jin de jiaozi','vinte pães'],correct:2,explanation:'我要一斤饺子。'},
 {q:'No diálogo, um jin corresponde a...',options:['dez bolinhos','vinte bolinhos','trinta bolinhos','quarenta bolinhos'],correct:3,explanation:'一斤饺子四十个; é a quantidade desse exemplo.'},
 {q:'一半 significa...',options:['metade','um copo','uma vez','um dia'],correct:0,explanation:'Liu Ming reduz o pedido para metade.'},
 {q:'No diálogo, meio jin tem...',options:['dez unidades','vinte unidades','quarenta unidades','cinquenta unidades'],correct:1,explanation:'半斤二十个。'},
 {q:'Liu Ming escolhe beber...',options:['leite','café','chá','água'],correct:2,explanation:'请给我一杯茶吧。'},
 {q:'一下 depois do verbo sugere...',options:['negação','passado obrigatório','uma pessoa','ação breve ou tentativa'],correct:3,explanation:'看一下 = dar uma olhada.'},
 {q:'Qual é a ordem de 给?',options:['pessoa, coisa','coisa, pessoa obrigatoriamente','tempo, pessoa apenas','lugar, tempo apenas'],correct:0,explanation:'请给我一杯牛奶: 我 antes de 一杯牛奶.'},
 {q:'我问老师两个问题: quantas perguntas?',options:['uma','duas','três','quatro'],correct:1,explanation:'两个问题 são duas perguntas.'},
 {q:'卖 é...',options:['comprar','procurar','vender','sentar'],correct:2,explanation:'Compare 买 mǎi com 卖 mài.'},
 {q:'Qual palavra conta copos de bebida?',options:['斤','本','件','杯'],correct:3,explanation:'一杯茶 e 一杯牛奶.'},
 {q:'服务员 significa...',options:['atendente','professor','médico','aluno'],correct:0,explanation:'É quem atende no café/restaurante.'},
 {q:'您还要什么？',options:['O que já comeu?','O que mais deseja?','O que não vende?','Onde vai sentar?'],correct:1,explanation:'还 = mais; 要 = desejar/pedir.'},
 {q:'请休息一下。',options:['Trabalhe novamente','Telefone depois','Descanse um pouco, por favor','Não se sente'],correct:2,explanation:'休息 é descansar; 一下 suaviza o pedido.'},
 {q:'卖不卖 é uma pergunta...',options:['sobre o passado','com 哪儿','sobre quantidade','afirmativa-negativa'],correct:3,explanation:'Verbo + 不 + verbo pergunta se vende ou não.'},
];
export const LESSON13_WRITING = [
 ['Posso sentar?','我可以坐吗？','Peça permissão, não descreva habilidade.'],['Pode, sente-se, por favor!','可以，请坐！','Responda e faça o convite.'],['Por favor, me dê um copo de leite.','请给我一杯牛奶。','Destinatário antes da bebida; classificador de copos.'],['O que mais deseja?','您还要什么？','Use a forma respeitosa de você e a ideia de mais.'],['Ainda não tomei café da manhã.','我还没吃早饭。','Indique que a refeição ainda não aconteceu.'],['Eu faço duas perguntas ao professor.','我问老师两个问题。','Pessoa antes das perguntas.'],['Bai Jiayue dá uma maçã a Annie.','白家月给安妮一个苹果。','Quem dá, quem recebe e o objeto.'],['Quero um jin de jiaozi.','我要一斤饺子。','Use a unidade de peso.'],['Quarenta são demais; vou querer metade.','四十个太多了，我要一半吧。','Quantidade, excesso e redução do pedido.'],['Por favor, me dê uma xícara de chá.','请给我一杯茶吧。','Pedido cortês com destinatário e bebida.'],['Descanse um pouco, por favor.','请休息一下。','Use a estrutura de ação breve.'],['Você pode telefonar para perguntar.','你可以打电话问一下。','Permissão, meio de contato e ação breve.'],
] as const;
