import type { StudyItem, StudyGroup } from './lesson11Data';
const items = (prefix: string, rows: Array<[string,string,string,string?]>): StudyItem[] => rows.map(([hanzi,pinyin,meaning,speaker],i) => ({id:`l12-${prefix}-${i+1}`,hanzi,pinyin,meaning,...(speaker ? {speaker} : {})}));
export const LESSON12_GROUPS: StudyGroup[] = [
 {id:'l12-vocabulary',name:'Vocabulário · 24 palavras',label:'生词 · shēngcí',description:'As 24 entradas da lição, na ordem do livro. 天 aparece duas vezes, com sentidos diferentes.',items:items('v',[
 ['天气','tiānqì','clima'],['这里','zhèlǐ','aqui'],['天','tiān','tempo: clima'],['下雨','xià yǔ','chover'],['了','le','mudança de situação'],['雨','yǔ','chuva'],['有点儿','yǒudiǎnr','um pouco: sensação'],['觉得','juéde','achar ou sentir'],['冷','lěng','frio'],['下','xià','cair: chuva ou neve'],['雪','xuě','neve'],['来','lái','vir'],['公司','gōngsī','empresa'],['生病','shēngbìng','ficar doente'],['看病','kànbìng','consultar o médico'],['病','bìng','estar doente'],['一点儿','yìdiǎnr','um pouco: quantidade'],['药','yào','remédio'],['天','tiān','dia: duração'],['回','huí','voltar'],['再','zài','depois ou novamente'],['喝','hē','beber'],['热','rè','quente'],['水','shuǐ','água'],
 ])},
 {id:'l12-text1',name:'Diálogo 1 · O clima',label:'课文一 · kèwén yī',description:'Wang Yixue telefona para Wang Yifei para perguntar sobre o clima. Página 87.',items:items('d1',[
 ['今天天气怎么样？','jīntiān tiānqì zěnmeyàng?','Como está o clima hoje?','王一雪 · Wang Yixue'],
 ['这里的天不太好，下雨了。','zhèlǐ de tiān bú tài hǎo, xià yǔ le.','O tempo aqui não está muito bom; está chovendo.','王一飞 · Wang Yifei'],
 ['雨大吗？','yǔ dà ma?','A chuva está forte?','王一雪 · Wang Yixue'],
 ['有点儿大，我觉得很冷。','yǒudiǎnr dà, wǒ juéde hěn lěng.','Um pouco forte. Estou sentindo muito frio.','王一飞 · Wang Yifei'],
 ])},
 {id:'l12-text2',name:'Diálogo 2 · Ontem nevou',label:'课文二 · kèwén èr',description:'Wang Yixue e Yang Tongle conversam no elevador da empresa. Páginas 89–90.',items:items('d2',[
 ['昨天下雪了。','zuótiān xià xuě le.','Ontem nevou.','王一雪 · Wang Yixue'],
 ['是的，太冷了。','shì de, tài lěng le.','Sim, estava muito frio.','杨同乐 · Yang Tongle'],
 ['你昨天没来公司，生病了？','nǐ zuótiān méi lái gōngsī, shēngbìng le?','Você não veio à empresa ontem. Ficou doente?','王一雪 · Wang Yixue'],
 ['对，我昨天去医院看病了。','duì, wǒ zuótiān qù yīyuàn kànbìng le.','Sim, ontem fui ao hospital consultar o médico.','杨同乐 · Yang Tongle'],
 ])},
 {id:'l12-text3',name:'Diálogo 3 · No médico',label:'课文三 · kèwén sān',description:'Yang Tongle conversa com o doutor Hu. Página 91. Treino de idioma, não orientação médica.',items:items('d3',[
 ['医生，我病了。','yīshēng, wǒ bìng le.','Doutor, estou doente.','杨同乐 · Yang Tongle'],
 ['我看看。你觉得怎么样？','wǒ kànkan. nǐ juéde zěnmeyàng?','Vou dar uma olhada. Como você está se sentindo?','胡医生 · Doutor Hu'],
 ['我很冷。','wǒ hěn lěng.','Estou com muito frio.','杨同乐 · Yang Tongle'],
 ['好的，吃一点儿药，今天休息半天吧。','hǎo de, chī yìdiǎnr yào, jīntiān xiūxi bàn tiān ba.','Certo, tome um pouco de remédio e descanse meio dia hoje.','胡医生 · Doutor Hu'],
 ['好的。','hǎo de.','Está bem.','杨同乐 · Yang Tongle'],
 ['回家后再喝些热水。','huí jiā hòu zài hē xiē rè shuǐ.','Depois de voltar para casa, beba um pouco de água quente.','胡医生 · Doutor Hu'],
 ])},
 {id:'l12-patterns',name:'Estruturas · Ouvir e repetir',label:'练习 · liànxí',description:'Frases curtas, mudança de situação com 了 e intensidade com 太…了. Modelos para as atividades das páginas 92–93.',items:items('p',[
 ['下雨了。','xià yǔ le.','Começou a chover.'],['下雪了。','xià xuě le.','Começou a nevar.'],['上课了。','shàngkè le.','A aula começou.'],['真漂亮！','zhēn piàoliang!','Que bonito!'],['对不起！','duìbuqǐ!','Desculpe!'],['没关系！','méi guānxi!','Não tem problema!'],
 ['十二点了，吃午饭吧。','shí èr diǎn le, chī wǔfàn ba.','Já são doze horas; vamos almoçar.'],['弟弟起床了吗？','dìdi qǐchuáng le ma?','Seu irmão mais novo já levantou?'],['没起呢。','méi qǐ ne.','Ainda não levantou.'],
 ['太冷了！','tài lěng le!','Está frio demais!'],['这个杯子太小了。','zhè ge bēizi tài xiǎo le.','Este copo é pequeno demais.'],['我们今天太高兴了！','wǒmen jīntiān tài gāoxìng le!','Estamos muito felizes hoje!'],
 ['我没去医院。','wǒ méi qù yīyuàn.','Eu não fui ao hospital.'],['你觉得冷不冷？','nǐ juéde lěng bu lěng?','Você está sentindo frio ou não?'],['有点儿冷。','yǒudiǎnr lěng.','Um pouco de frio.'],['喝一点儿水吧。','hē yìdiǎnr shuǐ ba.','Beba um pouco de água.'],['外边正在下雪，太冷了！','wàibian zhèngzài xià xuě, tài lěng le!','Está nevando lá fora; está frio demais!'],['他去公司工作了。','tā qù gōngsī gōngzuò le.','Ele foi trabalhar na empresa.'],['今天的天气很好。','jīntiān de tiānqì hěn hǎo.','O clima hoje está muito bom.'],
 ])},
];
export const LESSON12_GRAMMAR = [
 {title:'1. Frases curtas sem sujeito expresso',text:'Na conversa, uma frase pode ser formada por uma palavra ou expressão. Para falar do clima, não invente um sujeito como “ele” em português: 下雨了 e 下雪了 já são frases.',tip:'真漂亮、对不起 e 没关系 também funcionam sozinhos. Use o contexto para entender de quem ou do que se fala.',examples:['下雨了。','下雪了。','上课了。','真漂亮！','对不起！','没关系！']},
 {title:'2. 了: uma mudança ou situação nova',text:'Nesta lição, 了 no fim da frase ou antes de uma pausa indica mudança ou uma situação nova: 下雨了, 我病了, 十二点了. Não é simplesmente uma marca de passado: o contexto informa o tempo.',tip:'Na resposta negativa ensinada no livro, use 没 e omita esse 了: 弟弟起床了吗？ — 没起呢. Compare 昨天下雪了 (ontem) com 下雨了 (agora começou a chover).',examples:['十二点了，吃午饭吧。','弟弟起床了吗？','没起呢。','我没去医院。']},
 {title:'3. 太…了: intensidade',text:'太 + adjetivo + 了 expressa um grau muito alto. Pode indicar excesso, como um copo pequeno demais, ou entusiasmo, como estar muito feliz.',tip:'太冷了 = frio demais. 太高兴了 = muito feliz. Não traduza 太 sempre como algo ruim. Compare 有点儿冷 (um pouco de frio) com 太冷了 (frio demais).',examples:['太冷了！','这个杯子太小了。','我们今天太高兴了！','有点儿冷。']},
];
export const LESSON12_QUIZ = [
 {q:'今天天气怎么样？ significa...',options:['Como está o clima hoje?','Que horas são hoje?','Aonde você vai hoje?','Quando você volta hoje?'],correct:0,explanation:'天气 é clima; 怎么样 pergunta como está.'},
 {q:'No diálogo 1, o tempo está...',options:['bom e quente','chuvoso e frio','nevando e quente','sem chuva e quente'],correct:1,explanation:'下雨了 e 我觉得很冷.'},
 {q:'No diálogo 2, ontem...',options:['choveu','fez calor','nevou','não fez frio'],correct:2,explanation:'昨天下雪了.'},
 {q:'Por que Yang Tongle não veio à empresa?',options:['Estava estudando','Estava viajando','Estava comprando água','Ficou doente'],correct:3,explanation:'生病了？ — 对，我昨天去医院看病了.'},
 {q:'他昨天去医院___了。',options:['看病','天气','下雪','热水'],correct:0,explanation:'看病 significa consultar um médico.'},
 {q:'Qual NÃO significa “clima”?',options:['天气','药','天（这里的天）','天气情况'],correct:1,explanation:'药 é remédio. 天 nesta expressão também é tempo/clima.'},
 {q:'了 nesta lição indica principalmente...',options:['Sempre futuro','Sempre passado','Mudança ou situação nova','Pergunta de lugar'],correct:2,explanation:'下雨了 e 十二点了 anunciam uma situação nova.'},
 {q:'弟弟起床了吗？ — resposta negativa:',options:['不起了','起床吗','起床了','没起呢'],correct:3,explanation:'O livro ensina 没 e omissão de 了 nessa resposta.'},
 {q:'太冷了！ significa...',options:['Está frio demais!','Está um pouco frio.','Não está frio.','Vai esfriar amanhã.'],correct:0,explanation:'太…了 expressa intensidade elevada.'},
 {q:'我们今天太高兴了！ expressa...',options:['tristeza','grande alegria','doença','dúvida'],correct:1,explanation:'太 também pode intensificar uma sensação positiva.'},
 {q:'这个杯子太___了。 — pequeno demais',options:['药','水','小','雪'],correct:2,explanation:'小 é pequeno; 太小了 é pequeno demais.'},
 {q:'O médico propõe descansar...',options:['dois dias','uma semana','um mês','meio dia'],correct:3,explanation:'今天休息半天吧.'},
 {q:'有点儿冷 significa...',options:['Um pouco de frio','Um pouco de água','Muito calor','Uma chuva forte'],correct:0,explanation:'有点儿 antecede a sensação/adjetivo.'},
 {q:'喝___水吧。 — um pouco de água',options:['有点儿','一点儿','天气','觉得'],correct:1,explanation:'一点儿 indica quantidade, aqui de água.'},
 {q:'我看看 indica...',options:['Olhar por muitos dias','Nunca olhar','Dar uma olhada','Ter muito frio'],correct:2,explanation:'A repetição de 看 indica uma ação breve.'},
 {q:'回家后再喝些热水：o que vem primeiro?',options:['Beber água','Ir à empresa','Estudar','Voltar para casa'],correct:3,explanation:'回家后 = depois de voltar para casa; 再 indica o passo seguinte.'},
 {q:'外边正在下___，太冷了！',options:['雪','药','公司','病'],correct:0,explanation:'下雪 = nevar. 正在 indica a ação em andamento.'},
 {q:'他去公司工作___。',options:['天气','了','药','冷'],correct:1,explanation:'了 final assinala a situação nova nesta frase.'},
 {q:'你觉得___？ — Como você se sente?',options:['一点儿','热水','怎么样','公司'],correct:2,explanation:'你觉得怎么样 pergunta como se sente.'},
 {q:'哪句话没有主语也能完整表达天气？',options:['我公司','你水','他药','下雨了。'],correct:3,explanation:'下雨了 é uma frase completa sem sujeito expresso.'},
];
export const LESSON12_WRITING = [
 ['Como está o clima hoje?','今天天气怎么样？','Tempo, clima e pergunta sobre como está.'],['Ontem nevou.','昨天下雪了。','Indique ontem e uma situação com a partícula final.'],['Começou a chover.','下雨了。','Uma frase curta sem sujeito expresso.'],['Doutor, estou doente.','医生，我病了。','Chame o médico e indique a situação nova.'],['Estou com muito frio.','我很冷。','Use o adjetivo de temperatura.'],['Está frio demais!','太冷了！','Use a estrutura de intensidade.'],['Este copo é pequeno demais.','这个杯子太小了。','Objeto primeiro, intensidade depois.'],['Estamos muito felizes hoje!','我们今天太高兴了！','Sujeito, tempo e intensidade.'],['Eu não fui ao hospital.','我没去医院。','Negue a ação sem acrescentar a partícula final.'],['Seu irmão mais novo já levantou?','弟弟起床了吗？','Ação, situação nova e pergunta.'],['Beba um pouco de água.','喝一点儿水吧。','Use quantidade, não a expressão de sensação.'],['Já são doze horas; vamos almoçar.','十二点了，吃午饭吧。','Situação nova e convite, separados por vírgula.'],
 ] as const;
