# Ideahut Quasar Tempate

- Template UI untuk library [Ideahut Spring Boot](https://github.com/ideahut-apps-team/ideahut-springboot-docs/)
- Mendukung Versi 2x dan 3x

## Install
```bash
npm install
npm run lint --fix
icongenie generate -m spa -i icon-512x512.png
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Build the app for production
```bash
quasar build
```

### Environment (file: .env)
```md
API_URL=http://localhost:5401
API_TIMEOUT=60
DEFAULT_LANGUAGE=en
DEVELOPMENT=true
```

### Backend
* [Springboot 3x MVC](https://github.com/thomson470/ideahut-springboot-3x-template-mvc)
* [Springboot 3x Reactive](https://github.com/thomson470/ideahut-springboot-3x-template-flux)
* [Springboot 3x Native](https://github.com/thomson470/ideahut-springboot-3x-template-native)
* [Springboot 2x MVC](https://github.com/thomson470/ideahut-springboot-2x-template-mvc)
* [Springboot 2x Reactive](https://github.com/thomson470/ideahut-springboot-2x-template-flux)


### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-webpack/quasar-config-js).
