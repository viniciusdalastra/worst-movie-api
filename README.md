# Worst Movie

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações escaláveis e eficientes em Node.js.
- **TypeORM**: ORM para TypeScript e JavaScript, utilizado para interagir com o banco de dados.
- **SQLite**: Banco de dados em memória para armazenamento de dados.
- **Jest**: Framework de testes utilizado para realizar testes de integração.

## Funcionalidades

- Adicionar novos filmes.
- Atualizar informações de filmes existentes.
- Deletar filmes.
- Consultar todos os filmes ou um filme específico.
- Calcular intervalos entre prêmios dos filmes.

## Como Executar a Aplicação Localmente

### Pré-requisitos

- **Node.js** (versão LTS): [Instale aqui](https://nodejs.org/en/download/).
- **npm**: Geralmente já incluído com a instalação do Node.js.

### Passos

1. **Clone o Repositório**:

   ```bash
   git clone https://github.com/viniciusdalastra/worst-movie-api.git
   ```

2. **Instale as Dependências**:
   ```bash
   npm install
   ```
3. **Execute a Aplicação**:

   ```bash
   npm run start:dev
   ```

   A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

4. **Teste os Endpoints**: Acesse o endpoint para conseguir utilizar o swagger [http://localhost:3000/api](http://localhost:3000/api).

## Como Executar os Testes de Integração

### Passos

1. **Verifique se a Aplicação não está Rodando**.
2. **Execute os Testes**:
   ```bash
   npm run test
   ```
3. **Para rodar em modo de observação**:
   ```bash
   npm run test:watch
   ```
4. **Para verificar a cobertura dos testes**:
   ```bash
   npm run test:cov
   ```

## Autor

- **Nome**: Vinícius Dalastra
- **Email**: viniciusdalastra@hotmail.com
- **GitHub**: [viniciusdalastra](https://github.com/viniciusdalastra)
