'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { PalpitePostResponse, Personagem } from '@/app/services/jogoService';

type Estado = 'igual' | 'diferente';

const PLACEHOLDER_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAqMBx0xW+z8AAAAASUVORK5CYII=';

const chipCls = (e: Estado) =>
  `inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs
   ${e === 'igual'
     ? 'bg-emerald-300/20 text-emerald-100 border-emerald-300/40'
     : 'bg-rose-300/20 text-rose-100 border-rose-300/40'}`;

const statusCls = (ok: boolean) =>
  `inline-flex px-2 py-1 rounded-full border text-xs
   ${ok ? 'bg-emerald-300/20 text-emerald-100 border-emerald-300/40'
        : 'bg-rose-300/20 text-rose-100 border-rose-300/40'}`;

function VisionIcon({ v }: { v: Personagem['elemento'] }) {
  const map: Record<string, string> = { Pyro:'🔥', Hydro:'💧', Electro:'⚡', Cryo:'❄️', Anemo:'🌪️', Geo:'🪨', Dendro:'🌿', Viajante:'✨' };
  return <span>{map[v] ?? '✨'}</span>;
}
function WeaponIcon({ w }: { w: Personagem['arma'] }) {
  const map: Record<string, string> = { Espada:'🗡️', Espadão:'⚔️', Lança:'🪖', Catalisador:'🔮', Arco:'🏹' };
  return <span>{map[w] ?? '🔰'}</span>;
}

export function Historico({ items }: { items: PalpitePostResponse[] }) {
  if (!items.length) return null;

  return (
    <div className="mt-10">
      <h3 className="text-[var(--muted)] font-semibold mb-3">Histórico</h3>

      <div className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface)]/60 backdrop-blur">
        <div className="overflow-hidden rounded-2xl">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-[var(--text)]/90">
                <Th>Photo</Th>
                <Th>Nome</Th>
                <Th>Região</Th>
                <Th>Visão</Th>
                <Th>Arma</Th>
                <Th>Resultado</Th>
              </tr>
            </thead>

            <tbody>
              {items.map((it, i) => {
                const p = it.palpite;
                const foto = p.imagem || PLACEHOLDER_SRC;
                return (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-[var(--stroke)] hover:bg-white/5"
                  >
                    <Td>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/20 ring-1 ring-white/10">
                        <Image src={foto} alt={p.nome} width={40} height={40} className="object-cover w-full h-full" />
                      </div>
                    </Td>
                    <Td>
                      <div className="font-semibold text-[var(--text)]">{p.nome}</div>
                    </Td>
                    <Td className="text-[var(--text)]">{p.regiao}</Td>
                    <Td>
                      <span className={chipCls(it.comparacao.elemento)}>
                        <VisionIcon v={p.elemento} /> {p.elemento} — {it.comparacao.elemento}
                      </span>
                    </Td>
                    <Td>
                      <span className={chipCls(it.comparacao.arma)}>
                        <WeaponIcon w={p.arma} /> {p.arma} — {it.comparacao.arma}
                      </span>
                    </Td>
                    <Td>
                      <span className={statusCls(it.acertou)}>{it.acertou ? 'Acertou' : 'Tente de novo'}</span>
                    </Td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* responsivo: empilha as colunas no mobile */}
      <style jsx global>{`
        @media (max-width: 640px) {
          table thead { display: none; }
          table tr { display: grid; grid-template-columns: 56px 1fr; gap: .5rem; padding: .5rem .75rem; }
          table td { padding: .25rem 0 !important; }
          table td:nth-child(1) { grid-row: span 3 / span 3; }
          table td:nth-child(2) { font-size: 1.05rem; font-weight: 700; }
          table td:nth-child(6) { justify-self: end; }
        }
      `}</style>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-sm font-semibold border-b border-[var(--stroke)] bg-[var(--menu)] sticky top-0">
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}
