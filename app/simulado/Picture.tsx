import type { Picture as PictureData } from './types';
import styles from './page.module.css';
export default function Picture({picture,label}:{picture:PictureData;label:string}){
  return <div className={styles.picture} role="img" aria-label={label} style={{backgroundImage:`url(/images/simulado/${picture.sheet}.webp)`,backgroundSize:'300% 300%',backgroundPosition:`${(picture.cell%3)*50}% ${Math.floor(picture.cell/3)*50}%`}} />;
}
