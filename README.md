<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a>
    <img src="https://user-images.githubusercontent.com/37854189/127693722-90fe6ea7-60c9-40d5-9a53-9e5e5d971866.jpg">
  </a>

  <h3 align="center">FoodZilla MS Moderation</h3>
  <br />
  
</p>


<!-- ABOUT THE PROJECT -->

### 🔔 About the project

Inteligência usando AWS para reconhecer conteúdos impróprios, de uma forma que possamos controlar melhor os conteúdos na plataforma. Roda em background.

### 🛠️ Built With

Aqui vemos uma das mais poderosas ferramentas usadas pelo Backend Moderation

- [Nodejs](https://nodejs.dev)
- [Express](https://expressjs.com)
- [Socket](https://socket.io)
- [AWS](https://aws.amazon.com)
- [Cron](https://crontab.guru)

<!-- GETTING STARTED -->

## 🚀 Getting Started

Para iniciar o projeto é necessário seguir os passos abaixo:

### 📋 Pre-requisites

É preciso ter heroku-cli e yarn

- yarn

  ```sh
  npm install --global yarn
  ```

- heroku-cli

  ```sh
  npm install -g heroku
  ```

### 🔧 Installation

1. Clone the repo
   ```sh
   git clone https://github.com/LostTechSoftware/bk_clientes
   ```
2. Install packages
   ```sh
   yarn
   ```
3. Clone environment keys
   ```JS
   heroku config -a foodzilla-staging-server -s >> .env
   ```
   
### ✔ Run

```bash
yarn staging
```   

<!-- USAGE EXAMPLES -->

## ⚙️ Usage

Usado para toda a infraestrutura do FoodZilla.


<!-- ROADMAP -->

## 🗺 Roadmap

See the [PRs](https://github.com/LostTechSoftware/bk_moderation/pulls) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

<!-- MARKDOWN LINKS & IMAGES -->

[product-screenshot]: images/screenshot.png
