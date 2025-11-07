import './globals.css';
import NavBar from './componentes/NavBar';

export const metadata = {
  title: 'GuessHub',
  description: 'Adivinhe personagens • séries • filmes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
