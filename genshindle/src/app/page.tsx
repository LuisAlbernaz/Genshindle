'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jogoApi, type PalpitePostResponse, type Personagem } from '@/app/services/jogoService';
import { personagensApi } from '@/app/services/personagensService';
import { GuessRow } from './componentes/GuessRow';
import { Historico } from './componentes/Historico';
import { WinCelebration } from './componentes/WinCelebration';

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function normalize(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export default function Home() {
  const [seed, setSeed] = useState(todayISO());
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<PalpitePostResponse | null>(null);
  const [erro, setErro] = useState('');

  // Histórico local
  const [historico, setHistorico] = useState<PalpitePostResponse[]>([]);
  const [showWin, setShowWin] = useState(false);

  // Autocomplete
  const [todos, setTodos] = useState<Personagem[]>([]);
  const [openSugestoes, setOpenSugestoes] = useState(false);
  const [highlight, setHighlight] = useState(0);

  useEffect(() => {
    personagensApi.listar().then((list) => {
      setTodos(list.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')));
    });
  }, []);

  const sugestoes = useMemo(() => {
    if (!nome) return [];
    const q = normalize(nome);
    return todos.filter((p) => normalize(p.nome).includes(q)).slice(0, 8);
  }, [nome, todos]);

  async function enviar() {
    setErro('');
    setResp(null);
    setLoading(true);
    try {
      const r = await jogoApi.postPalpite(seed, nome);
      setResp(r);
      setHistorico((h) => [r, ...h].slice(0, 10)); // guarda os 10 últimos
      setOpenSugestoes(false);
      if (r.acertou) setShowWin(true);
    } catch (e: any) {
      setErro(e?.message ?? 'Falha ao enviar palpite');
    } finally {
      setLoading(false);
    }
  }

  function escolher(p: Personagem) {
    setNome(p.nome);
    setOpenSugestoes(false);
    setHighlight(0);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') return enviar();
    if (!sugestoes.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => (h + 1) % sugestoes.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => (h - 1 + sugestoes.length) % sugestoes.length);
    } else if (e.key === 'Tab' && sugestoes[highlight]) {
      // tab completa a primeira sugestão
      e.preventDefault();
      escolher(sugestoes[highlight]);
    } else if (e.key === 'Escape') {
      setOpenSugestoes(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://i.redd.it/new-moon-event-backgrounds-with-the-genshin-logo-removed-v0-20375y7uoyre1.jpg?width=2500&format=pjpg&auto=webp&s=a842786090aa0c33658406f3948ff1b11e0869ac')",
      }}
    >
      <div className="min-h-screen bg-[rgba(8,12,26,0.55)]">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <motion.h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--title)] drop-shadow-lg"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            Genshin — Adivinhe o Personagem
          </motion.h1>

          <motion.p
            className="text-[var(--muted)] mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Digite a <b>seed</b> (ex.: data do dia) e o <b>nome</b> do personagem.
            Cada bloco fica <span className="text-emerald-300 font-semibold">verde</span> se você acertar e
            <span className="text-rose-300 font-semibold"> vermelho</span> se errar.
          </motion.p>

          {/* Form + Autocomplete */}
          <div className="mt-7 grid gap-3 sm:grid-cols-[200px_minmax(0,1fr)_auto] relative">
            <input
              className="border rounded-xl px-3 py-2 outline-none bg-[var(--field)] text-[var(--text)] border-[var(--stroke)] focus:ring-2 focus:ring-[var(--accent)]/60"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="YYYY-MM-DD"
            />

            <div className="relative">
              <input
                className="w-full border rounded-xl px-3 py-2 outline-none bg-[var(--field)] text-[var(--text)] border-[var(--stroke)] focus:ring-2 focus:ring-[var(--accent)]/60"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setOpenSugestoes(true);
                }}
                placeholder="Ex.: Diluc, Bennett, Venti..."
                onFocus={() => nome && setOpenSugestoes(true)}
                onKeyDown={onKeyDown}
                autoComplete="off"
              />

              <AnimatePresence>
                {openSugestoes && sugestoes.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-[var(--stroke)] shadow-2xl backdrop-blur bg-[var(--menu)]"
                  >
                    {sugestoes.map((p, i) => (
                      <motion.li
                        key={p.nome}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => escolher(p)}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                          i === highlight ? 'bg-[var(--highlight)]' : 'hover:bg-[var(--hover)]'
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.12, delay: i * 0.02 }}
                      >
                        <img
                          src={p.imagem}
                          alt={p.nome}
                          className="w-7 h-7 rounded-md object-cover"
                          loading="lazy"
                        />
                        <span className="text-[var(--text)]">{p.nome}</span>
                        <span className="ml-auto text-xs text-[var(--muted)]">{p.regiao}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={enviar}
              disabled={loading || !seed || !nome}
              className="rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-2)] text-white font-semibold px-5 py-2 disabled:opacity-60 shadow-lg"
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </motion.button>
          </div>

          {erro && (
            <motion.div
              className="mt-3 text-rose-200 bg-rose-900/40 border border-rose-700/40 rounded-xl px-3 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {erro}
            </motion.div>
          )}

          {/* Linha principal */}
          <div className="mt-8">
            <GuessRow data={resp ?? undefined} />
          </div>

          {/* Histórico */}
          {historico.length > 0 && <Historico items={historico} />}

        </div>
      </div>

      {/* Paleta global */}
      <style jsx global>{`
        :root {
          --title: #e6eeff;
          --text: #edf2ff;
          --muted: #c6d0f5;
          --accent: #5b8cff;
          --accent-2: #4c7ef0;
          --field: rgba(18, 26, 48, 0.65);
          --surface: rgba(18, 26, 48, 0.55);
          --menu: rgba(15, 21, 40, 0.85);
          --hover: rgba(92, 122, 200, 0.22);
          --highlight: rgba(91, 140, 255, 0.28);
          --stroke: rgba(203, 213, 255, 0.28);
        }
      `}</style>

      {/* Animação de vitória */}
      <WinCelebration show={showWin} onClose={() => setShowWin(false)} />
    </main>
  );
}
