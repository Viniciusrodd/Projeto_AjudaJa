# 🤝 AjudaJá — Plataforma colaborativa de apoio local e trocas solidárias 

O **AjudaJá** é uma plataforma onde pessoas de uma mesma cidade ou bairro podem se conectar para **pedir** e **oferecer ajuda**, **criar campanhas solidárias e fortalecer laços comunitários**.

Tem como foco a ajuda mútua e impacto social.


## 🌟 Qual é o propósito desse projeto?

O **AjudaJá** foi criado para facilitar ações de solidariedade local, promovendo conexões rápidas e eficazes entre quem precisa e quem pode ajudar. A plataforma se alinha com vários **Objetivos de Desenvolvimento Sustentável (ODS)**, como:

- **🤝 ODS 1** - Erradicação da Pobreza
- 🩺 **ODS 3** - Saúde e Bem-estar
- 🏙️ **ODS 11** - Cidades e Comunidades Sustentáveis
- ⚖️ **ODS 16** - Paz, Justiça e Instituições Eficazes


## 🛠️ Funcionalidades principais

### 👤 Usuário comum

- **Cadastro e login** - sistema seguro de autenticação.
- **Criar pedidos de ajuda** - publique solicitações como caronas, doações, indicações, etc.
- **Oferecer ajuda** - compartilhe o que pode doar ou oferecer.
- **Filtrar por tipo, localização e urgência** - encontre rapidamente pedidos próximos. (implementação futura)
- **Comentar e responder** - interação direta entre membros da comunidade.
- **Acompanhar histórico** - visualize suas interações e participações passadas. (implementação futura)

### 🛡️ Moderador voluntário - (tarefas futuras)

- **Sinalizar conteúdos impróprios** - mantenha a plataforma segura. (implementação futura)
- **Ver estatísticas da região** - acompanhe métricas locais de ajuda e pedidos. (implementação futura)
- **Publicar campanhas em destaque** - informe a comunidade sobre ações importantes.


## 💥 Destaques técnicos

- **🔐 Sistema de permissões** - JWT (usuário comum e moderador).
- **📍 Busca geolocalizada** - filtragem por raio e categorias. (implementação futura)
- **📊 Dashboard com métricas** - painel para monitoramento regional. (implementação futura)
- **💬 Módulo de mensagens** - comunicação direta entre usuários. (implementação futura)
- **🗂️ Estrutura organizada** - separação clara entre services, controllers e middlewares.
- **📝 Código documentado** - preparado para contribuições open-source.


## 🖥️ Tecnologias utilizadas

### 🖼️ Frontend (React)
- **React + Vite** - desenvolvimento rápido e moderno.
- **Bulma** - framework CSS leve e responsivo.
- **React Router** - navegação SPA.
- **Axios** - comunicação com a API.

### 🔧 Backend (Node.js)
- **Express.js** - estrutura robusta para API REST. 
- **Sequelize (MySQL)** - gestão de usuários, pedidos, ofertas e categorias.
- **Mongoose (MongoDB)** - armazenamento flexível para comentários, mensagens e avaliações.
- **JWT** - autenticação e controle de permissões.
- **Multer** - upload de arquivos (ex.: imagens de perfil).


## 🚀 Como rodar o projeto localmente

### 🛠️ 1. Pré-requisitos

Antes de começar, instale:

- **Node.js** (LTS recomendado)
- **MySQL**
- **MongoDB**
- **Git** (opcional, mas recomendado)


### 📥 2. Clonar o repositório

```bash
# Clonando o repositório
git clone https://github.com/Viniciusrodd/Projeto_AjudaJa.git

# Acesse a pasta do projeto
cd Projeto_AjudaJa
```

### 📦 3. Configurar o backend

```bash
cd backend
npm install
npm start
```
Isso instalará todas as bibliotecas necessárias, como Express, Sequelize, Mongoose, entre outras.


### 🛢️ 4. Configurar o banco de dados

Abra o MySQL e crie um banco de dados para o projeto:

```sql
CREATE DATABASE ajuda_ja;
```

Configure o arquivo **.env** na raiz do projeto:

```env
DB_NAME=ajuda_ja
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_DIALECT=mysql
SESSION_SECRET=sua_chave_secreta
PORT=2130
JWT_SECRET=sua_chave_jwt
MONGO_URI=seu_uri_mongodb
```

Execute as migrações para criar as tabelas no banco:

```bash
npx sequelize db:migrate
```

### 📦 5. Configurar o frontend

```bash
cd frontend
npm install
npm run dev
```

Por padrão, o Vite irá rodar o frontend em:

```bash
http://localhost:5173
```

### 🌍 6. Acessar a aplicação

Abra o navegador e vá até:

```
http://localhost:5173/cadastro
```

Agora o projeto está pronto para ser usado localmente! 🚀