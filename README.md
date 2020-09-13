# Pec Retriever

Application built in typescript, node.js, express, apollo-server(GraphQL), mongoose(MongoDB), for the retrieval of italian PEC addresses from valid TAX codes.

## Getting Started

### Requirements

- Node.js
- Yarn
- Docker (if you'd like to build and run a production image of the project)

Latest stable versions recommended.

### Installation

open the **.env** file and change the default **DATABASE_CONNECTION_STRING** and **CAPTCHA_API_KEY** values with yours.

```bash
DATABASE_PASSWORD=setheredbpw
CAPTCHA_API_KEY=sethereapikey
```

Then install dependencies and run the code.

```bash
yarn
yarn build
yarn start
```

### Usage

#### local environment

Head to http://localhost:8080/graphql and run queries in the GraphQL editor.
Use the DOCS and SCHEMA tabs as references for how to build your queries and let the autocomplete feature help you.

> :warning: **A wait time of some minutes for query execution is expected for entries not stored in DB!**

example:
```bash
query {
  pecByTaxCode(taxCode: "09276010965", personType: LEGAL)
}
```

#### containerized environment

generate a **.env.production** file in the root folder of the project and copy the **.env** variables with production values,
then build and run the Docker image, then follow the **local environment** instructions.

```bash
yarn
yarn build-container
yarn serve-container
```

### Live version

You can find a live version of the project here: https://pec-retriever.piolalessandro.xyz/graphql

> :warning: **Graphical interface is still WIP!**

A graphical interface that queries the backend is also available at https://piolalessandro.xyz

#### Deployment Choices

- MongoDB database hosted by MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- Backend deployed via Dockerfile on a Digitalocean droplet running Dokku (https://github.com/dokku/dokku)
- Next.js frontend hosted by Vercel (https://vercel.com/)

### Git Hooks

This project uses **Husky** to hook onto git commits and pushes to enforce linting and run tests.
