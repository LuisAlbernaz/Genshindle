'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PalpitePostResponse, Personagem } from '@/app/services/jogoService';
import Image from 'next/image';
import clsx from 'clsx';

type CellState = 'igual' | 'diferente' | 'neutro';

const PLACEHOLDER_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAqMBx0xW+z8AAAAASUVORK5CYII=';

const pill = (s: CellState) =>
  clsx(
    'text-xs px-2 py-0.5 rounded-full border',
    s === 'igual' && 'bg-emerald-300/20 text-emerald-100 border-emerald-300/40',
    s === 'diferente' && 'bg-rose-300/20 text-rose-100 border-rose-300/40',
    s === 'neutro' && 'bg-white/10 text-[var(--muted)] border-[var(--stroke)]'
  );

function cellColors(state: CellState) {
  return clsx(
    'rounded-2xl border p-4 sm:p-5 shadow transition-colors backdrop-blur',
    state === 'igual' && 'bg-emerald-200/20 border-emerald-300/50',
    state === 'diferente' && 'bg-rose-200/20 border-rose-400/50',
    state === 'neutro' && 'bg-[var(--surface)] border-[var(--stroke)]'
  );
}

function VisionIcon({ vision }: { vision: Personagem['elemento'] }) {
  const map: Record<string, string> = {
    Pyro: '🔥', Hydro: '💧', Electro: '⚡', Cryo: '❄️',
    Anemo: '🌪️', Geo: '🪨', Dendro: '🌿', Viajante: '✨',
  };
  return <span className="text-2xl">{map[vision] ?? '✨'}</span>;
}

function WeaponIcon({ weapon }: { weapon: Personagem['arma'] }) {
  const map: Record<string, string> = {
    Espada: '🗡️', Espadão: '⚔️', Lança: '🪖', Catalisador: '🔮', Arco: '🏹',
  };
  return <span className="text-2xl">{map[weapon] ?? '🔰'}</span>;
}

export function GuessRow({
  data,
  imageUrl,
}: {
  data?: PalpitePostResponse;
  imageUrl?: string;
}) {
  const [imgBroken, setImgBroken] = useState(false);

  const palpite = data?.palpite as Partial<Personagem> | undefined;
  const alvo = data?.alvo as Partial<Personagem> | undefined;

  const nameState: CellState = data ? (data.acertou ? 'igual' : 'diferente') : 'neutro';
  const regionState: CellState = data ? (data.comparacao.regiao === 'igual' ? 'igual' : 'diferente') : 'neutro';
  const visionState: CellState = data ? (data.comparacao.elemento === 'igual' ? 'igual' : 'diferente') : 'neutro';
  const weaponState: CellState = data ? (data.comparacao.arma === 'igual' ? 'igual' : 'diferente') : 'neutro';

  const fotoCandidata = palpite?.imagem?.trim() || imageUrl?.trim() || PLACEHOLDER_SRC;
  const fotoSrc = imgBroken ? PLACEHOLDER_SRC : fotoCandidata;

  const headerClasses =
    'rounded-xl bg-[var(--menu)] text-[var(--text)]/90 px-4 py-3 font-semibold shadow border border-[var(--stroke)] capitalize';

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[980px]">
        {/* Header */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          {['photo', 'name', 'region', 'vision', 'weapon'].map((h, i) => (
            <motion.div
              key={h}
              className={headerClasses}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 170, damping: 20 }}
            >
              {h}
            </motion.div>
          ))}
        </div>

        {/* Row */}
        <div className="grid grid-cols-5 gap-3">
          {/* Photo */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cellColors('neutro')}
          >
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 shrink-0 ring-1 ring-white/10">
                <Image
                  alt={palpite?.nome ?? 'character'}
                  src={fotoSrc}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  sizes="96px"
                  onError={() => setImgBroken(true)}
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm text-[var(--muted)]">Palpite</p>
                <p className="text-xl font-bold text-[var(--text)]">{palpite?.nome ?? '—'}</p>
              </div>
            </div>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className={cellColors(nameState)}
          >
            <div className="flex items-start justify-between">
              <p className="text-[13px] text-[var(--muted)]">Nome</p>
              <span className={pill(nameState)}>{nameState === 'igual' ? 'Correto' : 'Errado'}</span>
            </div>
            <p className="mt-1 text-3xl font-extrabold text-[var(--text)]">{palpite?.nome ?? '—'}</p>
            {!data && <p className="text-xs text-[var(--muted)] mt-1">Digite e envie um palpite</p>}
          </motion.div>

          {/* Region */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05, type: 'spring', stiffness: 200, damping: 18 }}
            className={cellColors(regionState)}
          >
            <div className="flex items-start justify-between">
              <p className="text-[13px] text-[var(--muted)]">Região</p>
              <span className={pill(regionState)}>{regionState === 'igual' ? 'Igual' : 'Diferente'}</span>
            </div>
            <p className="mt-1 text-2xl font-semibold text-[var(--text)]">{palpite?.regiao ?? '—'}</p>
            {alvo?.regiao && !data?.acertou && regionState === 'diferente' && (
              <p className="text-xs text-[var(--muted)] mt-1">Alvo não é de {palpite?.regiao}</p>
            )}
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 18 }}
            className={cellColors(visionState)}
          >
            <div className="flex items-start justify-between">
              <p className="text-[13px] text-[var(--muted)]">Visão</p>
              <span className={pill(visionState)}>{visionState === 'igual' ? 'Igual' : 'Diferente'}</span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <VisionIcon vision={palpite?.elemento as any} />
              <p className="text-2xl font-semibold text-[var(--text)]">{palpite?.elemento ?? '—'}</p>
            </div>
            {alvo?.elemento && !data?.acertou && visionState === 'diferente' && (
              <p className="text-xs text-[var(--muted)] mt-1">Alvo não é {palpite?.elemento}</p>
            )}
          </motion.div>

          {/* Weapon */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 18 }}
            className={cellColors(weaponState)}
          >
            <div className="flex items-start justify-between">
              <p className="text-[13px] text-[var(--muted)]">Arma</p>
              <span className={pill(weaponState)}>{weaponState === 'igual' ? 'Igual' : 'Diferente'}</span>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <WeaponIcon weapon={palpite?.arma as any} />
              <p className="text-2xl font-semibold text-[var(--text)]">{palpite?.arma ?? '—'}</p>
            </div>
            {alvo?.arma && !data?.acertou && weaponState === 'diferente' && (
              <p className="text-xs text-[var(--muted)] mt-1">Alvo não usa {palpite?.arma}</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
