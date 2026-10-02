import type { Metadata } from 'next';
import SimuladoClient from './SimuladoClient';
export const metadata:Metadata={title:'Simulados HSK 1, 2 e 3 | Tons de Mandarim',description:'Pratique o novo HSK com questões autorais, áudio em mandarim, imagens, cronômetro e revisão de respostas.'};
export default function Page(){return <SimuladoClient/>;}
