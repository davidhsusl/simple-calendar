module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "react",
  ],
  "rules": {
    // "indent": [
    //   "error",
    //   2
    // ],
    // "linebreak-style": [
    //   "error",
    //   "windows"
    // ],
    // "quotes": [
    //   "error",
    //   "single"
    // ],
    // "semi": [
    //   "error",
    //   "always"
    // ]
    "no-unused-vars": ["error", {
      "ignoreRestSiblings": true
    }],
    "no-console": "warn",
    "react/prop-types": [0],
    // "react/no-deprecated": "warn",
    "react/no-find-dom-node": [0],
    "react/display-name": [0],
  },
  "settings": {
    "react": {
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "16.2", // React version, default to the latest React stable release
    },
  },
};