# expo-quant-u

[![license](https://img.shields.io/badge/license-MIT%2FApache--2.0-blue")](LICENSE-MIT)
[![site](https://img.shields.io/badge/www-quantu-blue.svg)](https://quantu.app/)
[![build](https://github.com/quantu-app/expo-quant-u/workflows/Test/badge.svg)](https://github.com/quantu-app/expo-quant-u/actions?query=workflow%3ABuild)

## Tech

- [Expo](https://docs.expo.io/)/[React Native](https://reactnative.dev/docs/getting-started)
- [ui-kitten](https://akveo.github.io/react-native-ui-kitten/docs/)
- [Icons](https://akveo.github.io/eva-icons/#/)

## Getting Started

## Add the submodules

```bash
git submodule init
git submodule update
```

Install deps and start the dev server

```bash
npm install
npm run courses
npm run generators
npm run web
```

### Writing Courses

`courses-src` contains the categories and their course, use `npm run syncCourses` to regenerate the courses

### Writing Generators

`generators-src` contains generator funtions, use `npm run syncGenerators` to regenerate the generators

## Build Android (WIP)

```bash
ngrok http 127.0.0.1:8080 -host-header="127.0.0.1:8080"
```

```bash
expo export --public-url https://4cb998adf5ad.ngrok.io
turtle build:android --public-url https://4cb998adf5ad.ngrok.io/android-index.json
```
