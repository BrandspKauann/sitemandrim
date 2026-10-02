'use client';
import { useMemo, useState } from 'react';
import { dayKey, formatDuration, PAGE_LABELS, selectedStats, type UsageRecord } from './usageStats';
import styles from './SessionUsageTracker.module.css';

export type StudyPreferences = { goal: number; tenths: boolean };
function dateLabel(day: string) { return new Date(`${day}T12:00:00`).toLocaleDateString('pt-BR'); }
function clock(timestamp: number) { return new Date(timestamp).toLocaleTimeString('pt-BR'); }

export default function UsageReport({ records, today, liveMs, paused, preferences, onPreferences, onPause, onClose }: {
  records: UsageRecord[]; today: string; liveMs: number; paused: boolean; preferences: StudyPreferences;
  onPreferences: (next: StudyPreferences) => void; onPause: () => void; onClose: () => void;
}) {
  const [view, setView] = useState<'days' | 'areas' | 'settings'>('days');
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [goal, setGoal] = useState(String(preferences.goal));
  const [tenths, setTenths] = useState(preferences.tenths);
  const [notice, setNotice] = useState('');
  const report = useMemo(() => selectedStats(records, from, to), [records, from, to]);
  const todayMs = records.reduce((sum, item) => sum + (item.dailyVisibleMs[today] ?? 0), 0);
  const goalPercent = Math.min(100, todayMs / (preferences.goal * 60000) * 100);
  function period(days: number | null) {
    setTo(today);
    const date = new Date(`${today}T12:00:00`);
    date.setDate(date.getDate() - ((days ?? 1) - 1));
    setFrom(days === null ? '2000-01-01' : dayKey(date.getTime()));
  }
  function exportCsv() {
    const rows = [['dia','sessao','area','segundos'], ...report.sessions.flatMap((session) => {
      const areas = session.detail ? Object.entries(session.detail.pages).map(([page, ms]) => [session.date, session.id, PAGE_LABELS[page] ?? page, (ms / 1000).toFixed(3)]) : [];
      const unknown = session.duration - (session.detail?.visibleMs ?? 0);
      if (unknown > 0) areas.push([session.date, session.id, 'Histórico sem detalhamento por área', (unknown / 1000).toFixed(3)]);
      return areas;
    })];
    const blob = new Blob(['\uFEFF' + rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"','""')}"`).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `estudo-${from}-${to}.csv`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={styles.report} role="dialog" aria-modal="true" aria-labelledby="usage-report-title" tabIndex={-1}
      onKeyDown={(event) => { if (event.key !== 'Tab') return; const nodes = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input, summary'); const first = nodes[0]; const last = nodes[nodes.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } }}>
      <header className={styles.reportHeader}><div><span>Meu tempo de estudo</span><h2 id="usage-report-title">Histórico e estatísticas</h2></div><button autoFocus className={styles.closeButton} onClick={onClose} aria-label="Fechar relatório">×</button></header>
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}><span>Sessão atual · {paused ? 'pausada' : 'contagem ativa'}</span><strong>{formatDuration(liveMs)}</strong></div>
        <div className={styles.summaryCard}><span>Hoje</span><strong>{formatDuration(todayMs)}</strong></div>
        <div className={styles.summaryCard}><span>Período selecionado</span><strong>{formatDuration(report.total)}</strong></div>
        <div className={styles.summaryCard}><span>Dias estudados</span><strong>{report.days.length}</strong></div>
      </div>
      <div className={styles.goal}><span>Meta de hoje: {preferences.goal} min · {Math.round(goalPercent)}%</span><progress value={goalPercent} max={100} aria-label="Progresso da meta diária" /></div>
      <p className={styles.definition}>Só conta com a página visível e em foco. Trocar de aba ou bloquear a tela pausa a contagem. Atualizações e recarregamentos preservam o histórico.</p>
      <nav className={styles.reportTabs} aria-label="Estatísticas de estudo">{([['days','Por dia'],['areas','Por área'],['settings','Configurar']] as const).map(([id,label]) => <button key={id} aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}</nav>
      {view !== 'settings' ? <>
        <div className={styles.filters}><div>{[[1,'Hoje'],[7,'7 dias'],[30,'30 dias'],[null,'Tudo']].map(([days,label]) => <button key={String(label)} onClick={() => period(days as number | null)}>{label}</button>)}</div>
          <label>De<input type="date" value={from} max={to} onChange={(event) => setFrom(event.target.value || today)} /></label><label>Até<input type="date" value={to} min={from} max={today} onChange={(event) => setTo(event.target.value || today)} /></label><button onClick={exportCsv}>Exportar CSV</button>
        </div>
        <div className={styles.details}>
          {view === 'days' ? report.days.map(([date,total]) => <details key={date} className={styles.dayDetail} open={report.days.length === 1}>
            <summary><span>{dateLabel(date)}{date === today ? ' · Hoje' : ''}</span><strong>{formatDuration(total)}</strong></summary>
            {report.sessions.filter((session) => session.date === date).map((session) => <details key={session.id} className={styles.studyDetail}>
              <summary><span>Sessão {session.id.replaceAll('-','').slice(0,8).toUpperCase()}<small>{session.detail ? `${clock(session.detail.startedAt)} → ${clock(session.detail.lastSeenAt)} · intervalo entre primeiro e último estudo` : 'Registro anterior ao detalhamento'}</small></span><strong>{formatDuration(session.duration)}</strong></summary>
              <ul className={styles.pageList}>{session.detail ? Object.entries(session.detail.pages).sort(([,a],[,b]) => b-a).map(([page,ms]) => <li key={page}><span>{PAGE_LABELS[page] ?? page}</span><strong>{formatDuration(ms)}</strong></li>) : <li>O total antigo foi preservado; não é possível reconstruir o tempo por área desse dia.</li>}</ul>
            </details>)}
          </details>) : <><h3>Distribuição no período</h3><ul className={styles.pageList}>{report.pages.map(([page,ms]) => <li key={page}><span>{PAGE_LABELS[page] ?? page}<progress value={ms} max={Math.max(report.total,1)} aria-label={`Participação de ${PAGE_LABELS[page] ?? page}`} /></span><strong>{formatDuration(ms)} · {Math.round(ms/Math.max(report.total,1)*100)}%</strong></li>)}</ul></>}
          {!report.days.length && <p className={styles.empty}>Nenhum estudo registrado nesse período. Escolha outro intervalo.</p>}
          {report.missingDetail > 1000 && <p className={styles.privacy}>{formatDuration(report.missingDetail)} de registros antigos não têm divisão por área e dia. Os totais continuam preservados.</p>}
        </div>
      </> : <div className={styles.settings}>
        <label>Meta diária de estudo (minutos)<input type="number" min="1" max="1440" value={goal} onChange={(event) => setGoal(event.target.value)} /></label>
        <label><input type="checkbox" checked={tenths} onChange={(event) => setTenths(event.target.checked)} /> Mostrar décimos de segundo no contador</label>
        <button onClick={() => { const value = Number(goal); if (!Number.isInteger(value) || value < 1 || value > 1440) { setNotice('Escolha entre 1 e 1440 minutos.'); return; } onPreferences({ goal: value, tenths }); setNotice('Configurações salvas neste navegador.'); }}>Salvar configurações</button>
        <button onClick={onPause}>{paused ? 'Retomar contagem' : 'Pausar contagem manualmente'}</button>
        <p role="status">{notice}</p><p>Pausar não apaga o tempo acumulado. A pausa vale para esta aba até você retomá-la, inclusive após F5.</p>
      </div>}
      <p className={styles.privacy}>Dias seguem o relógio e fuso do seu aparelho. Cada aba do navegador é uma sessão; ao passar da meia-noite, o estudo é dividido entre os dias. Histórico e configurações ficam neste navegador, não são transferidos automaticamente para outro aparelho.</p>
    </section>
  </div>;
}
