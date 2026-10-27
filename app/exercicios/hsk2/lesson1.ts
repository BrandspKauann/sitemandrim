import {group,makeLesson} from './helpers';
const n=1;
const groups=[
 group(n,'vocabulary','Vocabulário · 14 entradas','Entradas das páginas 2, 4, 5 e 7, na ordem do livro.',[
 ['就','justamente'],['给','para: destinatário'],['让','pedir ou deixar fazer'],['接','buscar alguém'],['次','vez'],['旅游','viajar a passeio'],['帮忙','ajudar'],['不好意思','desculpe'],['已经','já'],['那','então'],['介绍','apresentar'],['有时','às vezes'],['懂','entender'],['意思','significado'],
 ]),
 group(n,'places','Especialidade · 北京烤鸭','Nome próprio destacado na página 7.',[['北京烤鸭','pato à Pequim']]),
 group(n,'text1','Diálogo 1 · No aeroporto','Wang Yixue recebe Bai Jiayue e Annie. Página 2.',[
 ['请问，您是王一飞老师的姐姐吗？','Com licença, a senhora é a irmã mais velha da professora Wang Yifei?','白家月 · Bai Jiayue'],
 ['是的，你们就是她的学生吧？','Sim. Vocês são as alunas dela, certo?','王一雪 · Wang Yixue'],
 ['对。我是白家月，她是安妮。','Isso. Sou Bai Jiayue, e ela é Annie.','白家月 · Bai Jiayue'],
 ['你们好，我叫王一雪。一飞给我打电话了，让我来接你们。','Olá, eu me chamo Wang Yixue. Yifei me telefonou e pediu que eu viesse buscar vocês.','王一雪 · Wang Yixue'],
 ['谢谢您。','Muito obrigada.','白家月、安妮 · Bai Jiayue e Annie'],['不客气。','De nada.','王一雪 · Wang Yixue'],
 ]),
 group(n,'text2','Diálogo 2 · Primeira visita','Conversa no carro de Wang Yixue. Páginas 3–4.',[
 ['你们是第一次来北京吗？','É a primeira vez que vocês vêm a Pequim?','王一雪 · Wang Yixue'],['是的，我们都是第一次来。','Sim, é a primeira vez para nós duas.','白家月 · Bai Jiayue'],['你们是来学中文的吗？','Vocês vieram para estudar chinês?','王一雪 · Wang Yixue'],['不是，我们是来旅游的。','Não, viemos a passeio.','安妮 · Annie'],['我这几天都不忙，你们有事就找我。','Não estou ocupada nestes dias; se precisarem de algo, me procurem.','王一雪 · Wang Yixue'],['好的，谢谢您。','Está bem, muito obrigada.','白家月 · Bai Jiayue'],
 ]),
 group(n,'text3','Diálogo 3 · Pedir ajuda','Chen Tianzhong telefona para Bai Jiayue. Página 5.',[
 ['喂，家月，你明天有时间吗？我想请你帮个忙。','Alô, Jiayue, você tem tempo amanhã? Gostaria de pedir sua ajuda.','陈天中 · Chen Tianzhong'],['不好意思，天中，我已经到北京了。','Desculpe, Tianzhong, já cheguei a Pequim.','白家月 · Bai Jiayue'],['你是什么时候到的？','Quando foi que você chegou?','陈天中 · Chen Tianzhong'],['我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。','Cheguei hoje de manhã. Se precisar de algo, pode pedir ajuda ao Li Wen; ele ainda está na escola.','白家月 · Bai Jiayue'],['好的，那我给他打个电话。','Está bem, então vou telefonar para ele.','陈天中 · Chen Tianzhong'],['好，再见！','Certo, até mais!','白家月 · Bai Jiayue'],
 ]),
 group(n,'text4','Texto 4 · Mensagem para a professora','Texto narrativo da página 7, separado em frases para acompanhar a leitura.',[
 ['王老师，我们已经到北京了，是您姐姐来接的我们。','Professora Wang, já chegamos a Pequim; foi sua irmã mais velha que veio nos buscar.'],['她请我们吃了北京烤鸭，还给我们介绍了很多东西。','Ela nos ofereceu pato à Pequim e também nos apresentou muitas coisas.'],['我们的中文不太好，有时不太懂她的意思。','Nosso chinês não é muito bom; às vezes não entendemos muito bem o que ela quer dizer.'],
 ]),
 group(n,'patterns','Estruturas · Suposição, foco e pedidos','Exemplos gramaticais do livro, páginas 3, 5 e 6.',[
 ['她唱歌很好听吧？','Ela canta bem, não é?'],['陈天中是泰国人吧？','Chen Tianzhong é tailandês, certo?'],['我们是来旅游的。','Viemos a passeio.'],['苹果在哪儿买的？','Onde foi que as maçãs foram compradas?'],['我们不是坐出租车去的。','Não foi de táxi que nós fomos.'],['我想请你帮个忙。','Gostaria de pedir sua ajuda.'],['王老师让我们说中文。','A professora Wang pede que falemos chinês.'],['妈妈叫孩子们回家。','A mãe manda as crianças voltarem para casa.'],
 ]),
];
export const HSK2_LESSON1=makeLesson({number:n,title:'她请我们吃了北京烤鸭',pages:'1–9',groups,
 grammar:[
 {title:'1. 吧: confirmar uma suposição',text:'No fim de uma pergunta, 吧 pode indicar uma estimativa ou suposição: “Vocês são as alunas dela, certo?”. Aqui não é o convite de 我们走吧.',tip:'Preste atenção no contexto: o mesmo 吧 tem usos diferentes.',examples:['她唱歌很好听吧？','陈天中是泰国人吧？']},
 {title:'2. 是…的: destacar detalhes',text:'Destaca quem fez algo, quando, onde, como ou com que objetivo. Em contexto de uma ação já conhecida, 我们是来旅游的 destaca o objetivo; 你是什么时候到的 pergunta o momento.',tip:'是 pode ser omitido em afirmações e perguntas; na negação desse padrão, mantenha 不是.',examples:['我们是来旅游的。','苹果在哪儿买的？','我们不是坐出租车去的。']},
 {title:'3. 请 / 让 / 叫 + pessoa + ação',text:'A pessoa depois de 请、让 ou 叫 é quem realiza a ação seguinte: 王老师让我们说中文. 请 é cortês; 让 e 叫 podem pedir, mandar ou permitir conforme o contexto.',tip:'Não traduza 叫 sempre como chamar pelo nome. Em 妈妈叫孩子们回家, a mãe manda que as crianças voltem.',examples:['我想请你帮个忙。','王老师让我们说中文。','妈妈叫孩子们回家。']},
 ],checks:[
 {q:'Quem foi buscar as alunas?',options:['Wang Yixue','Wang Yifei','Li Wen','Chen Tianzhong'],correct:0,explanation:'Wang Yixue foi ao aeroporto a pedido de Yifei.'},
 {q:'Qual é o objetivo da visita?',options:['Trabalhar','Passear','Mudar de escola','Consultar o médico'],correct:1,explanation:'我们是来旅游的。'},
 {q:'Quando Bai Jiayue chegou?',options:['Ontem à noite','Amanhã cedo','Hoje de manhã','Ontem ao meio-dia'],correct:2,explanation:'我是今天早上到的。'},
 {q:'Quem pode ajudar Chen Tianzhong?',options:['Annie','Liu Ming','Wang Yixue','Li Wen'],correct:3,explanation:'Li Wen ainda está na escola.'},
 {q:'已经 é...',options:['já','ainda não','talvez','sempre'],correct:0,explanation:'我已经到北京了 = já cheguei a Pequim.'},
 {q:'O 吧 de 你是老师吧？ indica...',options:['ordem','suposição','ação concluída','quantidade'],correct:1,explanation:'É uma pergunta de confirmação de suposição.'},
 {q:'No texto 4, o que elas comeram?',options:['Jiaozi','Pão','Pato à Pequim','Macarrão'],correct:2,explanation:'她请我们吃了北京烤鸭。'},
 {q:'Em 王老师让我们说中文, quem deve falar?',options:['Só a professora','Só Li Wen','A mãe','Nós'],correct:3,explanation:'我们 é o objeto de 让 e sujeito da ação 说中文.'},
 ],writing:[['我们是来旅游的。','Destaque o objetivo da visita.'],['我们不是坐出租车去的。','Negue o modo de transporte dentro da estrutura de foco.'],['我想请你帮个忙。','Pedido cortês seguido da pessoa que ajudará.'],['王老师让我们说中文。','A professora pede que outra pessoa realize a ação.'],['妈妈叫孩子们回家。','A mãe manda as crianças fazerem algo.'],['你是什么时候到的？','Pergunte o momento com foco no detalhe.'],['你们是第一次来北京吗？','Pergunte se é a primeira visita.'],['是的，我们都是第一次来。','Responda sobre as duas pessoas.'],['不好意思，天中，我已经到北京了。','Desculpa, nome da pessoa e chegada já realizada.'],['好的，那我给他打个电话。','Aceite e indique a próxima ação.'],['她唱歌很好听吧？','Confirme uma impressão sobre o canto.'],['陈天中是泰国人吧？','Faça uma suposição sobre nacionalidade.']],prompts:'Apresente-se ao chegar, diga quando chegou e para quê veio. Peça a alguém que ajude um amigo.',promptsChinese:'你是什么时候到的？ · 你是来旅游的吗？ · 我想请你帮个忙。',notes:'O livro usa 姐姐 para Wang Yixue, embora apresente as personagens como primas: a tradução conserva o tratamento de irmã mais velha usado no diálogo. O texto 4 relata uma refeição que já aconteceu; não um plano futuro.'});
