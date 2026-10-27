import {group,makeLesson} from './helpers';
const n=4;
const groups=[
 group(n,'vocabulary','Vocabulário · 16 entradas','Entradas das páginas 30, 32, 34 e 35.',[
 ['过','já ter feito: experiência'],['商场','shopping'],['进去','entrar'],['条','classificador de peças compridas'],['裤子','calça'],['白色','branco'],['因为','porque'],['试','experimentar'],['红色','vermelho'],['所以','por isso'],['书包','mochila escolar'],['过去','ir para lá'],['绿色','verde'],['黑色','preto'],['更','mais: comparação'],['颜色','cor'],
 ]),
 group(n,'text1','Diálogo 1 · Um shopping novo','Wang Yixue e a filha Liu Xiaoxue na entrada do shopping. Página 30.',[
 ['妈妈，我们来过这家商场吗？','Mãe, nós já viemos a este shopping?','刘小雪 · Liu Xiaoxue'],['没来过，这是新开的。','Nunca viemos; ele foi inaugurado recentemente.','王一雪 · Wang Yixue'],['我们进去看看吧。','Vamos entrar e dar uma olhada.','刘小雪 · Liu Xiaoxue'],['好啊！你想买点儿什么？','Ótimo! O que você quer comprar?','王一雪 · Wang Yixue'],['我想买条裤子。','Quero comprar uma calça.','刘小雪 · Liu Xiaoxue'],['没问题。','Sem problema.','王一雪 · Wang Yixue'],
 ]),
 group(n,'text2','Diálogo 2 · Experimentar outra cor','Escolhendo uma calça. Página 32; 白色的 e 红色的 retomam calças.',[
 ['妈妈，我想买这条白色的裤子。','Mãe, quero comprar esta calça branca.','刘小雪 · Liu Xiaoxue'],['你有很多白色的衣服，为什么还买白色的？','Você tem muitas roupas brancas; por que comprar outra branca?','王一雪 · Wang Yixue'],['因为我喜欢白色啊！','Porque eu gosto de branco!','刘小雪 · Liu Xiaoxue'],['我觉得这条白色的不太好看，你试试那条红色的吧。','Acho que esta branca não é muito bonita; experimente aquela vermelha.','王一雪 · Wang Yixue'],['我没穿过红色的，红色的好看吗？','Nunca usei uma vermelha; fica bonita?','刘小雪 · Liu Xiaoxue'],['就是因为没穿过，所以要试试啊！','É justamente porque nunca usou que deve experimentar!','王一雪 · Wang Yixue'],
 ]),
 group(n,'text3','Diálogo 3 · Escolher uma mochila','Escolhendo uma mochila escolar. Páginas 33–34.',[
 ['妈妈，我想买个新书包。','Mãe, quero comprar uma mochila escolar nova.','刘小雪 · Liu Xiaoxue'],['好，那边卖书包，我们过去看看吧。','Certo, vendem mochilas ali; vamos até lá dar uma olhada.','王一雪 · Wang Yixue'],['这么多漂亮的书包！','Quantas mochilas bonitas!','刘小雪 · Liu Xiaoxue'],['红色的、绿色的、黑色的，你想买哪个？','A vermelha, a verde ou a preta: qual você quer comprar?','王一雪 · Wang Yixue'],['绿色的吧。','A verde.','刘小雪 · Liu Xiaoxue'],['不错，我也觉得绿色的更好看。','Boa escolha; também acho a verde mais bonita.','王一雪 · Wang Yixue'],
 ]),
 group(n,'text4','Texto 4 · Diário de Xiaoxue','Texto narrativo da página 35 separado em frases.',[
 ['我和妈妈去了一家商场。','Fui a um shopping com minha mãe.'],['因为是新开的，所以这几天东西很便宜。','Como ele foi inaugurado recentemente, as coisas estão baratas nestes dias.'],['商场里的衣服颜色很多。','As roupas do shopping têm muitas cores.'],['我没穿过红色的裤子，妈妈让我试了试，我觉得我穿红色的也很好看。','Eu nunca tinha usado calça vermelha; minha mãe pediu que eu experimentasse, e achei que também fico bonita de vermelho.'],
 ]),
 group(n,'patterns','Estruturas · Experiência, causa e 的','Exemplos das páginas 31, 33 e 34.',[
 ['她去过中国。','Ela já foi à China.'],['我吃过饺子，很好吃。','Eu já comi jiaozi; é muito gostoso.'],['她没去过中国。','Ela nunca foi à China.'],['你看没看过那个电影？','Você já viu aquele filme ou não?'],['因为我生病了，今天没去上班。','Como fiquei doente, não fui trabalhar hoje.'],['我没去过他家，所以让他来车站接我。','Nunca fui à casa dele; por isso pedi que me buscasse na estação.'],['这个面包是爸爸买的，妈妈买的在那儿。','Este pão foi meu pai que comprou; o que minha mãe comprou está ali.'],['这件衣服太贵了，还是买那件便宜的吧。','Esta roupa é cara demais; é melhor comprar aquela mais barata.'],
 ]),
];
export const HSK2_LESSON4=makeLesson({number:n,title:'你穿红色的很好看',pages:'29–36',groups,
 grammar:[
 {title:'1. Verbo + 过: experiência anterior',text:'过 depois do verbo expressa ter tido uma experiência: 去过中国. Na negativa, use 没(有) antes do verbo e mantenha 过: 没去过中国. Pode perguntar com 吗, 没有 ou verbo + 没 + verbo + 过.',tip:'Não retire 过 como faria com o 了 de ação concluída. 去过 não informa sozinho quando aconteceu nem que a pessoa ainda esteja lá.',examples:['她去过中国。','我吃过饺子，很好吃。','她没去过中国。','你看没看过那个电影？']},
 {title:'2. 因为…所以…: causa e consequência',text:'因为 apresenta a razão; 所以 introduz a consequência. Podem aparecer juntos ou só um deles, quando a relação é clara no contexto.',tip:'Não inverta motivo e resultado. No texto, ser recém-inaugurado é o motivo dos preços promocionais.',examples:['因为我生病了，今天没去上班。','我没去过他家，所以让他来车站接我。','因为是新开的，所以这几天东西很便宜。']},
 {title:'3. Expressão com 的 substituindo o nome',text:'Quando o nome já está claro, 红色的 pode significar a calça vermelha ou a mochila vermelha. 妈妈买的 pode significar o pão que a mãe comprou. Use o contexto para recuperar o nome omitido.',tip:'Não traduza 红色的 sempre como uma coisa fixa. 条 retoma a calça; no diálogo de mochilas, 绿色的 retoma 书包.',examples:['这个面包是爸爸买的，妈妈买的在那儿。','这件衣服太贵了，还是买那件便宜的吧。','绿色的吧。']},
 ],checks:[
 {q:'Elas já tinham visitado o shopping?',options:['Não, é novo','Sim, toda semana','Só a mãe','Só a filha'],correct:0,explanation:'没来过，这是新开的。'},
 {q:'O que Xiaoxue primeiro quer comprar?',options:['Uma passagem','Uma calça','Um livro','Uma xícara'],correct:1,explanation:'我想买条裤子。'},
 {q:'Qual cor de calça ela inicialmente escolhe?',options:['Preta','Verde','Branca','Azul'],correct:2,explanation:'这条白色的裤子。'},
 {q:'Qual cor a mãe pede que experimente?',options:['Branca','Preta','Verde','Vermelha'],correct:3,explanation:'你试试那条红色的吧。'},
 {q:'Qual mochila Xiaoxue escolhe?',options:['Verde','Vermelha','Preta','Branca'],correct:0,explanation:'绿色的吧。'},
 {q:'Negativa correta de 去过中国:',options:['不去过了中国','没去过中国','没去中国过了','不是过去中国'],correct:1,explanation:'Para negar a experiência, mantém-se 过.'},
 {q:'所以 apresenta...',options:['a cor','a pergunta','a consequência','a quantidade'],correct:2,explanation:'因为 é a causa; 所以 é o resultado.'},
 {q:'No diálogo de mochilas, 绿色的 retoma...',options:['calça','pão','ingresso','mochila'],correct:3,explanation:'O nome omitido depende do contexto.'},
 ],writing:[['妈妈，我们来过这家商场吗？','Pergunte sobre uma experiência anterior.'],['没来过，这是新开的。','Negue a experiência e explique que o local é novo.'],['我们进去看看吧。','Sugira entrar para uma ação breve.'],['我想买条裤子。','Escolha o classificador de calças.'],['妈妈，我想买这条白色的裤子。','Identifique a peça e sua cor.'],['因为我喜欢白色啊！','Apresente o motivo da preferência.'],['妈妈，我想买个新书包。','Peça uma mochila escolar nova.'],['这么多漂亮的书包！','Exclame sobre quantidade e aparência.'],['绿色的吧。','Escolha a cor sem repetir o nome do objeto.'],['她没去过中国。','Negue uma experiência, conservando sua partícula.'],['因为我生病了，今天没去上班。','Motivo antes da ausência no trabalho.'],['你看没看过那个电影？','Pergunta afirmativa-negativa sobre experiência.']],prompts:'Faça o papel de cliente e vendedor. Pergunte cores, explique preferências e conte o que já experimentou ou nunca usou.',promptsChinese:'你来过这家商场吗？ · 你想买哪个？ · 你为什么喜欢红色？',notes:'Em português, o nome omitido foi retomado quando necessário para o sentido ficar claro. 买条裤子 é comprar uma calça, não várias. O texto 4 confirma a experiência de experimentar a peça vermelha.'});
