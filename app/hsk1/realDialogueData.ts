export type RealDialogueLine = {
  id: number;
  start: number;
  end: number;
  hanzi: string;
  translation: string;
};

export const REAL_DIALOGUE_AUDIO = '/audio/hsk1/dialogos-reais/uma-semana.mp3';

export const REAL_DIALOGUE_LINES: RealDialogueLine[] = [
  { id: 1, start: 1.58, end: 5.46, hanzi: '王小姐二十五岁。', translation: 'A senhorita Wang tem vinte e cinco anos.' },
  { id: 2, start: 5.72, end: 8.05, hanzi: '她住在北京。', translation: 'Ela mora em Pequim.' },
  { id: 3, start: 10.04, end: 18.31, hanzi: '她的妈妈五十岁，爸爸五十三岁。', translation: 'A mãe dela tem cinquenta anos e o pai, cinquenta e três.' },
  { id: 4, start: 20.33, end: 26.77, hanzi: '他们都是老师，在学校工作。', translation: 'Os dois são professores e trabalham em uma escola.' },
  { id: 5, start: 28.63, end: 31.92, hanzi: '王小姐是医生。', translation: 'A senhorita Wang é médica.' },
  { id: 6, start: 33.12, end: 36.18, hanzi: '她在医院工作。', translation: 'Ela trabalha em um hospital.' },
  { id: 7, start: 37.54, end: 41.12, hanzi: '每天工作八小时。', translation: 'Ela trabalha oito horas por dia.' },
  { id: 8, start: 43.38, end: 46.18, hanzi: '王小姐很漂亮。', translation: 'A senhorita Wang é muito bonita.' },
  { id: 9, start: 47.70, end: 51.82, hanzi: '她很喜欢她的工作。', translation: 'Ela gosta muito do trabalho dela.' },
  { id: 10, start: 53.57, end: 57.23, hanzi: '同事都很喜欢她。', translation: 'Todos os colegas gostam muito dela.' },
  { id: 11, start: 58.29, end: 68.48, hanzi: '星期一，王小姐早上八点去医院上班。', translation: 'Na segunda-feira, a senhorita Wang vai trabalhar no hospital às oito da manhã.' },
  { id: 12, start: 70.70, end: 73.72, hanzi: '医院里有很多人。', translation: 'Há muitas pessoas no hospital.' },
  { id: 13, start: 73.88, end: 79.32, hanzi: '下午，她和同事说再见。', translation: 'À tarde, ela se despede dos colegas.' },
  { id: 14, start: 80.46, end: 82.62, hanzi: '回家吃饭。', translation: 'Ela volta para casa para comer.' },
  { id: 15, start: 85.20, end: 90.32, hanzi: '星期二，下雨，天气不好。', translation: 'Na terça-feira, chove e o tempo está ruim.' },
  { id: 16, start: 91.55, end: 95.49, hanzi: '医院里没有很多人。', translation: 'Não há muitas pessoas no hospital.' },
  { id: 17, start: 96.71, end: 103.17, hanzi: '王小姐今天的工作不多。', translation: 'Hoje a senhorita Wang não tem muito trabalho.' },
  { id: 18, start: 104.55, end: 108.63, hanzi: '她在和同事说话。', translation: 'Ela está conversando com uma colega.' },
  { id: 19, start: 109.88, end: 114.36, hanzi: '同事说她有一只猫。', translation: 'A colega diz que tem um gato.' },
  { id: 20, start: 116.43, end: 125.60, hanzi: '星期三下午五点，她和朋友去看电影。', translation: 'Na quarta-feira, às cinco da tarde, ela vai ao cinema com uma amiga.' },
  { id: 21, start: 127.10, end: 131.16, hanzi: '她们都爱看电影。', translation: 'As duas adoram assistir a filmes.' },
  { id: 22, start: 132.86, end: 138.28, hanzi: '七点，她们去饭店吃饭。', translation: 'Às sete, elas vão comer em um restaurante.' },
  { id: 23, start: 140.48, end: 144.89, hanzi: '饭店在电影院前面。', translation: 'O restaurante fica em frente ao cinema.' },
  { id: 24, start: 146.43, end: 150.70, hanzi: '饭店的菜很好吃。', translation: 'A comida do restaurante é muito gostosa.' },
  { id: 25, start: 152.95, end: 157.86, hanzi: '星期四，王小姐很高兴。', translation: 'Na quinta-feira, a senhorita Wang está muito feliz.' },
  { id: 26, start: 159.55, end: 165.88, hanzi: '天气很好，她想去商店买东西。', translation: 'O tempo está bom e ela quer ir à loja fazer compras.' },
  { id: 27, start: 167.45, end: 174.94, hanzi: '下午六点，她去商店买水果。', translation: 'Às seis da tarde, ela vai à loja comprar frutas.' },
  { id: 28, start: 176.41, end: 180.25, hanzi: '她买了一些苹果。', translation: 'Ela compra algumas maçãs.' },
  { id: 29, start: 182.28, end: 185.70, hanzi: '她很喜欢吃苹果。', translation: 'Ela gosta muito de comer maçãs.' },
  { id: 30, start: 187.78, end: 193.00, hanzi: '星期五，王小姐不工作。', translation: 'Na sexta-feira, a senhorita Wang não trabalha.' },
  { id: 31, start: 194.59, end: 202.08, hanzi: '现在是上午十点，她在睡觉。', translation: 'Agora são dez da manhã e ela está dormindo.' },
  { id: 32, start: 203.95, end: 210.09, hanzi: '今天很冷，她不想出门。', translation: 'Hoje está muito frio e ela não quer sair.' },
  { id: 33, start: 211.37, end: 222.70, hanzi: '她在家喝茶、看书、学习、和朋友打电话。', translation: 'Em casa, ela toma chá, lê, estuda e telefona para uma amiga.' },
  { id: 34, start: 223.89, end: 229.90, hanzi: '星期六，王小姐不工作。', translation: 'No sábado, a senhorita Wang não trabalha.' },
  { id: 35, start: 231.62, end: 235.66, hanzi: '她的爸爸妈妈也不工作。', translation: 'Os pais dela também não trabalham.' },
  { id: 36, start: 237.46, end: 241.12, hanzi: '他们去商店买东西。', translation: 'Eles vão à loja fazer compras.' },
  { id: 37, start: 241.12, end: 251.19, hanzi: '她的爸爸喜欢喝茶，他买了一些茶。', translation: 'O pai dela gosta de chá e compra um pouco.' },
  { id: 38, start: 252.95, end: 256.33, hanzi: '她的妈妈想买衣服。', translation: 'A mãe dela quer comprar roupas.' },
  { id: 39, start: 257.04, end: 264.97, hanzi: '王小姐有很多衣服，她不想买衣服。', translation: 'A senhorita Wang tem muitas roupas e não quer comprar mais.' },
  { id: 40, start: 264.97, end: 273.80, hanzi: '星期日，王小姐上午在医院工作。', translation: 'No domingo de manhã, a senhorita Wang trabalha no hospital.' },
  { id: 41, start: 274.98, end: 278.62, hanzi: '下午去学校学习。', translation: 'À tarde, ela vai estudar na escola.' },
  { id: 42, start: 280.38, end: 284.84, hanzi: '学校在医院后面。', translation: 'A escola fica atrás do hospital.' },
  { id: 43, start: 285.73, end: 292.69, hanzi: '她每个星期在这儿学习四个小时。', translation: 'Ela estuda aqui quatro horas por semana.' },
  { id: 44, start: 294.39, end: 299.71, hanzi: '学校前面有一家商店。', translation: 'Há uma loja em frente à escola.' },
  { id: 45, start: 300.73, end: 309.35, hanzi: '商店很大，里面有很多漂亮的杯子。', translation: 'A loja é grande e tem muitas xícaras bonitas.' },
  { id: 46, start: 310.81, end: 315.93, hanzi: '王小姐问杯子多少钱。', translation: 'A senhorita Wang pergunta quanto custa a xícara.' },
  { id: 47, start: 317.47, end: 323.95, hanzi: '她买了一个二十块的杯子。', translation: 'Ela compra uma xícara de vinte yuans.' },
];
