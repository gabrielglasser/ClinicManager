# 🚑 ClinicManager - Sistema de Gerenciamento de Clínica Hospitalar

## 📖 Sobre o Projeto
O **ClinicManager** é um sistema completo para gerenciamento de clínicas hospitalares. Permite o cadastro e gerenciamento de pacientes, médicos, consultas, prontuários, usuários e salas de atendimento.

🔗 **Acesse o site:** [ClinicManager](https://clinic-manager-psi.vercel.app/)

## 🛠 Tecnologias Utilizadas
### Backend
- **Node.js**
- **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT (JSON Web Token)**
- **Multer** (upload de arquivos)
- **Cloudinary** (armazenamento de imagens)
- **Winston** (logs)
- **Jest** (testes)
- **dotenv** (variáveis de ambiente)
- **CORS**
- **bcryptjs** (hash de senhas)

### Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Sass/SCSS**
- **Vite** (ambiente de build)
- **ESLint** (linting)
- **React Hook Form** (formulários)
- **Zod** (validação de schemas)
- **Axios** (requisições HTTP)
- **Date-fns** (manipulação de datas)
- **React Toastify** e **React Hot Toast** (notificações)
- **Lucide React** e **React Icons** (ícones)
- **Recharts** (gráficos)

Essas tecnologias garantem um sistema robusto, moderno e escalável, tanto no frontend quanto no backend.

## 📌 Funcionalidades
✅ Cadastro, edição, listagem e exclusão de **pacientes**
✅ Cadastro, edição, listagem e exclusão de **médicos**
✅ Gerenciamento de **consultas médicas**
✅ Histórico de **prontuários dos pacientes**
✅ Controle de **usuários e permissões**
✅ Organização de **salas de atendimento**
✅ Interface moderna e responsiva

## 🚀 Como Executar o Projeto

### 🔹 **Pré-requisitos**
- Node.js instalado
- PostgreSQL configurado
- Git instalado

### 🔹 **Clone o Repositório**
```sh
git clone https://github.com/seu-usuario/ClinicManager.git
cd ClinicManager
```

### 🔹 **Configurar o Backend**
```sh
cd backend
npm install
cp .env.example .env # Configure seu banco de dados no .env
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 🔹 **Configurar o Frontend**
```sh
cd frontend
npm install
npm run dev
```


## 📝 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para contribuir! ✨

---

💡 **Desenvolvido por [Gabriel dos Santos Glasser Rodrigues](https://github.com/gabrielglasser)**
