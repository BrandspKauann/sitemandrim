import type {Picture} from './types.ts';
export type OralItem={id:string;part:'repeat'|'picture'|'answer';seconds:number;text:string;picture?:Picture;audio?:string};
const repeat=[
  '明天上午我有一节汉语课。','我的朋友正在学校学习。','今天天气比昨天凉快。','请把这本书放在桌子上。',
  '我周末喜欢和朋友一起运动。','如果下雨，我们就坐地铁去。','这个问题已经解决了。','他一边做饭，一边听音乐。',
];
export const ORAL_ITEMS:OralItem[]=[
  ...repeat.map((text,i)=>({id:`h3-oral-${i+1}`,part:'repeat' as const,seconds:10,text,audio:`/audio/simulado/h3-oral-${i+1}.mp3`})),
  ...[0,1,2,3,4].map((cell,i)=>({id:`h3-oral-${i+9}`,part:'picture' as const,seconds:15,text:'请说说图片上的人正在做什么。',picture:{sheet:'advanced' as const,cell}})),
  {id:'h3-oral-14',part:'answer',seconds:90,text:'你平时怎么锻炼身体？为什么？'},
  {id:'h3-oral-15',part:'answer',seconds:90,text:'你为什么学习汉语？你平时怎么学习？'},
];
