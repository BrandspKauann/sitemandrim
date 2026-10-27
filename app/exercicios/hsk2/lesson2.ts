import {group,makeLesson} from './helpers';
const n=2;
const groups=[
 group(n,'vocabulary','Vocabulário · 16 entradas','Entradas das páginas 11, 13, 15 e 16.',[
 ['公交车','ônibus'],['但','mas'],['车站','ponto ou estação'],['远','longe'],['打车','pegar táxi'],['还是','melhor: escolha sugerida'],['啊','partícula de exclamação'],['万','dez mil'],['名','classificador de pessoas'],['网上','na internet'],['外国','país estrangeiro'],['间','classificador de cômodos'],['教室','sala de aula'],['票','ingresso ou passagem'],['别','não faça'],['过来','vir para cá'],
 ]),
 group(n,'places','Lugar · 北京大学','Nome próprio da página 11; 北大 é a abreviação.',[['北京大学','Universidade de Pequim'],['北大','Universidade de Pequim: abreviação']]),
 group(n,'text1','Diálogo 1 · Como chegar à universidade','As viajantes pedem informações na recepção do hotel. Página 11.',[
 ['请问，这儿有到北京大学的公交车吗？','Com licença, há ônibus daqui para a Universidade de Pequim?','白家月 · Bai Jiayue'],['有，但车站有点儿远。','Há, mas o ponto fica um pouco longe.','服务员 · Atendente'],['这儿好打车吗？','É fácil pegar táxi aqui?','白家月 · Bai Jiayue'],['好打车。','É fácil pegar táxi.','服务员 · Atendente'],['谢谢。安妮，我们还是打车去吧。','Obrigada. Annie, é melhor irmos de táxi.','白家月 · Bai Jiayue'],['好，没问题。','Certo, sem problema.','安妮 · Annie'],
 ]),
 group(n,'text2','Diálogo 2 · Visitando o campus','Conversa na universidade. Página 13; os números pertencem ao diálogo do livro.',[
 ['学校里人真多啊！','Há mesmo muita gente na universidade!','白家月 · Bai Jiayue'],['是啊，北京大学有四万多名学生呢！','Sim, a Universidade de Pequim tem mais de quarenta mil alunos!','安妮 · Annie'],['你是怎么知道的？','Como foi que você soube?','白家月 · Bai Jiayue'],['是网上说的，网上还说北京大学有三千多名外国学生。','Foi pela internet; lá também diz que a Universidade de Pequim tem mais de três mil alunos estrangeiros.','安妮 · Annie'],['我也想来这儿学习。','Eu também quero vir estudar aqui.','白家月 · Bai Jiayue'],['那边就有一间教室，我们去看一下吧。','Há uma sala de aula logo ali; vamos dar uma olhada.','安妮 · Annie'],
 ]),
 group(n,'text3','Diálogo 3 · Cinema no campus','Conversam sobre o cinema e seus ingressos. Página 15.',[
 ['家月，你看，学校里有家电影院！','Jiayue, veja, há um cinema na universidade!','安妮 · Annie'],['是啊，电影院还不小。','Sim, e o cinema é bem grande.','白家月 · Bai Jiayue'],['他们卖的电影票也很便宜。','Os ingressos de cinema que vendem também são baratos.','安妮 · Annie'],['天啊！有的还不到二十块钱。','Nossa! Alguns nem chegam a vinte yuans.','白家月 · Bai Jiayue'],['那你想不想去看个电影？','Então, você quer ir ver um filme?','安妮 · Annie'],['还是别看电影了，北京大学就很好看！','É melhor não vermos filme agora; a própria Universidade de Pequim já é muito bonita!','白家月 · Bai Jiayue'],
 ]),
 group(n,'text4','Texto 4 · Mensagem sobre a visita','Mensagem da página 16, dividida em frases.',[
 ['北京大学很大，有四万多名学生。','A Universidade de Pequim é grande e tem mais de quarenta mil alunos.'],['学校很漂亮，里边还有家电影院，电影票也不贵，我们有时间还想再过来看个电影。','A universidade é bonita; dentro dela também há um cinema, e os ingressos não são caros. Quando tivermos tempo, queremos voltar para ver um filme.'],
 ]),
 group(n,'patterns','Estruturas · Escolha, quantidade e descrição','Exemplos das páginas 12, 14 e 16.',[
 ['我们还是打车去吧。','É melhor irmos de táxi.'],['那件衣服很好看，还是买那件吧。','Aquela roupa é bonita; é melhor comprar aquela.'],['你第一次去北京，还是找个人接你吧。','É sua primeira ida a Pequim; é melhor pedir que alguém vá buscar você.'],['教室里有二十多个学生。','Há mais de vinte alunos na sala de aula.'],['这两个苹果五块多钱。','Estas duas maçãs custam pouco mais de cinco yuans.'],['现在学中文的学生很多。','Há muitos alunos estudando chinês atualmente.'],['这是朋友给我的杯子。','Este é o copo que meu amigo me deu.'],
 ]),
];
export const HSK2_LESSON2=makeLesson({number:n,title:'还是打车去北大吧',pages:'10–18',groups,
 grammar:[
 {title:'1. 还是…吧: escolher o que parece melhor',text:'Expressa preferência ou recomendação entre alternativas: é melhor fazer assim. No texto, o ponto de ônibus fica longe, então elas escolhem o táxi.',tip:'好打车 significa ser fácil pegar táxi, não “táxi bonito”. 还是别…了 recomenda não fazer algo agora.',examples:['我们还是打车去吧。','那件衣服很好看，还是买那件吧。','你第一次去北京，还是找个人接你吧。']},
 {title:'2. 多: um pouco acima de uma quantidade',text:'Com dezenas ou múltiplos de dez, 多 costuma seguir o número: 二十多个学生、四万多名学生. Em quantidades menores com unidade, pode vir depois dela: 五块多钱.',tip:'四万多 significa mais de 40.000, não 4.000. 五块多钱 fica pouco acima de cinco yuans; não informa centavos exatos.',examples:['是啊，北京大学有四万多名学生呢！','教室里有二十多个学生。','这两个苹果五块多钱。']},
 {title:'3. Descrição + 的 + nome',text:'Verbos, expressões verbais ou uma oração podem descrever um nome: 他们卖的电影票 = os ingressos que eles vendem. O nome principal vem depois de 的.',tip:'Identifique o núcleo final: em 朋友给我的杯子, o objeto é o copo; 朋友给我 explica de onde veio.',examples:['他们卖的电影票也很便宜。','现在学中文的学生很多。','这是朋友给我的杯子。']},
 ],checks:[
 {q:'Por que escolhem o táxi?',options:['O ponto de ônibus fica longe','Não há ônibus','O táxi é gratuito','Vão dirigir'],correct:0,explanation:'Há ônibus, mas o ponto fica um pouco longe.'},
 {q:'好打车 significa...',options:['O táxi é bonito','É fácil pegar táxi','O táxi é caro','O ônibus é fácil'],correct:1,explanation:'好 + verbo pode indicar facilidade.'},
 {q:'四万多名学生 é...',options:['mais de quatrocentos','mais de quatro mil','mais de quarenta mil','exatamente quarenta mil'],correct:2,explanation:'万 equivale a dez mil.'},
 {q:'Quantos alunos estrangeiros são citados?',options:['mais de trezentos','mais de trinta mil','quarenta mil','mais de três mil'],correct:3,explanation:'三千多名外国学生 no diálogo.'},
 {q:'Alguns ingressos custam...',options:['menos de vinte yuans','exatamente vinte','mais de duzentos','cem yuans'],correct:0,explanation:'不到二十块钱。'},
 {q:'O que fazem agora?',options:['Assistem a um filme','Continuam a visita, sem ver filme','Voltam de ônibus','Compram uma sala'],correct:1,explanation:'还是别看电影了。'},
 {q:'Em 朋友给我的杯子, o nome principal é...',options:['amigo','eu','copo','dar'],correct:2,explanation:'杯子 vem depois da descrição com 的.'},
 {q:'教室里有二十多个学生 indica...',options:['exatamente vinte','menos de vinte','duzentos','mais de vinte'],correct:3,explanation:'多 indica quantidade acima de vinte, sem total exato.'},
 ],writing:[['我们还是打车去吧。','Recomende uma escolha de transporte.'],['这儿好打车吗？','Pergunte se é fácil conseguir o transporte.'],['有，但车站有点儿远。','Confirme e faça uma ressalva sobre distância.'],['学校里人真多啊！','Exclame sobre a quantidade de pessoas no lugar.'],['你是怎么知道的？','Destaque o modo como soube.'],['我也想来这儿学习。','Acrescente seu desejo de estudar aqui.'],['他们卖的电影票也很便宜。','Descreva os ingressos antes de dizer o preço.'],['那你想不想去看个电影？','Faça uma pergunta afirmativa-negativa.'],['教室里有二十多个学生。','Indique pouco acima de vinte pessoas.'],['这两个苹果五块多钱。','Preço pouco acima de cinco yuans.'],['现在学中文的学生很多。','A descrição dos alunos vem antes do nome.'],['这是朋友给我的杯子。','Descreva o copo usando quem o deu.']],prompts:'Peça informações sobre transporte, recomende uma alternativa, descreva uma escola e diga quantidades aproximadas.',promptsChinese:'这儿好打车吗？ · 我们还是坐公交车去吧。 · 教室里有多少人？',notes:'Os números de alunos e os preços são os exemplos do livro, não estatísticas ou preços atuais. O local referido como cinema é o auditório comemorativo da universidade, que também exibe filmes, conforme a nota do livro.'});
