import type { StudyItem, StudyGroup } from './lesson11Data';
const items = (prefix: string, rows: Array<[string,string,string,string?]>): StudyItem[] => rows.map(([hanzi,pinyin,meaning,speaker],i) => ({id:`l15-${prefix}-${i+1}`,hanzi,pinyin,meaning,...(speaker ? {speaker} : {})}));
export const LESSON15_GROUPS: StudyGroup[] = [
 {id:'l15-vocabulary',name:'Vocabulário · 17 entradas',label:'生词 · shēngcí',description:'As 17 entradas da lição, na ordem das páginas 113, 115 e 117.',items:items('v',[
 ['爱','ài','gostar muito'],['哪个','nǎ ge','qual'],['去年','qùnián','ano passado'],['男朋友','nánpéngyou','namorado'],['几','jǐ','alguns: quantidade indefinida'],['年','nián','ano'],['好玩儿','hǎowánr','divertido'],['飞机','fēijī','avião'],['要','yào','levar: duração necessária'],['小时','xiǎoshí','hora: duração'],['家人','jiārén','familiares'],['时间','shíjiān','tempo'],['机场','jīchǎng','aeroporto'],['接','jiē','buscar alguém'],['住','zhù','morar ou hospedar-se'],['早','zǎo','cedo'],['那','nà','então'],
 ])},
 {id:'l15-places',name:'Lugares · 3 nomes',label:'专有名词',description:'Os nomes próprios destacados no livro.',items:items('places',[
 ['西安',"Xī’ān",'Xi’an'],['北京','Běijīng','Pequim'],['大兴机场','Dàxīng Jīchǎng','Aeroporto de Daxing'],
 ])},
 {id:'l15-text1',name:'Diálogo 1 · Comida chinesa',label:'课文一 · kèwén yī',description:'Na casa de Li Wen, os amigos provam comida chinesa. Páginas 113–114.',items:items('d1',[
 ['你们爱吃哪个菜？','nǐmen ài chī nǎ ge cài?','De qual prato vocês gostam?','李文 · Li Wen'],
 ['我喜欢这个，也喜欢那个。','wǒ xǐhuan zhè ge, yě xǐhuan nà ge.','Gosto deste e também daquele.','白家月 · Bai Jiayue'],
 ['这些菜都好吃，还很好看。','zhèxiē cài dōu hǎochī, hái hěn hǎokàn.','Todos estes pratos são gostosos e também muito bonitos.','陈天中 · Chen Tianzhong'],
 ['我爱吃中国菜，也喜欢做。大家多吃点儿。','wǒ ài chī Zhōngguó cài, yě xǐhuan zuò. dàjiā duō chī diǎnr.','Gosto muito de comer comida chinesa e também de prepará-la. Pessoal, comam mais um pouco.','李文 · Li Wen'],
 ])},
 {id:'l15-text2',name:'Diálogo 2 · Planos de viagem',label:'课文二 · kèwén èr',description:'Durante a refeição, os amigos falam sobre viagens. Páginas 114–115.',items:items('d2',[
 ['你们都想去哪儿？','nǐmen dōu xiǎng qù nǎr?','Aonde vocês todos querem ir?','李文 · Li Wen'],
 ['去年我和男朋友去了西安，今年我想去北京。',"qùnián wǒ hé nánpéngyou qù le Xī’ān, jīnnián wǒ xiǎng qù Běijīng.",'Ano passado fui a Xi’an com meu namorado; este ano quero ir a Pequim.','安妮 · Annie'],
 ['前几年我去了西安，非常好玩儿。今年我也想去北京。',"qián jǐ nián wǒ qù le Xī’ān, fēicháng hǎowánr. jīnnián wǒ yě xiǎng qù Běijīng.",'Há alguns anos fui a Xi’an; foi muito divertido. Este ano também quero ir a Pequim.','白家月 · Bai Jiayue'],
 ['我和王老师都是北京人，北京非常漂亮。','wǒ hé Wáng lǎoshī dōu shì Běijīng rén, Běijīng fēicháng piàoliang.','Eu e a professora Wang somos de Pequim; Pequim é muito bonita.','李文 · Li Wen'],
 ])},
 {id:'l15-text3',name:'Diálogo 3 · Encontro no aeroporto',label:'课文三 · kèwén sān',description:'Fora da sala de aula, as viajantes combinam a chegada com a professora. Páginas 116–117.',items:items('d3',[
 ['你们的飞机到北京要几个小时？','nǐmen de fēijī dào Běijīng yào jǐ ge xiǎoshí?','Quantas horas o voo de vocês leva para chegar a Pequim?','王一飞 · Wang Yifei'],
 ['九个小时。','jiǔ ge xiǎoshí.','Nove horas.','白家月 · Bai Jiayue'],
 ['我家人都在北京，星期天我姐姐也有时间，她可以去机场接你们，你们也可以住我家。','wǒ jiārén dōu zài Běijīng, xīngqītiān wǒ jiějie yě yǒu shíjiān, tā kěyǐ qù jīchǎng jiē nǐmen, nǐmen yě kěyǐ zhù wǒ jiā.','Todos os meus familiares estão em Pequim. No domingo minha irmã mais velha também tem tempo; ela pode buscar vocês no aeroporto, e vocês também podem ficar na minha casa.','王一飞 · Wang Yifei'],
 ['我们星期日早上八点到大兴机场，早不早？','wǒmen xīngqīrì zǎoshang bā diǎn dào Dàxīng Jīchǎng, zǎo bu zǎo?','Chegamos ao Aeroporto de Daxing no domingo às oito da manhã. É cedo?','安妮 · Annie'],
 ['不早。','bù zǎo.','Não é cedo.','王一飞 · Wang Yifei'],
 ['谢谢老师！那我们和您姐姐在大兴机场见！','xièxie lǎoshī! nà wǒmen hé nín jiějie zài Dàxīng Jīchǎng jiàn!','Obrigada, professora! Então nos encontramos com sua irmã no Aeroporto de Daxing!','白家月 · Bai Jiayue'],
 ])},
 {id:'l15-patterns',name:'Estruturas · Também e viagens',label:'练习 · liànxí',description:'Modelos gramaticais do livro e exemplos complementares identificados para o treino.',items:items('p',[
 ['我喜欢这个，也喜欢那个。','wǒ xǐhuan zhè ge, yě xǐhuan nà ge.','Gosto deste e também daquele.'],
 ['王老师是北京人，李文也是北京人。','Wáng lǎoshī shì Běijīng rén, Lǐ Wén yě shì Běijīng rén.','A professora Wang é de Pequim, e Li Wen também é de Pequim.'],
 ['我喜欢喝中国茶，还喜欢吃中国菜。','wǒ xǐhuan hē Zhōngguó chá, hái xǐhuan chī Zhōngguó cài.','Gosto de beber chá chinês e também de comer comida chinesa.'],
 ['我要去北京。','wǒ yào qù Běijīng.','Pretendo ir a Pequim.'],
 ['到北京要九个小时。','dào Běijīng yào jiǔ ge xiǎoshí.','Leva nove horas para chegar a Pequim.'],
 ['我姐姐有时间。','wǒ jiějie yǒu shíjiān.','Minha irmã mais velha tem tempo.'],
 ['她可以去机场接你们。','tā kěyǐ qù jīchǎng jiē nǐmen.','Ela pode buscar vocês no aeroporto.'],
 ['你们也可以住我家。','nǐmen yě kěyǐ zhù wǒ jiā.','Vocês também podem ficar na minha casa.'],
 ['前几年我去了西安。',"qián jǐ nián wǒ qù le Xī’ān.",'Há alguns anos fui a Xi’an.'],
 ['星期日早上八点。','xīngqīrì zǎoshang bā diǎn.','Domingo às oito da manhã.'],
 ['大家多吃点儿。','dàjiā duō chī diǎnr.','Pessoal, comam mais um pouco.'],
 ['不早。','bù zǎo.','Não é cedo.'],
 ])},
];
export const LESSON15_GRAMMAR = [
 {title:'1. …，还/也…: acrescentar informação',text:'A lição apresenta orações coordenadas com 还 e 也. Ambos podem acrescentar informação: 我喜欢这个，也喜欢那个. O advérbio fica antes do verbo ou predicado, não depois do objeto.',tip:'也 relaciona algo semelhante; 还 pode acrescentar outro aspecto. Não são intercambiáveis em qualquer contexto. Compare a comida ser gostosa e também bonita com duas pessoas serem de Pequim.',examples:['我喜欢这个，也喜欢那个。','王老师是北京人，李文也是北京人。','我喜欢喝中国茶，还喜欢吃中国菜。']},
];
export const LESSON15_QUIZ = [
 {q:'Qual pergunta Li Wen faz durante a refeição?',options:['De qual prato vocês gostam?','Quando vocês vão dormir?','Quanto custa cada prato?','Quem comprou os pratos?'],correct:0,explanation:'你们爱吃哪个菜？'},
 {q:'Bai Jiayue gosta...',options:['só deste prato','deste e também daquele','de nenhum prato','só daquele prato'],correct:1,explanation:'我喜欢这个，也喜欢那个。'},
 {q:'Chen Tianzhong diz que os pratos são...',options:['caros e pequenos','quentes e caros','gostosos e bonitos','baratos e frios'],correct:2,explanation:'这些菜都好吃，还很好看。'},
 {q:'Além de comer comida chinesa, Li Wen gosta de...',options:['vender pratos','comprar chá','viajar de trem','cozinhar'],correct:3,explanation:'也喜欢做 retoma preparar comida chinesa.'},
 {q:'大家多吃点儿。',options:['Pessoal, comam mais um pouco','Pessoal, comam menos','Todos já comeram','Ninguém pode comer'],correct:0,explanation:'多吃点儿 é um convite para comer mais um pouco.'},
 {q:'Annie foi a Xi’an...',options:['este ano sozinha','ano passado com o namorado','amanhã com a irmã','há nove horas'],correct:1,explanation:'去年我和男朋友去了西安。'},
 {q:'今年 significa...',options:['ano passado','amanhã','este ano','ano que vem'],correct:2,explanation:'Compare 去年 e 今年.'},
 {q:'Bai Jiayue visitou Xi’an...',options:['ontem','ano que vem','no domingo','há alguns anos'],correct:3,explanation:'前几年我去了西安。'},
 {q:'O destino desejado neste ano é...',options:['Pequim','Xi’an','Xangai','o Japão'],correct:0,explanation:'Annie e Bai Jiayue querem ir a 北京.'},
 {q:'Li Wen e a professora Wang são...',options:['de Xi’an','de Pequim','de Daxing apenas','de Xangai'],correct:1,explanation:'我和王老师都是北京人。'},
 {q:'O voo leva...',options:['oito horas','sete horas','nove horas','dez horas'],correct:2,explanation:'九个小时。'},
 {q:'要 em 到北京要几个小时 indica...',options:['habilidade aprendida','recusa','posse','tempo necessário'],correct:3,explanation:'Aqui pergunta quanto tempo o trajeto leva.'},
 {q:'Quem pode buscar as viajantes?',options:['A irmã mais velha da professora','O namorado de Annie','Li Wen','Chen Tianzhong'],correct:0,explanation:'我姐姐…她可以去机场接你们。'},
 {q:'Em que dia elas chegam?',options:['Sábado','Domingo','Segunda-feira','Sexta-feira'],correct:1,explanation:'星期日 e 星期天 são domingo.'},
 {q:'A que horas chegam?',options:['Nove da noite','Oito da noite','Oito da manhã','Nove da manhã'],correct:2,explanation:'早上八点。'},
 {q:'Em qual aeroporto se encontram?',options:['Xi’an','Hongqiao','Capital','Daxing'],correct:3,explanation:'大兴机场见！'},
 {q:'也 em 李文也是北京人 fica...',options:['antes de 是','depois de 北京人','antes de 李文','no fim da frase'],correct:0,explanation:'Sujeito + 也 + predicado.'},
 {q:'好玩儿 é...',options:['gostoso','divertido','muito cedo','ocupado'],correct:1,explanation:'Descreve a experiência em Xi’an.'},
 {q:'住我家 significa...',options:['buscar minha família','telefonar para casa','ficar na minha casa','procurar minha casa'],correct:2,explanation:'住 indica morar ou hospedar-se.'},
 {q:'不早。',options:['É cedo demais','É tarde demais','Não tenho tempo','Não é cedo'],correct:3,explanation:'É a resposta à pergunta 早不早？'},
];
export const LESSON15_WRITING = [
 ['De qual prato vocês gostam?','你们爱吃哪个菜？','Pergunte qual prato, não quantos pratos.'],
 ['Gosto deste e também daquele.','我喜欢这个，也喜欢那个。','Acrescente uma segunda preferência antes do verbo.'],
 ['Todos estes pratos são gostosos e também muito bonitos.','这些菜都好吃，还很好看。','Totalidade, sabor e aparência.'],
 ['Pessoal, comam mais um pouco.','大家多吃点儿。','Convite para aumentar um pouco a quantidade.'],
 ['Aonde vocês todos querem ir?','你们都想去哪儿？','Grupo, totalidade, desejo e destino.'],
 ['Há alguns anos fui a Xi’an.','前几年我去了西安。','Tempo passado indefinido e ação realizada.'],
 ['Pretendo ir a Pequim.','我要去北京。','Intenção antes do verbo de deslocamento.'],
 ['Leva nove horas para chegar a Pequim.','到北京要九个小时。','Destino e duração necessária.'],
 ['Minha irmã mais velha tem tempo.','我姐姐有时间。','Posse de disponibilidade, sem verbo ser.'],
 ['Ela pode buscar vocês no aeroporto.','她可以去机场接你们。','Possibilidade, lugar e finalidade.'],
 ['Vocês também podem ficar na minha casa.','你们也可以住我家。','Informação adicional e permissão.'],
 ['A professora Wang é de Pequim, e Li Wen também é de Pequim.','王老师是北京人，李文也是北京人。','Repita a origem para a segunda pessoa.'],
] as const;
