# Docopilot

Have an LLM proactively comment on your google doc while working, instead of prompting it yourself every time

## Development

```shell
yarn install
```

Log in to clasp (the cli for pushing code to things like google docs sidebars)

```shell
yarn run login
```

Create a new google doc connected to this script

```shell
yarn run setup
```

(then open the google docs link that is created, though the code won't be there yet)

Deploy the code

```shell
yarn run deploy
```

Refresh the Google Doc (now it should load the code you deployed).

Use the "Docopilot" menu.

### For other useful commands

See package.json

### Screenshot

<img width="1410" alt="image" src="https://github.com/user-attachments/assets/99c5b035-cbf2-42ab-ab3d-f9330a0a4da8" />

## This project is a fork

Of the amazing template [https://github.com/52inc/TypeScript-React-Google-Apps-Script](https://github.com/52inc/TypeScript-React-Google-Apps-Script).

It also has a readme which might be helpful if you're having problems.
