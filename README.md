# 🚑 ClinicManager - Sistema de Gerenciamento de Clínica Hospitalar

## 📖 Sobre o Projeto
O **ClinicManager** é um sistema completo para gerenciamento de clínicas hospitalares. Permite o cadastro e gerenciamento de pacientes, médicos, consultas, prontuários, usuários e salas de atendimento.

## 🛠 Tecnologias Utilizadas
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Frontend:** Em andamento
- **Autenticação:** JWT (JSON Web Token)

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
