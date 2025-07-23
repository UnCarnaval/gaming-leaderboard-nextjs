# 🎮 Gaming Leaderboard

Sistema de leaderboard gaming moderno construido con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **Vercel KV**.

## ✨ Características

- 🏆 **Ranking dinámico** por períodos (diario, semanal, mensual, total)
- 👥 **Panel de administración** para gestión de usuarios
- 🎯 **Paneles personales** para cada usuario
- 📱 **Diseño responsive** con tema gaming
- ⚡ **Tiempo real** - actualizaciones instantáneas
- 🔒 **Persistencia segura** con Vercel KV
- 🚀 **Optimizado** para deployment en Vercel

## 🛠️ Tecnologías

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS con tema gaming personalizado
- **Database**: Vercel KV (Redis)
- **Deployment**: Vercel
- **Icons**: Emojis y efectos CSS personalizados

## 🚀 Deployment en Vercel

### 1. **Crear proyecto en Vercel**
```bash
# Conecta tu repositorio de GitHub a Vercel
# Vercel detectará automáticamente que es un proyecto Next.js
```

### 2. **Configurar Vercel KV**

1. En tu dashboard de Vercel:
   - Ve a tu proyecto → **Storage** tab
   - Click **Create Database** → **KV**
   - Dale un nombre: `gaming-leaderboard-db`

2. Vercel generará automáticamente las variables de entorno:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### 3. **Deploy**
```bash
git push origin main
# Vercel auto-deployará tu aplicación
```

### 4. **Verificar funcionamiento**
- ✅ Página principal: rankings funcionando
- ✅ Admin panel: `/admin` - registro de usuarios
- ✅ Paneles usuario: `/user/[codigo]` - sumar/restar puntos

## 💻 Desarrollo Local (Opcional)

Si quieres correr localmente necesitas configurar Vercel KV:

### 1. **Clonar repositorio**
```bash
git clone https://github.com/UnCarnaval/gaming-leaderboard-nextjs.git
cd gaming-leaderboard-nextjs
npm install
```

### 2. **Configurar variables de entorno**
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales de Vercel KV
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

### 3. **Ejecutar localmente**
```bash
npm run dev
# Abre http://localhost:3000
```

## 📖 Guía de Uso

### **Para Administradores:**

1. **Registrar usuarios**: Ve a `/admin`
2. **Crear usuario**: Ingresa nombre, sistema genera código único
3. **Compartir links**: Cada usuario recibe su link personal
4. **Monitorear**: Ver estadísticas y rankings en tiempo real

### **Para Usuarios:**

1. **Acceder**: Usa tu link personal `/user/tu-codigo`
2. **Sumar puntos**: 🔼 cuando completes una orden
3. **Restar puntos**: 🔽 solo para corregir errores
4. **Ver ranking**: Compite en el leaderboard global

## 📊 Estructura de la Aplicación

```
app/
├── page.tsx              # 🏠 Leaderboard principal
├── admin/page.tsx        # ⚙️ Panel de administración  
├── user/[codigo]/page.tsx # 👤 Panel personal de usuario
└── api/                  # 🔌 API Routes
    ├── leaderboard/      # Rankings
    ├── usuarios/         # Gestión de usuarios
    └── puntos/           # Actualización de puntos

lib/
├── utils.ts              # 🛠️ Utilidades del cliente
└── data-server.ts        # 💾 Lógica del servidor + KV

data-server.ts funciones:
- obtenerLeaderboard()
- registrarUsuario()
- actualizarPuntosPorCodigo()
- obtenerEstadisticasUsuario()
```

## 🎨 Personalización

### **Modificar tema gaming:**
```css
/* app/globals.css */
.gaming-header { /* Títulos principales */ }
.leaderboard-card { /* Tarjetas de contenido */ }
.btn-primary { /* Botones principales */ }
.particles-bg { /* Fondo con partículas */ }
```

### **Ajustar períodos:**
```typescript
// lib/data-server.ts
// Personaliza obtenerLeaderboardPorPeriodo()
// para calcular períodos reales basados en fechas
```

## 🔧 Solución de Problemas

### **Error: "Usuario no se guarda"**
- ✅ **Solución**: Configurar Vercel KV correctamente
- Variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` necesarias

### **Build falla**
```bash
# Limpiar caché
rm -rf .next
npm run build
```

### **Datos no persisten**
- ✅ **En Vercel**: Usa Vercel KV (incluido)
- ❌ **En localhost sin KV**: Los datos se perderán

## 📄 Licencia

Proyecto de demostración - Sistema Gaming Leaderboard v2.0

---

**🎮 ¡Listo para competir!** Deploy en Vercel y empieza a trackear tus órdenes gaming.

Para soporte: [Crear issue en GitHub](https://github.com/UnCarnaval/gaming-leaderboard-nextjs/issues) 