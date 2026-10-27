import {group,makeLesson} from './helpers';
const n=3;
const groups=[
 group(n,'vocabulary','Vocabulário · 15 entradas','Entradas das páginas 20, 22, 24 e 25.',[
 ['回来','voltar para cá'],['这么','tão: desta maneira'],['完','terminar: resultado'],['一起','juntos'],['出去','sair'],['洗','lavar'],['自己','si mesmo'],['拿','pegar'],['手','mão'],['为什么','por quê'],['不错','bom: nada mal'],['送','levar alguém ou presentear'],['回去','voltar para lá'],['每','cada'],['累','cansado'],
 ]),
 group(n,'text1','Diálogo 1 · Chegar tarde','Liu Ming chega em casa. Página 20.',[
 ['今天回来这么晚啊！','Você voltou tão tarde hoje!','王一雪 · Wang Yixue'],['工作太多了，下班的时候没做完。','Havia muito trabalho; na hora de sair, eu ainda não tinha terminado.','刘明 · Liu Ming'],['菜都做好了，过来吃饭吧。','A comida já está toda pronta; venha comer.','王一雪 · Wang Yixue'],['我想休息一下，喝杯水。','Quero descansar um pouco e beber um copo de água.','刘明 · Liu Ming'],['好的。','Está bem.','王一雪 · Wang Yixue'],
 ]),
 group(n,'text2','Diálogo 2 · Planejar uma viagem','Liu Ming e Wang Yixue conversam na sala. Página 22.',[
 ['我们找个时间去旅游，怎么样？','Que tal encontrarmos um tempo para viajar?','刘明 · Liu Ming'],['好啊，我也很想一起出去玩。','Ótimo, eu também quero muito sair para passear juntos.','王一雪 · Wang Yixue'],['你想去哪儿？','Aonde você quer ir?','刘明 · Liu Ming'],['我还没想好呢。','Ainda não decidi.','王一雪 · Wang Yixue'],['那你再想一想，你想好了，我来买票。','Então pense mais um pouco; quando decidir, eu compro as passagens.','刘明 · Liu Ming'],
 ]),
 group(n,'text3','Diálogo 3 · Escolher Xi’an','Continuam a conversa, comendo maçãs. Página 24.',[
 ['吃个苹果吧，我都洗好了。','Coma uma maçã; já lavei todas.','刘明 · Liu Ming'],['好的。','Está bem.','王一雪 · Wang Yixue'],['就在桌子上，你自己拿。','Estão bem em cima da mesa; pegue você mesma.','刘明 · Liu Ming'],['我去洗洗手。对了，我们去西安旅游，怎么样？','Vou lavar as mãos. Ah, que tal viajarmos para Xi’an?','王一雪 · Wang Yixue'],['为什么想去西安？','Por que você quer ir a Xi’an?','刘明 · Liu Ming'],['我看了看网上的介绍，这个时候去西安很不错！','Dei uma olhada nas informações da internet; esta é uma boa época para ir a Xi’an!','王一雪 · Wang Yixue'],
 ]),
 group(n,'text4','Texto 4 · Rotina de Liu Ming','Relato da página 25 separado por frases.',[
 ['早上，刘明开车送孩子去学校，送完孩子回家后，医院就来电话了，让他回去上班。','De manhã, Liu Ming levou os filhos de carro à escola. Depois de deixá-los e voltar para casa, o hospital telefonou, pedindo que voltasse ao trabalho.'],['我觉得他这个月每天都很累，真想让他休息休息。','Acho que neste mês ele está cansado todos os dias; queria muito que descansasse um pouco.'],
 ]),
 group(n,'patterns','Estruturas · Resultado e ação breve','Exemplos das páginas 21, 23 e 25.',[
 ['菜都做好了。','A comida já está toda pronta.'],['小明吃完饭了。','Xiaoming terminou de comer.'],['小雪今天来晚了。','Xiaoxue chegou atrasada hoje.'],['我没吃完饭。','Eu não terminei de comer.'],['你吃完饭了吗？','Você já terminou de comer?'],['你学没学会？','Você aprendeu ou não?'],['我有点儿累，现在想休息休息。','Estou um pouco cansado; agora quero descansar um pouco.'],['你能过来帮帮忙吗？','Você pode vir ajudar um pouco?'],['我看了看网上的介绍。','Dei uma olhada nas informações da internet.'],['我休息了一下，现在觉得不累了。','Descansei um pouco; agora não me sinto mais cansado.'],['他昨天来帮了帮忙。','Ontem ele veio ajudar um pouco.'],
 ]),
];
export const HSK2_LESSON3=makeLesson({number:n,title:'我想去西安旅游',pages:'19–28',groups,
 grammar:[
 {title:'1. Complemento de resultado',text:'Depois do verbo, 好、完、晚、懂、会 podem indicar o resultado: 做好 preparar e deixar pronto; 吃完 terminar de comer; 学会 aprender e dominar. A negativa usa 没(有) antes do verbo, sem esse 了.',tip:'Fazer uma ação não garante o resultado: 看了 não significa necessariamente 看懂了. Compare 没吃 e 没吃完.',examples:['菜都做好了。','小明吃完饭了。','小雪今天来晚了。','我没吃完饭。','你吃完饭了吗？','你学没学会？']},
 {title:'2. Repetição: ação breve ou tentativa',text:'Verbo de uma sílaba: A(A) ou A一A, como 想想、想一想. Duas sílabas: ABAB, como 休息休息. Palavra separável: AAB, como 帮帮忙、洗洗手.',tip:'Não repita qualquer verbo automaticamente. O padrão aparece sobretudo com ações que podem ser feitas por pouco tempo ou tentadas.',examples:['我有点儿累，现在想休息休息。','你能过来帮帮忙吗？']},
 {title:'3. Repetição de ação já realizada',text:'Uma sílaba: A了A, como 看了看. Duas sílabas: use o modelo AB了一下, como 休息了一下. Separável: A了AB, como 帮了帮忙.',tip:'Não use 休息了休息 como modelo desta lição. 了 entra depois da parte verbal nos padrões separáveis.',examples:['我看了看网上的介绍。','我休息了一下，现在觉得不累了。','他昨天来帮了帮忙。']},
 ],checks:[
 {q:'Por que Liu Ming chegou tarde?',options:['Não terminou o trabalho a tempo','Foi ao cinema','Perdeu as chaves','Estava viajando'],correct:0,explanation:'下班的时候没做完。'},
 {q:'O que ele quer fazer ao chegar?',options:['Comprar passagens','Descansar e beber água','Cozinhar de novo','Lavar roupa'],correct:1,explanation:'我想休息一下，喝杯水。'},
 {q:'Quem vai comprar as passagens?',options:['Xiaoxue','Li Wen','Liu Ming','Annie'],correct:2,explanation:'Liu Ming diz 我来买票.'},
 {q:'Onde estão as maçãs?',options:['Na geladeira','Na escola','No hospital','Em cima da mesa'],correct:3,explanation:'就在桌子上。'},
 {q:'Por que Wang Yixue escolhe Xi’an?',options:['Leu informações na internet','Foi obrigada pelo hospital','As passagens são grátis','Já mora lá'],correct:0,explanation:'看了看网上的介绍。'},
 {q:'Quem telefonou para Liu Ming?',options:['A escola','O hospital','A loja','O hotel'],correct:1,explanation:'O hospital pediu que voltasse ao trabalho.'},
 {q:'Qual significa não terminar de comer?',options:['我不吃饭。','我吃完饭了。','我没吃完饭。','我没吃饭。'],correct:2,explanation:'完 expressa o resultado de terminar.'},
 {q:'Qual modelo indica uma olhada já realizada?',options:['看看了了','了看看','看一看了了','看了看'],correct:3,explanation:'A了A é o modelo de ação breve realizada.'},
 ],writing:[['菜都做好了。','Destaque que o preparo já terminou.'],['我没吃完饭。','Negue o resultado de terminar, não a refeição toda.'],['你吃完饭了吗？','Pergunte pelo término da ação.'],['你学没学会？','Pergunta afirmativa-negativa com resultado.'],['我还没想好呢。','Indique que a decisão ainda não foi tomada.'],['你想去哪儿？','Pergunte o destino desejado.'],['我想休息一下，喝杯水。','Duas ações desejadas em sequência.'],['你能过来帮帮忙吗？','Peça ajuda breve com a palavra separável.'],['我看了看网上的介绍。','Uma olhada breve que já aconteceu.'],['他昨天来帮了帮忙。','Tempo e ação breve realizada.'],['我休息了一下，现在觉得不累了。','Descanso realizado e mudança de sensação.'],['我有点儿累，现在想休息休息。','Sensação atual e desejo de ação breve.']],prompts:'Conte por que chegou tarde, diga o que terminou ou não terminou e combine uma viagem com alguém.',promptsChinese:'你想好了吗？ · 你为什么想去西安？ · 你吃完饭了吗？',notes:'回来 e 回去 dependem do ponto de referência: voltar para cá ou para lá. A descrição da viagem e da rotina é a narrativa do livro, não informação sobre viagens ou aconselhamento de saúde.'});
