# Foodfy-Final
Projeto desenvolvido como conclusão do curso LaunchBase da Rocketseat

# Descrição
Consiste em um site voltado à culinária, com funcionalidades de registro de receitas, chefs e uma própria comunidade de usuários destinada a popular a aplicação. Foram usadas durante o desenvolvimento diversas ferramentas abordadas durante o curso LaunchBase, são elas:
- Padrão de projeto MVC;
- Node.js;
- PostgreSQL;
- Nunjucks;
- Express;
- Express Session;
- Faker;
- Nodemon;
- Browser-Sync
- Bcryptjs;
- Multer;
- Nodemailer

# Funcionalidades
Ao final do desenvolvimento, o projeto resultou em uma aplicação funcional que busca aplicar as ferramentas descritas. Algumas funcionalidades são:
- Controle de dados por banco de dados Postbird;
- Controle de sessão de usuário com verificação de email e senha;
- Criptografia de senha permitindo segurança no armazenamento dos dados;
- Solicitação e funcionalidade de recuperação de senha com envio de email ao usuário;
- Gerenciamento de usuários, chefs e receitas limitado à administradores;
- Bloqueio de rotas baseando-se em usuários visitantes, usuários cadastrados e administradores;
- Adição, edição e remoção de imagens por banco de dados;
- Criação de dados fakes visando popular a aplicação

# Instruções para uso
Utilizar: Nodejs, Postgre, Postbird, Mailtrap.io

- Com o Nodejs, utilizar o 'npm install' no terminal para instalar todas as ferramentas necessárias, além dos arquivos 'package-lock.json' e 'node_modules';
- Inserir os valores de 'user' e 'password' no arquivo 'db.js' referente aos seus dados no Postgre. Criar um banco de dados no Postbird utilizando os comandos presentes no arquivo 'database.sql';
- Com banco de dados criado, digitar 'node seed.js' no terminal para inicializar a criação de dados fakes. Se houver a necessidade de modificar a quantidade de usuários, chefs ou receitas criadas, reescreva os valores das respectivas variáveis no arquivo 'seed.js';
- Iniciar o servidor utilizando 'npm start';
- Após a criação de dados fakes, o usuário de id '1' será o administrador do site, possuindo liberdade para todas as funcionalidades da aplicação. Copie o email deste usuário e faça login na aplicação usando-o (a senha do administrador e de todos os usuários fakes é '1111');
- Para usar a funcionalidade de envio de emails (ao cadastrar um usuário ou solicitar uma senha nova) utilize o site mailtrap.io e crie um inbox para o foodfy. Configure o inbox para receber dados do Nodemailer;

