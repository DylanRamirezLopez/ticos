# TICOS — Red Social Anónima y Creativa

> **Creado por Dylan Andres Ramirez Lopez**  
> _Todos los derechos reservados © 2026_

---

## 📖 Tabla de Contenidos

- [¿Qué es TICOS?](#-qué-es-ticos)
- [¿Por qué TICOS?](#-por-qué-ticos)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura General](#-arquitectura-general)
- [Características Principales](#-características-principales)
- [Seguridad Implementada](#-seguridad-implementada)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación Local](#-instalación-local)
- [Despliegue (Vercel + Render)](#-despliegue-vercel--render)
- [API Endpoints](#-api-endpoints)
- [Licencia](#-licencia)

---

## 🚀 ¿Qué es TICOS?

TICOS es una red social moderna que combina lo mejor de Instagram, Reddit, 4chan y Twitter en una sola plataforma. Su filosofía es simple: **máxima libertad de expresión dentro de los límites legales, con anonimato real cuando el usuario lo elija.**

No es solo otro clon de Instagram. TICOS introduce conceptos innovadores como:

- **Echo** — Un muro anónimo de sentimientos donde la IA analiza cómo te sientes y te muestra cuántas personas se sintieron igual que tú esta semana. Los posts se autodestruyen en 24 horas.
- **Modo Anónimo** — Activalo y todo tu contenido se vuelve anónimo. Los usuarios sin modo anónimo no pueden ver tu contenido ni interactuar con vos.
- **Grupos con Roles y Permisos** — Creá grupos públicos o anónimos, asigná roles personalizados con permisos granulares (quién puede invitar, enviar imágenes, crear enlaces, etc.).
- **Compartir Posts** — Compartí cualquier post directamente en mensajes directos, como en Instagram.
- **Stories** — Stories efímeras de 24 horas como en Instagram.

---

## 🤔 ¿Por qué TICOS?

Las redes sociales actuales tienen problemas claros:

| Problema | Solución de TICOS |
|---|---|
| **Falta de anonimato real** | Modo anónimo completo: tu identidad nunca se muestra al público |
| **Algoritmos manipuladores** | Feed cronológico, sin manipulación algorítmica |
| **Censura ideológica** | Moderación basada en legalidad, no en ideología |
| **Privacidad dudosa** | Políticas claras: el anonimato es público, no absoluto frente a la ley |
| **Sin expresión emocional** | Echo: compartí cómo te sentís, 100% anónimo, con análisis de sentimiento |
| **Grupos sin control** | Roles y permisos granulares para grupos |

TICOS fue creado porque creo que **la gente merece una red social que priorice su privacidad, su libertad de expresión y su bienestar emocional** por sobre las ganancias publicitarias y los algoritmos de engagement.

---

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| React | 18.x | UI library |
| React Router | 6.x | Routing SPA |
| Tailwind CSS | 3.x | Estilos utility-first |
| Framer Motion | 10.x | Animaciones |
| Axios | 1.x | HTTP client |
| Socket.io Client | 4.x | Tiempo real |
| React Icons | 4.x | Iconografía |

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| Node.js | 24.x | Runtime |
| Express | 4.x | Framework HTTP |
| Mongoose | 8.x | ODM para MongoDB |
| Socket.io | 4.x | WebSockets tiempo real |
| JWT | 9.x | Autenticación |
| bcryptjs | 2.x | Hashing de contraseñas |
| Multer | 1.x | Upload de archivos |
| Cloudinary | 1.x | CDN de imágenes |

### Seguridad
| Tecnología | Propósito |
|---|---|
| Helmet | HTTP headers seguros |
| express-rate-limit | Rate limiting por IP |
| express-mongo-sanitize | Prevención NoSQL injection |
| Sentry | Error tracking |
| CORS estricto | Solo orígenes permitidos |
| Validación de datos | Sanitización de inputs |

### Base de Datos
| Tecnología | Propósito |
|---|---|
| MongoDB Atlas | Base de datos NoSQL en la nube |
| TTL Index | Auto-eliminación de stories y echoes |

### Despliegue
| Servicio | Propósito |
|---|---|
| Vercel | Frontend (React SPA) |
| Render | Backend (Express API) |
| Cloudinary | CDN de imágenes |

---

## 🏗 Arquitectura General

```
┌──────────────────────────────────────────────────┐
│                   Cliente (React)                 │
│  localhost:3000 / ticos.vercel.app               │
│                                                   │
│  ┌─────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ Auth UI │ │ Feed UI  │ │ Echo / Messages   │  │
│  └────┬────┘ └────┬─────┘ └────────┬──────────┘  │
│       │           │                 │              │
│       └───────────┼─────────────────┘              │
│                   │ Axios (REST)                   │
└───────────────────┼────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│               Servidor (Express)                  │
│   localhost:5000 / ticos-api.onrender.com         │
│                                                    │
│  ┌─────────────┐  ┌──────────┐  ┌─────────────┐   │
│  │ Auth Routes │  │ API REST │  │ Socket.io    │   │
│  └─────────────┘  └────┬─────┘  └──────┬──────┘   │
│                        │               │           │
│  ┌─────────────────────┼───────────────┘           │
│  │                     │                           │
│  │  ┌──────────────────▼──────────────────┐        │
│  │  │      MongoDB (Mongoose ODM)         │        │
│  │  │   Atlas → cluster0.j7xhfcp          │        │
│  │  └─────────────────────────────────────┘        │
│  │                                                 │
│  │  ┌─────────────────────────────────────┐        │
│  │  │      Cloudinary (CDN imágenes)      │        │
│  │  └─────────────────────────────────────┘        │
└────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Autenticación**: El frontend envía credenciales → backend valida → devuelve JWT → se almacena en localStorage/sessionStorage según "Remember me"
2. **Posts**: El frontend sube imagen + caption → Multer la guarda temporalmente → se sube a Cloudinary → se guarda la URL en MongoDB
3. **Tiempo Real**: Socket.io maneja mensajes, notificaciones de nuevos posts, typing indicators
4. **Echo**: El texto se analiza con un lexicon de sentimientos → se clasifica en 13 categorías → se guarda con TTL de 24h
5. **Modo Anónimo**: Cada request verifica `user.anonymousModeEnabled` para filtrar contenido visible

---

## ✨ Características Principales

### 📸 Posts
- Posts de imagen con caption
- Posts de solo texto (estilo 4chan)
- Doble tap para like con animación de corazón
- Comentarios en tiempo real
- Compartir posts por DM
- Scroll infinito en feed y explore

### 👻 Modo Anónimo
- Activación con aceptación de términos y políticas
- Una vez activo, todos los posts son automáticamente anónimos
- Usuarios anónimos solo ven contenido anónimo
- Usuarios no anónimos solo ven contenido normal
- Desactivación requiere confirmación explícita

### 💬 Echo — Muro de Sentimientos
- Posts anónimos que expresan emociones
- Análisis de sentimiento en 13 categorías (happy, sad, angry, anxious, loved, lonely, hopeful, grateful, stressed, excited, tired, confused, neutral)
- Muestra cuántas personas se sintieron igual esta semana
- Reacciones con emojis (❤️, 🫂, 💪, 😢, 😂, 🔥, 🕊️, 💡)
- Respuestas anónimas
- Autodestrucción en 24h (TTL index)
- Estadísticas semanales de sentimiento

### 👥 Grupos con Roles
- Grupos públicos o anónimos (identidades ocultas)
- Sistema de roles: creator, admin, member + roles personalizados
- Permisos granulares: invite, createLinks, sendImages, sendLinks, sendText, manageRoles, removeMembers, changeName, pinMessages
- Unirse por código de invitación
- Mensajería en tiempo real

### 💌 Mensajería Directa
- Chat en tiempo real con Socket.io
- Compartir posts en mensajes
- Indicadores de escritura
- Filtro por modo anónimo (solo puedes hablar con quienes tengan tu mismo modo)

### 📖 Stories
- Stories de 24 horas con auto-eliminación
- Visualización con progress bar
- Vistas trackeadas

---

## 🔒 Seguridad Implementada

TICOS fue desarrollado siguiendo las mejores prácticas de seguridad para aplicaciones web modernas:

### 1. 🔐 Autenticación Segura
- JWT con expiración de 30 días
- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Rate limiting en login/register: máximo 10 intentos por 15 minutos

### 2. 🛡️ Protección contra Ataques
- **Helmet**: Headers HTTP seguros (XSS, clickjacking, MIME sniffing)
- **express-rate-limit**: 200 requests por 15 minutos global, 10 para auth
- **express-mongo-sanitize**: Previene NoSQL injection ($gt, $ne, etc.)
- **Validación de datos**: Todos los inputs son sanitizados y validados
- **CORS estricto**: Solo orígenes en whitelist permitidos

### 3. 📁 Seguridad de Archivos
- Solo imágenes permitidas (jpeg, jpg, png, gif, webp)
- Máximo 5MB por archivo
- Hash SHA-256 calculado para cada archivo subido
- Almacenamiento en Cloudinary con CDN

### 4. 🔑 Gestión de Secretos
- Todas las claves en variables de entorno
- `.env` excluido del repositorio
- `.env.production` incluido como template (sin valores reales sensibles...)

### 5. 📊 Monitoreo
- Sentry para error tracking en producción
- Logging centralizado con mensajes descriptivos

---

## 📁 Estructura del Proyecto

```
ticos/
│
├── client/                          # Frontend React
│   ├── public/                      # Archivos estáticos
│   │   └── index.html
│   ├── src/
│   │   ├── api/                     # Cliente Axios con interceptors
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── echo/                # Echo (muro de sentimientos)
│   │   │   ├── feed/                # PostCard, PostActions, Comentarios
│   │   │   ├── layout/              # Navbar, MobileBottomNav, LayoutShell
│   │   │   ├── messages/            # Chat, ConversationList, GroupSettings
│   │   │   ├── profile/             # ProfileHeader, EditProfileModal
│   │   │   ├── search/              # SearchBar, SearchResults
│   │   │   ├── settings/            # TermsModal (políticas)
│   │   │   ├── stories/             # StoryBar, StoryViewer
│   │   │   └── ui/                  # Botones, Inputs, Modales, Skeleton
│   │   ├── context/                 # AuthContext, SocketContext, LanguageContext, ThemeContext
│   │   ├── hooks/                   # useDebounce, useMediaQuery
│   │   ├── i18n/                    # Traducciones EN/ES
│   │   ├── pages/                   # Cada página de la app
│   │   ├── config.js                # URLs de API configurables
│   │   ├── App.js                   # Routing principal
│   │   ├── index.js                 # Entry point
│   │   └── index.css                # Tailwind + estilos globales
│   ├── tailwind.config.js           # Configuración de Tailwind con dark mode
│   └── package.json
│
├── server/                          # Backend Express
│   ├── config/                      # Conexión DB, Cloudinary
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/                 # Lógica de negocio
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── echo.js
│   │   ├── messages.js
│   │   ├── posts.js
│   │   ├── stories.js
│   │   └── users.js
│   ├── middleware/                  # Auth JWT, validación
│   │   ├── auth.js
│   │   └── validate.js
│   ├── models/                      # Schemas Mongoose
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Message.js
│   │   ├── Story.js
│   │   ├── Echo.js
│   │   ├── Group.js
│   │   └── GroupMessage.js
│   ├── routes/                      # Definición de rutas REST
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── echo.js
│   │   ├── messages.js
│   │   ├── posts.js
│   │   ├── stories.js
│   │   ├── upload.js
│   │   └── users.js
│   ├── socket/                      # Configuración Socket.io
│   │   └── index.js
│   ├── uploads/                     # Directorio temporal de archivos
│   ├── utils/
│   │   └── sentiment.js             # Analizador de sentimiento
│   ├── index.js                     # Entry point del servidor
│   ├── render.yaml                  # Config para Render deploy
│   ├── .env.production              # Template de variables de entorno
│   └── package.json
│
├── .gitignore                       # Archivos ignorados por git
├── LICENSE                          # Todos los derechos reservados
├── README.md                        # Este archivo
├── vercel.json                      # Config para Vercel deploy
├── package.json                     # Scripts raíz (concurrently)
├── run.bat                          # Script para iniciar local
├── go-live.ps1                      # Script PowerShell
└── install.bat                      # Instalación de dependencias
```

---

## 💻 Instalación Local

### Prerrequisitos
- Node.js 18+ 
- MongoDB Atlas cuenta (o MongoDB local)
- Una cuenta de Cloudinary (gratis)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ticos.git
cd ticos

# 2. Instalar dependencias
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 3. Configurar variables de entorno
# Editar server/.env con:
# MONGO_URI, JWT_SECRET, CLOUDINARY_*

# 4. Iniciar en desarrollo
npm run dev
```

El frontend se abrirá en `http://localhost:3000` y el backend en `http://localhost:5000`.

---

## 🚢 Despliegue (Vercel + Render)

### Backend (Render)

1. Crear cuenta en https://render.com
2. New Web Service → conectar repositorio
3. Configurar:
   - **Root Directory:** `server`
   - **Build:** `npm install`
   - **Start:** `node index.js`
   - **Plan:** Free
4. Agregar Environment Variables:
   - `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Frontend (Vercel)

1. Crear cuenta en https://vercel.com
2. New Project → conectar repositorio
3. Configurar:
   - **Root Directory:** `client`
   - **Framework:** Create React App
4. Agregar Environment Variables:
   - `REACT_APP_API_URL=https://tu-api.onrender.com/api`
   - `REACT_APP_SOCKET_URL=https://tu-api.onrender.com`
   - `REACT_APP_BACKEND_URL=https://tu-api.onrender.com`

---

## 📡 API Endpoints

### Auth
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |
| GET | `/api/auth/me` | Perfil del usuario actual |
| PUT | `/api/auth/profile` | Actualizar perfil |
| PUT | `/api/auth/settings` | Actualizar configuración |

### Posts
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/posts` | Crear post (imagen o texto) |
| GET | `/api/posts/feed` | Feed de usuarios seguidos |
| GET | `/api/posts/global` | Feed global |
| GET | `/api/posts/user/:id` | Posts de un usuario |
| GET | `/api/posts/:id` | Post individual |
| PUT | `/api/posts/:id/like` | Like/unlike |
| DELETE | `/api/posts/:id` | Eliminar post |

### Echo
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/echo` | Crear echo (con análisis de sentimiento) |
| GET | `/api/echo/feed` | Feed de echoes |
| GET | `/api/echo/stats` | Estadísticas semanales de sentimiento |
| GET | `/api/echo/:id/replies` | Respuestas de un echo |
| POST | `/api/echo/:id/react` | Reaccionar a un echo |

### Messages
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/messages` | Enviar mensaje |
| GET | `/api/messages/conversations` | Listar conversaciones |
| GET | `/api/messages/:userId` | Conversación con usuario |
| POST | `/api/messages/group` | Crear grupo |
| POST | `/api/messages/group/join` | Unirse a grupo |
| POST | `/api/messages/group/message` | Mensaje grupal |
| GET | `/api/messages/group/:id/messages` | Mensajes del grupo |
| PUT | `/api/messages/group/:id/roles` | Gestionar roles |

### Comments
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/comments/:postId` | Crear comentario |
| GET | `/api/comments/:postId` | Obtener comentarios |
| PUT | `/api/comments/:id/like` | Like/unlike comentario |
| DELETE | `/api/comments/:id` | Eliminar comentario |

### Stories
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/stories` | Crear story |
| GET | `/api/stories/following` | Stories de seguidos |
| PUT | `/api/stories/:id/view` | Marcar como vista |
| DELETE | `/api/stories/:id` | Eliminar story |

### Users
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users/:username` | Perfil de usuario |
| GET | `/api/users/search?q=` | Buscar usuarios |
| POST | `/api/users/:id/follow` | Seguir/dejar de seguir |
| GET | `/api/users/suggested` | Usuarios sugeridos |

---

## 📜 Licencia

**All Rights Reserved** — Copyright © 2026 Dylan Andres Ramirez Lopez

Este proyecto es propiedad intelectual de Dylan Andres Ramirez Lopez. Todos los derechos reservados. No está permitido el uso, reproducción, distribución o modificación sin autorización explícita y por escrito del autor.

Ver el archivo [LICENSE](./LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Dylan Andres Ramirez Lopez**
- Proyecto: TICOS
- Año: 2026

---

> _"La mejor red social es la que te da el control de tu propia privacidad."_
