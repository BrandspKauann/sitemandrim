import type { LessonPhrase, LessonTopic, VocabularyGroup } from './aula1Data';

export function makeLessonTools(prefix: string, rows: ReadonlyArray<readonly [string,string,string,string]>) {
  const keyPhrases: LessonPhrase[] = rows.map(([id,hanzi,spokenPinyin,translation]) => ({id:`${prefix}-${id}`,hanzi,spokenPinyin,translation}));
  const phrase = (id: string) => {
    const result=keyPhrases.find(p=>p.id===`${prefix}-${id}`);
    if (!result) throw new Error(`Frase ausente: ${prefix}-${id}`);
    return result;
  };
  return {
    keyPhrases, phrase,
    topic: (marker:string,title:string,summary:string,points:string[],ids:string[]): LessonTopic => ({marker,title,summary,points,examples:ids.map(phrase)}),
    words: (title:string,description:string,rows:Array<[string,string]>): VocabularyGroup => ({title,description,words:rows.map(([hanzi,translation])=>({hanzi,translation}))}),
    writing: (rows:Array<[string,string]>) => rows.map(([id,hint])=>({id:`${prefix}-w-${id}`,prompt:phrase(id).translation,answer:phrase(id).hanzi,hint})),
    listening: (rows:Array<[string,string,string]>) => rows.map(([id,...others])=>({phraseId:phrase(id).id,choices:[phrase(id).translation,...others]})),
  };
}
