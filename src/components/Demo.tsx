import { useMemo, useState } from 'react'
import { Image as ImageIcon, Sparkle } from '@phosphor-icons/react'
import { useLang } from '../i18n.tsx'
import { Reveal, SectionHead } from './ui.tsx'

const PALETTES = [
  ['#8B7CFF', '#1F1F1F', '#F2EFE9', '#C9BFFF'],
  ['#E8634A', '#F2EFE9', '#272727', '#F6C453'],
  ['#2E7D6B', '#F2EFE9', '#1F1F1F', '#9AD1C0'],
  ['#D9A441', '#181818', '#F2EFE9', '#7C6AAE'],
]
function hash(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }
function Art({ seed, label }: { seed: string; label: string }) {
  const h = hash(seed)
  const pal = PALETTES[h % PALETTES.length]
  const kind = h % 3
  const cx = 30 + (h % 60)
  const cy = 30 + ((h >> 3) % 50)
  return (
    <svg viewBox="0 0 200 140" className="h-auto w-full" role="img" aria-label={label}>
      <rect width="200" height="140" fill={pal[1]} />
      {kind === 0 ? (<><circle cx={cx + 40} cy={cy} r="42" fill={pal[0]} /><rect x="20" y="86" width="160" height="10" fill={pal[3]} /><rect x="20" y="104" width="110" height="10" fill={pal[2]} /></>)
        : kind === 1 ? (<><rect x="24" y="24" width="80" height="92" rx="8" fill={pal[0]} /><circle cx="150" cy="52" r="26" fill={pal[3]} /><rect x="118" y="96" width="58" height="20" fill={pal[2]} /></>)
        : (<><path d="M20 120 L90 30 L160 120 Z" fill={pal[0]} /><circle cx="150" cy="34" r="18" fill={pal[3]} /><rect x="20" y="126" width="160" height="6" fill={pal[2]} /></>)}
    </svg>
  )
}

export function HeroDemo() {
  const { t, ta } = useLang()
  const styles = ta<string>('demo.styles')
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState(styles[0] || '')
  const [loading, setLoading] = useState(false)
  const [made, setMade] = useState<string[]>([])
  const [error, setError] = useState('')
  const generate = () => {
    if (prompt.trim().length < 3) { setError(t('demo.promptError')); return }
    setError('')
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setMade((m) => [`${prompt.trim()} · ${style}`, ...m].slice(0, 3))
    }, 900)
  }
  return (
    <div className="rounded-2xl border p-4 sm:p-8" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
      <label htmlFor="prompt-input" className="caption-4 mb-2 block">{t('demo.promptLabel')}</label>
      <div className="flex flex-col gap-4 sm:flex-row">
        <input id="prompt-input" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t('demo.promptPlaceholder')} className="w-full flex-1 rounded-xl border bg-transparent px-4 py-2" style={{ borderColor: 'var(--color-muted)' }} aria-invalid={!!error} />
        <select value={style} onChange={(e) => setStyle(e.target.value)} aria-label={t('demo.styleLabel')} className="rounded-xl border bg-transparent px-4 py-2" style={{ borderColor: 'var(--color-muted)' }}>
          {styles.map((s) => <option key={s} value={s} className="text-black">{s}</option>)}
        </select>
        <button type="button" onClick={generate} disabled={loading} className="btn-primary button-md whitespace-nowrap">
          <Sparkle size={18} />{loading ? t('demo.generating') : t('demo.generate')}
        </button>
      </div>
      {error ? <p className="caption-2 mt-2 text-red-400" role="alert">{error}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {loading ? <div className="skeleton h-40 rounded-xl" role="status" aria-label={t('demo.loading')} /> : null}
        {made.length === 0 && !loading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-4 text-center sm:col-span-3" style={{ borderColor: 'var(--color-muted)' }}>
            <ImageIcon size={24} style={{ color: 'var(--color-accent)' }} />
            <p className="body-6 opacity-70">{t('demo.empty')}</p>
          </div>
        ) : null}
        {made.map((m) => (
          <figure key={m} className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-muted)' }}>
            <Art seed={m} label={m} />
            <figcaption className="body-6 p-4">{m}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export function Examples() {
  const { t, ta } = useLang()
  const items = ta<{ prompt: string; style: string }>('examples.items')
  const filters = ta<string>('examples.filters')
  const [filter, setFilter] = useState(filters[0] || '')
  const shown = useMemo(() => (filter === filters[0] ? items : items.filter((it) => it.style === filter)), [filter, items, filters])
  return (
    <section id="examples" aria-labelledby="examples-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-8">
      <SectionHead eyebrow={t('examples.eyebrow')} title={t('examples.title')} sub={t('examples.sub')} />
      <div className="mt-8 flex flex-wrap justify-center gap-2" role="tablist" aria-label={t('examples.filterLabel')}>
        {filters.map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className="button-sm rounded-full border px-4 py-2" style={{ borderColor: 'var(--color-muted)', background: filter === f ? 'var(--color-accent)' : 'transparent', color: filter === f ? '#fff' : 'inherit' }}>
            {f}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="body-3 mt-12 text-center opacity-70">{t('examples.empty')}</p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((it, i) => (
            <Reveal key={`${it.prompt}-${i}`}>
              <figure className="overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--color-muted)', background: 'var(--color-surface)' }}>
                <Art seed={it.prompt} label={it.prompt} />
                <figcaption className="p-4">
                  <p className="body-3">{it.prompt}</p>
                  <p className="caption-2 mt-2 opacity-70">{it.style}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  )
}
