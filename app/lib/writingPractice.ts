// Only reviewed alternatives are accepted. Do not treat arbitrary synonym
// replacement or removal of grammatical particles as semantic equivalence.
export function normalizeWriting(value: string) {
  return value.normalize('NFKC').replace(/[\s，。！？；：、,.!?;:'“”"‘’()（）]/g, '');
}
const alternatives: Record<string, string[]> = {
 '小猫在椅子上睡觉':['小猫在椅子上面睡觉','小猫正在椅子上睡觉','小猫在椅子上睡觉呢','小猫正在椅子上睡觉呢','小猫正在椅子上面睡觉','小猫在椅子上面睡觉呢','小猫正在椅子上面睡觉呢'],
 '今天是几月几号':['今天几月几号','今天是几月几日','今天几月几日'],
 '今天星期几':['今天是星期几'],
 '你的生日是几月几日':['你的生日是几月几号','你生日是几月几日'],
 '今天是九月十九号':['今天是九月十九日','今天九月十九号'],
 '我每周星期天休息':['我每个星期天休息','我每周日休息','我每个星期日休息'],
 '你在做什么呢':['你正在做什么','你正在做什么呢','你在做什么'],
 '我正在看电视':['我在看电视','我在看电视呢','我正在看电视呢'],
 '我没在看电视':['我没有在看电视'],
 '我们读书呢':['我们在读书','我们正在读书','我们在读书呢'],
 '你还在读大学吗':['你还读大学吗'],
 '你会做饭吗':['你会不会做饭'],
 '我没有姐姐':['我没姐姐'],
 '你有没有哥哥':['你有哥哥吗'],
 '这是你爸爸吗':['这是你的爸爸吗'],
 '他不是我爸爸':['他不是我的爸爸'],
 '我妈妈在家':['我妈妈在家里','我的妈妈在家','我的妈妈在家里'],
 '我在家里':['我在家'],
 '我可以坐这里吗':['我可以坐在这里吗','我可以坐这儿吗','我可以坐在这儿吗'],
 '你现在在哪儿':['你现在在哪里'],
 '你下午去哪儿':['你下午去哪里'],
 '你明天想去哪儿':['你明天想去哪里'],
 '小猫在桌子下面':['小猫在桌子下'],
 '小猫在沙发左边':['小猫在沙发的左边'],
 '他们在地铁上聊天':['他们正在地铁上聊天','他们在地铁上聊天呢'],
 '他们在医院里看病':['他们在医院看病','他们正在医院里看病'],
 '我在家看电影':['我在家里看电影','我正在家里看电影','我正在家看电影'],
 '下午两点你能到吗':['你下午两点能到吗'],
 '你是一名医生吗':['你是医生吗','你是一个医生吗'],
 '我每天都读书':['我每天读书'],
 '你晚上给我打电话吧':['晚上给我打电话吧'],
 '你的手机号是多少':['你的手机号码是多少'],
};
export function checkWritingAnswer(value: string, answer: string) {
  const normalized = normalizeWriting(value);
  return [answer, ...(alternatives[normalizeWriting(answer)] ?? [])].some(candidate => normalizeWriting(candidate) === normalized);
}
export function writingFocus(answer: string) {
  if (/在.*(上|下|里|边|前|后|旁|中间).*(睡觉|看电视|看电影|聊天|看病|学习)/.test(answer)) return 'Localização + atividade: indique onde a pessoa ou o animal realiza a ação. Não confunda o lugar com o marcador de andamento.';
  if (/正在|在做|读书呢|看电视/.test(answer)) return 'Atividade em andamento: diferencie o que está acontecendo de hábito, intenção e habilidade.';
  if (/没/.test(answer)) return 'Negação: preserve a diferença entre não ter, não ter feito e não estar fazendo.';
  if (/不想|想|要/.test(answer)) return 'Vontade ou intenção: não transforme querer fazer em já ter feito.';
  if (/会/.test(answer)) return 'Habilidade aprendida: diferencie saber fazer de querer ou estar fazendo.';
  if (/在/.test(answer)) return 'Lugar: preserve o objeto de referência, a posição e o sentido de estar ou realizar uma ação em algum lugar.';
  if (/了/.test(answer)) return 'Situação ou ação realizada: preserve o tempo informado; a partícula não deve ser usada como um passado automático.';
  if (/几|多少|两|二|第|斤|半|小时|分钟|点/.test(answer)) return 'Quantidade, ordem, horário ou duração: preserve todos os números, unidades e classificadores pedidos.';
  return 'Sentido completo: preserve quem faz a ação, o objeto, as relações de posse e o tipo de pergunta ou afirmação.';
}
