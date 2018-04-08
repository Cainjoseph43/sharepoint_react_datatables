# SharePoint React Application
A starting point for a SharePoint React application.

## Initialization

Start by running npm install command from the project root to install **dependencies**

```sh
npm install
```

## Scripts

### Hot Reloading Development
```sh
npm run start
```
Run the application on locally at port 8080. Changes to the application will hot reload the changes as they are made.

### Dev Build
```sh
npm run devbuild
```

Pack the **index.js** and all dependencies and inject the script ref before the body close tag of the **index.html**. For manual builds of the dev distribution. Final product is the **dist/** directory

All work should be done in **App.js**

### Production Build
```sh
npm run build
```
Same as Dev Build but minified and uglified.