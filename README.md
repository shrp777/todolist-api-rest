# API REST Todolist

API REST développée avec Bun + Hono + Base de données SQLite pour la réalisation du projet d'application cross-platforms Todolist avec Flutter.

## Installation

- Environnement d'exécution __Bun__ (<https://bun.sh/>) :

  - Sur __Unix__ (MacOS et Linux) :

    ```bash
    curl -fsSL https://bun.sh/install | bash
    ```

  - Sur __Windows__ :

    ```bash
    powershell -c "irm bun.sh/install.ps1 | iex"
    ```

## Variables d'environnement à renseigner

- Créer un fichier .env à la racine, basé sur le fichier .env.example

## Données SQL à importer dans la base de données SQLite

- Schéma SQL :
    `./sql/schema.sql`

- Données SQL :
    `./sql/data.sql`

## Commandes utiles

- Installation des dépendances NPM

```bash
bun install
```

- Démarrage de l'API

```bash
bun start
```

- Démarrage de l'API avec hot reload activé

```bash
bun watch
```

## Test de l'API REST

- Importer la collection __Bruno__ (<https://www.usebruno.com/>) présente dans `./API Doc`.

--

!["Logotype Shrp"](https://sherpa.one/images/sherpa-logotype.png)

__Alexandre Leroux__  
_Enseignant / Formateur_  
_Développeur logiciel web & mobile_

Nancy (Grand Est, France)

<https://shrp.dev>
