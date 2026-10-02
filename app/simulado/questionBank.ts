// Server-side only: original educational items. Never import this bank into a client component.
import type { Level, PrivateQuestion, Picture, Section } from './types.ts';
export const BANK_VERSION = 'hsk30-2026-original-v1';
export const bank: PrivateQuestion[] = [];
const image=(sheet: Picture['sheet'],cell: number): Picture=>({sheet,cell});
const B=Array.from({length:9},(_,i)=>image('basic',i));
const D=Array.from({length:9},(_,i)=>image('daily',i));
const A=Array.from({length:9},(_,i)=>image('advanced',i));
const instructions={
  listenImage:['Ouça e escolha a imagem correspondente.','听录音，选择相符的图片。'],
  listen:['Ouça e escolha a resposta correta.','听录音，选择正确答案。'],
  readImage:['Leia e escolha a imagem correspondente.','看句子，选择相符的图片。'],
  match:['Associe a frase ao trecho adequado. Uma alternativa sobra em cada grupo.','选择合适的句子进行搭配。'],
  fill:['Escolha a palavra que completa a lacuna.','选择合适的词语填空。'],
  read:['Leia o texto e responda à pergunta.','阅读短文，选择正确答案。'],
  component:['Escolha o componente que completa o caractere indicado.','选择合适的部件，组成正确的汉字。'],
  character:['Escreva em caracteres simplificados a palavra indicada pelo pinyin.','根据拼音写出正确的汉字。'],
  sentence:['Escreva uma frase sobre a imagem usando a palavra indicada.','根据图片和所给词语写一句话。'],
};
function add(level: Level,section: Section,part: string,kind: PrivateQuestion['kind'],instruction: keyof typeof instructions,stem: string,correct: string,explanation: string,extra: Partial<PrivateQuestion>={}){
  const number=bank.filter(q=>q.level===level).length+1;
  const id=`h${level}-${String(number).padStart(2,'0')}`;
  bank.push({id,level,section,part,kind,instruction:instructions[instruction][0],instructionZh:instructions[instruction][1],stem,correct,explanation,topic:'Cotidiano',...extra,...(section==='listening'?{audio:`/audio/simulado/${id}.mp3`}:{})});
}
type TextRow=[string,string,string[],string,string?]; // stem / correct / alternatives / explanation / transcript
function choices(level: Level,section: Section,part: string,instruction: keyof typeof instructions,rows: TextRow[]){
  for(const [stem,correct,alternatives,explanation,transcript] of rows)add(level,section,part,'choice',instruction,stem,'o'+alternatives.indexOf(correct),explanation,{options:alternatives.map((text,i)=>({id:'o'+i,text})),transcript});
}
type ImageRow=[string,Picture,string,string?];
function pictures(level: Level,section: Section,part: string,rows: ImageRow[],pool: Picture[],group?: string){
  for(const [stem,picture,explanation,transcript] of rows){const index=pool.findIndex(p=>p.sheet===picture.sheet&&p.cell===picture.cell);if(index<0)throw Error('Picture missing from pool');add(level,section,part,'choice',section==='listening'?'listenImage':'readImage',stem,'o'+index,explanation,{options:pool.map((picture,i)=>({id:'o'+i,picture})),transcript,group});}
}
function matching(level: Level,part: string,rows: [string,number,string][],pool:string[],group: string){
  for(const [stem,index,explanation] of rows)add(level,'reading',part,'choice','match',stem,'o'+index,explanation,{options:pool.map((text,i)=>({id:'o'+i,text})),group});
}
function writing(level: Level,part: string,rows: [string,string,string][]){for(const [stem,correct,explanation] of rows)add(level,'writing',part,'character','character',stem,correct,explanation);}

// HSK 1: 4×5 listening + 4×5 reading.
for(const [script,correct,pool,explanation] of [
  ['桌子上有三个苹果。',B[0],[B[0],B[1],B[2]],'三个苹果 = três maçãs.'],
  ['我想喝一杯茶。',B[1],[B[2],B[1],B[6]],'一杯茶 = uma xícara de chá.'],
  ['这是我的书。',B[2],[B[1],B[6],B[2]],'书 significa livro.'],
  ['小猫在桌子下。',B[3],[B[3],B[4],B[5]],'下 indica embaixo.'],
  ['他正在看书。',B[4],[B[7],B[8],B[4]],'正在看书 = está lendo.'],
] as [string,Picture,Picture[],string][] )pictures(1,'listening','L1',[['',correct,explanation,script]],pool);
choices(1,'listening','L2','listen',[
  ['', '四口人',['三口人','四口人','五口人'],'四口人 = quatro pessoas.','我家有四口人。'],
  ['', '九点',['七点','八点','九点'],'九点 = nove horas.','现在九点。'],
  ['', '老师',['老师','医生','学生'],'老师 significa professor.','王先生是我的中文老师。'],
  ['', '很冷',['很热','很冷','下雨'],'很冷 = muito frio.','今天天气很冷。'],
  ['', '十元',['五元','二十元','十元'],'十元 = dez yuans.','这本书十元。'],
]);
pictures(1,'listening','L3',[
  ['',B[6],'吃米饭 = comer arroz.','你想吃什么？|我想吃米饭。'],
  ['',B[7],'医生 = médico.','你爸爸做什么工作？|他是医生。'],
  ['',B[5],'妈妈 e 孩子 indicam a mãe e as crianças.','这是谁？|这是我妈妈，她有两个孩子。'],
  ['',B[8],'睡觉 = dormir.','妹妹在哪儿？|她在家睡觉。'],
  ['',B[3],'小猫 está embaixo da mesa.','猫在哪儿？|在桌子下。'],
],[B[3],B[5],B[6],B[7],B[8],B[4]],'h1-l3');
choices(1,'listening','L4','listen',[
  ['', '学校',['医院','学校','商店'],'上课 acontece na escola.','我今天去学校上课。|他今天去哪儿？'],
  ['', '牛奶',['水','茶','牛奶'],'A bebida mencionada é 牛奶, leite.','早上我喝牛奶，不喝茶。|他早上喝什么？'],
  ['', '星期日',['星期日','星期一','星期五'],'星期日 = domingo.','今天星期日，我休息。|今天星期几？'],
  ['', '姐姐',['妹妹','妈妈','姐姐'],'姐姐 = irmã mais velha.','我姐姐今年二十岁。|谁今年二十岁？'],
  ['', '两本',['一本','两本','三本'],'两本 = dois livros.','桌子上有两本中文书。|桌子上有几本书？'],
]);
pictures(1,'reading','R1',[
  ['妈妈和孩子在一起。',B[5],'A mãe está com duas crianças.'],['这个人是医生。',B[7],'医生 = médico.'],['他在吃饭。',B[6],'吃饭 = comer uma refeição.'],['她在睡觉。',B[8],'睡觉 = dormir.'],['茶在杯子里。',B[1],'A xícara contém chá.'],
],[B[5],B[7],B[6],B[8],B[1],B[2]],'h1-r1');
matching(1,'R2',[
  ['你叫什么名字？',0,'Pergunta pelo nome.'],['你家有几口人？',1,'Pergunta quantas pessoas há na família.'],['这本书多少钱？',2,'Pergunta o preço do livro.'],['你想喝什么？',3,'Pergunta qual bebida deseja.'],['谢谢你！',4,'不客气 responde ao agradecimento.'],
],['我叫小李。','有三口人。','二十元。','我想喝水。','不客气！','他在医院。'],'h1-r2');
choices(1,'reading','R3','fill',[
  ['我（　）李明。','叫',['喝','叫','坐'],'叫 introduz o nome.'],
  ['爸爸（　）学校工作。','在',['和','有','在'],'在 indica o local.'],
  ['桌子上（　）一本书。','有',['有','是','会'],'有 expressa existência.'],
  ['你（　）吃什么？','想',['读','想','写'],'想 expressa desejo.'],
  ['我（　）她都是学生。','和',['在','和','也'],'和 conecta 我 e 她.'],
]);
choices(1,'reading','R4','read',[
  ['小张是学生。他今天上午学习中文。\n小张上午做什么？','学习中文',['看电影','学习中文','睡觉'],'O texto diz 上午学习中文.'],
  ['妈妈去商店买苹果。\n妈妈买什么？','苹果',['衣服','书','苹果'],'买苹果 = comprar maçãs.'],
  ['今天星期六，明天我去看老师。\n我什么时候去看老师？','明天',['明天','今天','昨天'],'明天 = amanhã.'],
  ['我有一个哥哥，没有姐姐。\n我有谁？','一个哥哥',['一个姐姐','一个哥哥','两个哥哥'],'有一个哥哥 = tenho um irmão mais velho.'],
  ['这家饭店的米饭很好吃，也很便宜。\n米饭怎么样？','好吃，便宜',['不好吃','很贵','好吃，便宜'],'好吃 e 便宜 = gostoso e barato.'],
]);

// HSK 2: listening 5+10+10; reading 5+5+10+5; writing 5+5.
for(const [script,correct,pool,explanation] of [
  ['我每天坐公交车去学校。',D[0],[D[0],D[5],D[8]],'公交车 = ônibus.'],
  ['她喜欢踢足球。',D[1],[D[4],D[1],D[8]],'踢足球 = jogar futebol.'],
  ['外面下雨了。',D[2],[D[5],D[3],D[2]],'下雨 = chover.'],
  ['她正在买衣服。',D[3],[D[3],D[6],D[7]],'买衣服 = comprar roupa.'],
  ['他正在游泳。',D[4],[D[1],D[4],D[8]],'游泳 = nadar.'],
] as [string,Picture,Picture[],string][] )pictures(2,'listening','L1',[['',correct,explanation,script]],pool);
pictures(2,'listening','L2',[
  ['',D[5],'飞机 indica avião.','你怎么去中国？|我坐飞机去。'],
  ['',D[6],'做饭 = cozinhar.','爸爸在做什么？|他在做饭。'],
  ['',D[7],'喝水 = beber água.','你想喝茶吗？|不，我想喝水。'],
  ['',B[4],'看书 = ler.','他现在做什么？|他在看书。'],
  ['',D[0],'公交车 = ônibus.','你坐飞机去机场吗？|不，我坐公交车去。'],
],[D[0],D[5],D[6],D[7],B[4],D[1]],'h2-l2a');
pictures(2,'listening','L2',[
  ['',D[1],'正在踢足球 = jogando futebol.','妹妹在哪儿？|在学校踢足球呢。'],
  ['',D[2],'A pessoa está na chuva.','外面怎么样？|下雨了，你等一会儿再出门吧。'],
  ['',D[3],'A mulher escolhe uma roupa na loja.','你喜欢哪件衣服？|这件，我要买它。'],
  ['',D[4],'游泳 = nadar.','他周末做什么运动？|他常常游泳。'],
  ['',B[4],'看书 = ler.','那个学生在做什么？|他在看书。'],
],[D[1],D[2],D[3],D[4],B[4],D[6]],'h2-l2b');
choices(2,'listening','L3','listen',[
  ['', '地铁',['出租车','地铁','公交车'],'A escolha é o metrô.','你坐公交车去吗？|不，地铁很快，我坐地铁。|怎么去？'],
  ['', '十点',['九点','十一点','十点'],'十点 = dez horas.','电影几点开始？|十点，还有半个小时。|电影几点开始？'],
  ['', '太贵了',['太贵了','不好看','太小了'],'A razão é 太贵, caro demais.','你为什么不买这件衣服？|很好看，但是太贵了。|她为什么不买？'],
  ['', '左边',['右边','左边','前面'],'A localização é 左边, esquerda.','洗手间在哪儿？|在左边，过了门就是。|洗手间在哪儿？'],
  ['', '生病了',['去旅游了','去学校了','生病了'],'生病 indica doença.','你怎么没去上班？|我生病了，今天在家休息。|他为什么没去上班？'],
  ['', '三年',['三年','两年','一年'],'三年 = três anos.','你学习中文多久了？|三年了。|他学了多久？'],
  ['', '跑步',['游泳','跑步','踢足球'],'Ele corre todas as manhãs.','你经常运动吗？|是的，每天早上跑步。|他每天做什么运动？'],
  ['', '妈妈',['老师','爸爸','妈妈'],'妈妈送的 = presente da mãe.','你的书包真好看。谁给你买的？|是妈妈送我的。|谁送了书包？'],
  ['', '下雨了',['没有时间','下雨了','很累'],'Ele não vai à escola por causa da chuva.','今天去学校吗？|不去了，因为下雨了。|为什么不去学校？'],
  ['', '咖啡',['牛奶','水','咖啡'],'A escolha final é café.','喝茶还是喝咖啡？|我想喝咖啡。|他想喝什么？'],
]);
pictures(2,'reading','R1',[
  ['他正在游泳。',D[4],'游泳 = nadar.'],['她在喝水。',D[7],'喝水 = beber água.'],['外面下雨了。',D[2],'A figura representa chuva.'],['他在家做饭。',D[6],'做饭 = cozinhar.'],['她在商店买衣服。',D[3],'A mulher compra roupa.'],
],[D[4],D[7],D[2],D[6],D[3],D[0]],'h2-r1');
choices(2,'reading','R2','fill',[
  ['我每天（　）七点起床。','都',['都','还是','比'],'每天都 = todos os dias.'],
  ['我家（　）学校很近。','离',['着','离','地'],'离 introduz a distância.'],
  ['（　）下雨了，所以我们不出门。','因为',['但是','虽然','因为'],'因为…所以… = causa e consequência.'],
  ['哥哥（　）我高。','比',['比','从','让'],'比 forma uma comparação.'],
  ['我去（　）北京，那里很漂亮。','过',['着','过','地'],'过 marca experiência passada.'],
]);
matching(2,'R3',[
  ['你为什么学中文？',0,'A resposta explica a razão.'],['你家离学校远吗？',1,'A resposta descreve a distância.'],['你几点回来？',2,'A resposta dá o horário.'],['你去过北京吗？',3,'A resposta relata experiência.'],['你觉得这件衣服怎么样？',4,'A resposta avalia a roupa.'],
],['因为我喜欢中文。','不远，走路十分钟。','晚上八点。','去过两次。','很漂亮，也不贵。','我正在喝水。'],'h2-r3a');
matching(2,'R3',[
  ['你的生日是什么时候？',0,'生日 pede a data de aniversário.'],['你最喜欢什么运动？',1,'A resposta dá o esporte favorito.'],['你怎么去机场？',2,'A resposta dá o meio de transporte.'],['这道题你会做吗？',3,'A resposta admite dificuldade.'],['你想喝茶还是咖啡？',4,'A resposta escolhe uma bebida.'],
],['五月三日。','我最喜欢游泳。','坐地铁去。','不会，请你帮我。','我想喝茶。','那个人是我哥哥。'],'h2-r3b');
choices(2,'reading','R4','read',[
  ['小李每天坐公交车上班，今天因为下雨，他打车去了。\n小李今天怎么去上班？','打车',['打车','坐公交车','走路'],'今天 distingue o táxi da rotina de ônibus.'],
  ['这件衣服虽然有点儿贵，但是我很喜欢它的颜色，所以买了。\n她为什么买衣服？','喜欢颜色',['很便宜','喜欢颜色','朋友送的'],'A cor motivou a compra, apesar do preço.'],
  ['我去年不会游泳，现在每周都去学，已经会了。\n他现在：','会游泳',['不会游泳','不学游泳','会游泳'],'现在 e 已经会了 indicam habilidade adquirida.'],
  ['老师让我们明天早上九点到学校，不要晚到。\n我们什么时候到学校？','明天九点',['明天九点','今天九点','明天十点'],'O horário pedido é amanhã às nove.'],
  ['妈妈的生日快到了，我准备买一个包送给她。\n他准备给妈妈买什么？','一个包',['一件衣服','一个包','一本书'],'买一个包 = comprar uma bolsa.'],
]);
choices(2,'writing','W1','component',[
  ['hǎo · 女 +（　）','子',['木','子','月','马','日','尔'],'女 + 子 forma 好.'],
  ['ma · 口 +（　）','马',['木','子','月','马','日','尔'],'口 + 马 forma 吗.'],
  ['nǐ · 亻 +（　）','尔',['木','子','月','马','日','尔'],'亻 + 尔 forma 你.'],
  ['xiū · 亻 +（　）','木',['木','子','月','马','日','尔'],'亻 + 木 forma 休.'],
  ['míng · 日 +（　）','月',['木','子','月','马','日','尔'],'日 + 月 forma 明.'],
]);
writing(2,'W2',[
  ['我想喝一杯（chá）。','茶','chá = 茶, chá.'],['今天是我的（shēng rì）。','生日','生日 = aniversário.'],['这本书的（yán sè）很好看。','颜色','颜色 = cor.'],['我在学校（xué xí）中文。','学习','学习 = estudar.'],['我坐（dì tiě）去机场。','地铁','地铁 = metrô.'],
]);

// HSK 3: 3×10 listening, 3×10 reading, 2×5 writing.
pictures(3,'listening','L1',[
  ['',A[0],'开会 = estar em reunião.','经理在哪儿？|他正在开会，下午回来。'],
  ['',A[1],'拍照 = fotografar.','她拿着相机做什么？|她在公园里拍照。'],
  ['',A[2],'住院 = estar internado.','你爷爷怎么样了？|他生病了，正在医院住院。'],
  ['',A[3],'羽毛球 = badminton.','你们周末做什么？|我们一起打羽毛球。'],
  ['',A[4],'打扫 = limpar.','小王在做什么？|他在打扫房间。'],
],[A[0],A[1],A[2],A[3],A[4],D[6]],'h3-l1a');
pictures(3,'listening','L1',[
  ['',A[5],'A mulher procura o telefone embaixo do sofá.','你在找什么？|我的手机不见了，我看看沙发下面。'],
  ['',A[6],'看电影 = assistir a um filme.','他们晚上去哪儿？|他们去电影院看电影。'],
  ['',A[7],'教中文 = ensinar chinês.','那位老师正在做什么？|她正在教学生中文。'],
  ['',A[8],'在公园走路 = caminhar no parque.','你们在哪儿？|我们在公园里走路。'],
  ['',D[8],'骑自行车 = andar de bicicleta.','你怎么去公司？|我每天骑自行车去。'],
],[A[5],A[6],A[7],A[8],D[8],A[1]],'h3-l1b');
choices(3,'listening','L2','listen',[
  ['', '发烧了',['发烧了','车坏了','去旅游了'],'发烧 = ter febre; por isso pediu licença.','你今天怎么没去上班？|我发烧了，已经请假了。|男的为什么没上班？'],
  ['', '坐地铁',['开车','坐地铁','坐飞机'],'A mudança foi para o metrô por causa do trânsito.','你最近还开车上班吗？|不开了，路上车太多，我改坐地铁了。|男的现在怎么上班？'],
  ['', '凉快',['很热','很冷','凉快'],'凉快 = fresco, agradável.','你喜欢秋天吗？|喜欢，秋天天气凉快。|他觉得秋天怎么样？'],
  ['', '三楼',['三楼','一楼','二楼'],'三楼 = terceiro andar.','会议在哪儿？|在三楼会议室，九点开始。|会议在几楼？'],
  ['', '历史',['音乐','历史','体育'],'历史 = história.','你最近看什么书？|一本关于中国历史的书。|这本书和什么有关？'],
  ['', '自行车坏了',['下雨了','没有时间','自行车坏了'],'A bicicleta quebrada explica a espera.','你怎么还没出发？|我的自行车坏了，正在等公交车。|他为什么没出发？'],
  ['', '周末',['周末','工作日','明年'],'A escolha de horário é o fim de semana.','你什么时候有时间见面？|这周工作很忙，周末可以。|他们什么时候见面？'],
  ['', '便宜又好吃',['很贵','便宜又好吃','很远'],'不但便宜，而且好吃 = barato e gostoso.','这家饭店怎么样？|不但便宜，而且很好吃。|他觉得饭店怎么样？'],
  ['', '把书放在桌上',['把书放在椅子上','把书给朋友','把书放在桌上'],'A instrução usa 把 + livro + colocar + local.','这本书放在哪里？|请把它放在老师的桌子上。|男的让她做什么？'],
  ['', '手机丢了',['手机丢了','手机没电了','手机很旧'],'丢了 = perdeu.','你为什么这么着急？|我的手机丢了，里面有重要的号码。|他为什么着急？'],
]);
choices(3,'listening','L3','listen',[
  ['', '明天下午',['明天上午','明天下午','今天晚上'],'A viagem foi adiada para amanhã à tarde.','我们本来想今天去公园，可是一直下雨。大家决定明天下午再去，希望天气会好一点儿。|他们什么时候去公园？'],
  ['', '坐地铁比较快',['公交车便宜','他不会开车','坐地铁比较快'],'Ele escolhe o metrô por ser mais rápido.','小刘以前每天开车上班。最近路上的车太多，常常迟到。坐地铁只要二十分钟，所以他现在坐地铁。|他为什么改坐地铁？'],
  ['', '汉语老师',['汉语老师','医生','经理'],'A profissão mencionada é professora de chinês.','我姐姐在学校工作，是汉语老师。她每天准备课文，还要检查学生的作业。虽然很忙，但她很喜欢这份工作。|姐姐做什么工作？'],
  ['', '先吃饭，再学习',['先学习，再吃饭','先吃饭，再学习','不吃饭'],'先…然后… estabelece a ordem.','今天晚上我有很多作业。我打算先吃饭，然后学习两个小时。完成作业以后，再给朋友打电话。|他先做什么，再做什么？'],
  ['', '照片',['衣服','书','照片'],'照片 = fotografias.','小陈对拍照很感兴趣。每次出去旅游，他都会带上相机。回来以后，他把照片发给朋友，大家都很喜欢。|小陈发给朋友什么？'],
  ['', '运动和休息',['只工作','运动和休息','少喝水'],'O conselho é atividade física e descanso.','医生说，身体健康很重要。除了注意吃饭以外，还应该经常运动，也要注意休息。|我们应该做什么？'],
  ['', '门口',['门口','楼上','房间里'],'门口 = entrada.','欢迎参加今天的活动。活动三点开始，请大家两点半在门口见面。到了以后，先找老师，再一起进去。|大家在哪里见面？'],
  ['', '老师的帮助',['书很贵','每天休息','老师的帮助'],'老师帮助她解决问题.','以前我觉得汉语很难，有些句子总是听不懂。老师经常帮助我解决问题。现在我能听懂越来越多的内容了。|谁帮助了她？'],
  ['', '网上买票',['网上买票','在机场买票','请老师买票'],'网上买票 = comprar passagem online.','下个星期我们要去北京。火车票已经在网上买好了。出发那天，请带好护照，早点儿到车站。|火车票怎么买的？'],
  ['', '忘记带伞',['伞坏了','忘记带伞','不喜欢雨'],'Ele não tinha guarda-chuva porque esqueceu.','我上午出门时天气很好，所以忘记带伞了。下午突然下雨，我只好在商店门口等，后来朋友来接我。|他为什么在商店门口等？'],
]);
matching(3,'R1',[
  ['你怎么还没回家？',0,'A resposta explica a permanência.'],['明天的会议几点开始？',1,'Pergunta de horário.'],['这本书是关于什么的？',2,'Pergunta sobre o tema do livro.'],['你为什么学汉语？',3,'Pergunta a motivação.'],['你的手机找到了吗？',4,'Pergunta se encontrou o telefone.'],
],['我的工作还没完成。','上午九点，别迟到。','中国的历史和文化。','我对中国文化很感兴趣。','找到了，在沙发下面。','她是我的邻居。'],'h3-r1a');
matching(3,'R1',[
  ['请把这些书放好。',0,'A resposta aceita o pedido e indica o local.'],['你怎么换了上班的方法？',1,'A resposta explica a mudança no transporte.'],['你周末愿意参加比赛吗？',2,'A resposta aceita o convite.'],['我有点儿担心明天的考试。',3,'A resposta tranquiliza.'],['你以前去过这个城市吗？',4,'A resposta informa a experiência anterior.'],
],['好的，我放在桌子上。','路上车太多，地铁更方便。','愿意，我很喜欢运动。','别担心，你已经认真复习了。','去过两次，这是第三次。','这件衬衫是蓝色的。'],'h3-r1b');
choices(3,'reading','R2','fill',[
  ['请你（　）书放在桌子上。','把',['被','把','比'],'把 + objeto + verbo + complemento.'],
  ['（　）明天天气好，我们就去公园。','如果',['如果','除了','而且'],'如果…就… expressa condição.'],
  ['（　）今天下雨，我们还是去学校了。','虽然',['因为','如果','虽然'],'虽然 introduz contraste com 还是.'],
  ['他一边吃饭，（　）看电视。','一边',['为了','一边','只有'],'一边…一边… = ações simultâneas.'],
  ['我的手机（　）弟弟拿走了。','被',['被','把','从'],'被 marca a voz passiva.'],
  ['她不但会唱歌，（　）会跳舞。','而且',['所以','但是','而且'],'不但…而且… = não só… mas também.'],
  ['（　）学好汉语，我每天都练习。','为了',['关于','为了','除了'],'为了 introduz a finalidade.'],
  ['你的汉语说得越来越（　）了。','好',['好','最','把'],'越来越好 = cada vez melhor.'],
  ['（　）这张地图，我们应该往左走。','根据',['为了','被','根据'],'根据 = de acordo com.'],
  ['我觉得这个问题很容易（　）。','解决',['发生','解决','参加'],'解决问题 = resolver um problema.'],
]);
choices(3,'reading','R3','read',[
  ['通知：明天上午九点在三楼会议室开会，请大家不要迟到。\n会议在哪里？','三楼会议室',['一楼教室','三楼会议室','公司门口'],'O aviso especifica 三楼会议室.'],
  ['小王以前开车上班。最近路上车很多，他开始坐地铁了。\n他为什么改坐地铁？','路上车很多',['不会开车','地铁很远','路上车很多'],'O congestionamento motivou a mudança.'],
  ['这家饭店不但便宜，而且菜很好吃。虽然地方不大，但是每天客人很多。\n饭店怎么样？','便宜又好吃',['便宜又好吃','很大很贵','没有客人'],'不但…而且… reúne as duas qualidades.'],
  ['为了提高汉语水平，小李每天听新闻，周末还和朋友用汉语聊天儿。\n小李为什么这样做？','提高汉语水平',['找工作','提高汉语水平','准备旅游'],'为了 introduz o objetivo.'],
  ['小陈昨天把手机放在办公室了。今天早上到了公司以后，他才找到手机。\n手机在哪里？','办公室',['家里','车上','办公室'],'O telefone estava no escritório.'],
  ['如果周末下雨，我们就在家看电影；如果天气好，就去公园。\n下雨时他们打算做什么？','在家看电影',['在家看电影','去公园','去学校'],'A primeira condição corresponde a chuva.'],
  ['妈妈生病住院了。爸爸每天去医院照顾她，我放学后也去看她。\n妈妈为什么在医院？','生病了',['在那里工作','生病了','去看朋友'],'生病住院 = internação por doença.'],
  ['那本电子书很方便，出门不用带很重的书。我在手机上就能看。\n他觉得电子书有什么好处？','出门不用带重书',['只能在家看','没有内容','出门不用带重书'],'A vantagem é não carregar livros pesados.'],
  ['小刘已经完成了作业，可是还没检查。老师说，做完以后应该认真检查一次。\n小刘接下来应该做什么？','检查作业',['检查作业','开始做作业','放弃作业'],'已完成, mas falta 检查.'],
  ['以前这个公园很安静。最近附近开了一家商店，来这里的人越来越多。\n公园有什么变化？','人越来越多',['人越来越少','人越来越多','商店关了'],'越来越多 marca aumento.'],
]);
writing(3,'W1',[
  ['过马路的时候，要（zhù yì）安全。','注意','注意 = prestar atenção.'],['我（gāng cái）给老师打了电话。','刚才','刚才 = agora há pouco.'],['我们需要一个解决问题的（fāng fǎ）。','方法','方法 = método.'],['今天的作业已经（wán chéng）了。','完成','完成 = concluir.'],['我对中国文化很感（xìng qù）。','兴趣','兴趣 = interesse; 感兴趣 = interessar-se.'],
]);
for(const [picture,keyword,models,explanation] of [
  [D[8],'自行车',['他每天骑自行车上班。','他正在骑自行车。'],'Descreva a pessoa andando de bicicleta e use 自行车.'],
  [A[1],'拍照',['她在公园里拍照。','她正在拍照。'],'Descreva a mulher fotografando e use 拍照.'],
  [A[2],'住院',['他生病住院了。','他正在医院住院。'],'Descreva a internação e use 住院.'],
  [A[3],'羽毛球',['他们一起打羽毛球。','他们正在打羽毛球。'],'Descreva os jogadores de badminton e use 羽毛球.'],
  [A[4],'打扫',['他正在打扫房间。','他在家里打扫。'],'Descreva a limpeza e use 打扫.'],
] as [Picture,string,string[],string][] )add(3,'writing','W2','sentence','sentence',`词语：${keyword}`,models[0],explanation,{picture,keyword,models,topic:'Produção escrita'});
