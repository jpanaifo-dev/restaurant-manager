# Restaurant Manager

![Vista principal](https://firebasestorage.googleapis.com/v0/b/myportafolio-aedd9.appspot.com/o/projects%2Frestaurant-service%2Frestaurant-service.webp?alt=media&token=642d3b9a-4f45-4fed-bac8-1a0103aba481)

![Crear orden](https://firebasestorage.googleapis.com/v0/b/myportafolio-aedd9.appspot.com/o/projects%2Frestaurant-service%2Frestaurant-service-order.webp?alt=media&token=b63cb7fa-8973-4307-b68e-a72fac056a23)

![Listado de órdenes](https://firebasestorage.googleapis.com/v0/b/myportafolio-aedd9.appspot.com/o/projects%2Frestaurant-service%2Forders.webp?alt=media&token=a11cb886-b8ef-408b-9b2a-5bfb68e79bb2)

## Descripción

**Restaurant Manager** es una aplicación web desarrollada con React, TypeScript y Vite que permite gestionar pedidos y mesas en restaurantes de forma eficiente. Incluye vistas para la administración de órdenes, la creación de pedidos y el seguimiento de estados.

## Características principales

- Gestión de órdenes y mesas
- Creación y edición de pedidos
- Visualización en tiempo real de estados
- Interfaz intuitiva y responsiva

## Tecnologías utilizadas

- **React** + **TypeScript** + **Vite**
- ESLint con reglas recomendadas y específicas para React

## Configuración de ESLint

Este proyecto incluye una configuración mínima de ESLint. Para aplicaciones en producción, se recomienda habilitar reglas de linting con reconocimiento de tipos:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      // ...tseslint.configs.strictTypeChecked,
      // ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

También puedes instalar [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) y [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) para reglas específicas de React:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

## Licencia

Este proyecto se distribuye bajo la licencia MIT.
