# ScoreInvest 📊

Dashboard de análisis cuantitativo para inversores. Analiza empresas del Nasdaq 100 usando un modelo de scoring de 12 variables.

## ¿Qué hace?

Evalúa cada empresa con 12 métricas financieras y asigna un puntaje de 0 a 100:
- **PEG Ratio** — ¿Está cara o barata respecto a su crecimiento?
- **Crecimiento de ingresos** — ¿El negocio está creciendo?
- **Flujo de caja libre (FCF)** — ¿Genera efectivo real?
- **ROIC** — ¿Usa bien el capital invertido?
- **Deuda/Capital** — ¿Tiene finanzas sólidas?
- **Actividad de insiders** — ¿Los directivos compran o venden?
- **RSI** — ¿Está sobrecomprada o sobrevendida?
- **Short Interest** — ¿Muchos apuestan a que cae?
- **Earnings Surprise** — ¿Superó o falló las expectativas?
- **Precio objetivo de analistas** — ¿Hay upside?
- **Margen neto** — ¿Es rentable?
- **P/E Ratio** — Verificación de valoración

## Cómo instalarlo

### 1. Obtener API Key
- Ve a [financialmodelingprep.com](https://financialmodelingprep.com)
- Regístrate gratis
- Copia tu API key

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar API Key
Crea un archivo `.env.local` en la raíz del proyecto:
```
NEXT_PUBLIC_FMP_API_KEY=tu_api_key_aqui
```

### 4. Ejecutar en local
```bash
npm run dev
```
Abre http://localhost:3000

## Deploy en Vercel

1. Sube este repositorio a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu GitHub
3. Selecciona el repositorio
4. En "Environment Variables" agrega:
   - Name: `NEXT_PUBLIC_FMP_API_KEY`
   - Value: tu API key
5. Click "Deploy"

¡Listo! Tu dashboard estará online en ~1 minuto.

## Estructura del proyecto
```
scoreinvest/
├── app/
│   ├── globals.css      # Estilos globales
│   ├── layout.js        # Layout raíz
│   └── page.js          # Página principal (dashboard)
├── components/
│   ├── CompanyDetail.js  # Tarjeta de detalle por empresa
│   └── ScoreGauge.js     # Indicador circular de score
├── lib/
│   ├── api.js            # Conexión con Financial Modeling Prep
│   └── scoring.js        # Motor de scoring (12 variables)
├── public/               # Archivos estáticos
├── .env.local            # Tu API key (NO subir a GitHub)
├── .gitignore            # Archivos ignorados por Git
├── next.config.js        # Configuración de Next.js
├── package.json          # Dependencias
└── README.md             # Este archivo
```

## ⚠️ Disclaimer

Este proyecto es con fines **educativos** y no constituye asesoría financiera.
Los resultados del modelo no garantizan rendimientos futuros.
Siempre haz tu propia investigación (DYOR) y consulta con un profesional
antes de tomar decisiones de inversión.

## Licencia

MIT
