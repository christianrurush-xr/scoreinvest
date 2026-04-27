import './globals.css';

export const metadata = {
  title: 'ScoreInvest — Modelo de Scoring para Inversores',
  description: 'Análisis cuantitativo de empresas del Nasdaq 100 con un modelo de 12 variables. Encuentra oportunidades de inversión respaldadas por datos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
