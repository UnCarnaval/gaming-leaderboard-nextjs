# 🎮 Gaming Leaderboard

Sistema de leaderboard gaming moderno con ranking de órdenes por períodos, construido con **Next.js 14** y **Tailwind CSS** para deployment en **Vercel**.

![Gaming Leaderboard](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=nextdotjs)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-blue?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)

## ✨ Características

- **🏆 Ranking en tiempo real** - Leaderboard dinámico con posiciones
- **📊 Períodos múltiples** - Diario, semanal, mensual y total
- **🔗 Links personalizados** - Cada usuario tiene su URL única
- **⚡ Súper rápido** - Optimizado para Vercel y Edge Runtime
- **📱 Responsive** - Funciona perfecto en móviles y desktop
- **🎨 Tema gaming** - Diseño con efectos de neón y partículas
- **🎮 UX moderna** - Interfaz intuitiva estilo videojuego

## 🚀 Deployment en Vercel

### Opción 1: Deploy automático desde GitHub

1. **Fork este repositorio** en tu cuenta de GitHub
2. **Conecta tu GitHub con Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Click en "New Project"
   - Importa tu repositorio
   - Click "Deploy"

### Opción 2: Deploy desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer login
vercel login

# Deploy
vercel --prod
```

### Configuración automática
No necesitas configuración extra. Vercel detecta automáticamente Next.js y configura todo.

## 🛠️ Desarrollo Local

### Prerrequisitos
- **Node.js 18+**
- **npm** o **yarn**

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/gaming-leaderboard
cd gaming-leaderboard

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) para ver la aplicación.

### Scripts disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run start    # Servidor producción
npm run lint     # Linter
```

## 📖 Cómo usar

### Para Administradores

1. **Ve a `/admin`** para registrar usuarios
2. **Cada usuario recibe un código único** automáticamente
3. **Comparte el link personal** con cada usuario
4. **Monitorea el leaderboard** desde la página principal

### Para Usuarios

1. **Accede a tu link personal**: `tuapp.vercel.app/user/tucodigo123`
2. **Botón 🔼**: Suma una orden completada (+1 punto)
3. **Botón 🔽**: Resta si te equivocaste (-1 punto)
4. **Ve tus estadísticas** y posición en tiempo real

## 🏗️ Arquitectura

```
📁 gaming-leaderboard/
├── 📁 app/                 # App Router (Next.js 14)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Leaderboard principal
│   ├── globals.css        # Estilos gaming
│   ├── admin/page.tsx     # Panel administrativo
│   └── user/[codigo]/     # Páginas dinámicas usuarios
├── 📁 lib/
│   └── utils.ts           # Lógica de negocio
├── 📁 components/         # Componentes React (futuro)
├── package.json           # Dependencias
├── tailwind.config.js     # Configuración Tailwind
└── vercel.json           # Configuración Vercel
```

## 🎯 URLs de la aplicación

- **Leaderboard principal**: `/`
- **Panel admin**: `/admin`
- **Panel usuario**: `/user/[codigo]`

### Ejemplos de URLs:
- `https://tuapp.vercel.app/`
- `https://tuapp.vercel.app/admin`
- `https://tuapp.vercel.app/user/juan123`

## 🎨 Personalización

### Colores gaming
Edita `tailwind.config.js` para cambiar la paleta:

```js
colors: {
  primary: { /* azules */ },
  gold: { /* dorados */ },
  silver: { /* plateados */ }
}
```

### Estilos personalizados
Modifica `app/globals.css` para ajustar efectos y animaciones.

## 🔧 Características técnicas

- **Framework**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS 3.3
- **Fuentes**: Orbitron (gaming) + Exo 2 (texto)
- **Almacenamiento**: En memoria (demo) - expandible a DB
- **Deployment**: Vercel Edge Runtime
- **Performance**: Optimizado para Core Web Vitals

## 📊 Sistema de períodos

- **Diario**: Órdenes de hoy
- **Semanal**: Últimos 7 días
- **Mensual**: Últimos 30 días  
- **Total**: Todas las órdenes históricas

## 🚀 Próximas características

- [ ] Base de datos persistente (Supabase/PlanetScale)
- [ ] Autenticación de usuarios
- [ ] Notificaciones push
- [ ] API REST completa
- [ ] Dashboard avanzado
- [ ] Exportación de datos
- [ ] Modo oscuro/claro

## 🐛 Reportar problemas

Si encuentras algún bug o tienes sugerencias:

1. Ve a la pestaña **Issues** 
2. Click en **New Issue**
3. Describe el problema detalladamente

## 📄 Licencia

MIT License - Úsalo libremente en tus proyectos.

## 👨‍💻 Autor

Creado con ❤️ para la comunidad gaming.

---

**¡Happy coding! 🎮✨** 