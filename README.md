# TypeORM & sql.js integration with an Angular

This is a sample project that shows how TypeORM with sql.js can be integrated with an Angular project. This project uses Ionic as a frontend, but that should be irrelevant and the approach ought to work with any Angular project.

## Versions
| Framework | Version |
| ---       | ---      |
| Angular   | 13       |
| Ionic     | 6        |
| Ionic CLI |  6.18.1 |
| TypeORM(see note)   | 0.2.43 |
| sql.js    | 1.6.2 |


## Steps
You can of course clone this repo and test use it for your projects.

But, if you are keen to know the steps involved in arriving at the solution, here it goes:

1. Create a basic Angular project. For this project I used `ionic-cli` to create a blank app.
   
   ```
   $ ionic start ionic-typeorm blank --type=ionic-angular --capacitor

2. Install the following additional packages:

   ```
   $ npm install typeorm sql.js reflect-metadata --save
   $ npm install @types/node @angular-builders/custom-webpack --save-dev
   ```
3. Copy `./node_modules/sql.js/dist/sql-wasm.wasm` to `src/assets` folder. We’ll update angular.json so that this file is copied to the site root folder (`sql-wasm.js` expects it to be available at site root) during build.
4. Update tsconfig.json so as to add `node_modules/@types` to `typeRoots`. Also set `emitDecoratorMetadata` & `skipLibCheck` properties to true.
      ```
      {
       "compilerOptions": {
         ...
         "emitDecoratorMetadata": true,
         "skipLibCheck": true,
         "typeRoots": [
           "node_modules/@types"
         ],
         ...
       }
      }
      ```
5. Edit tsconfig.app.json so that it has the following two settings:
      ```
      {
        ...
        "types": ["node"],
        "paths": {
          "typeorm": ["node_modules/typeorm/browser"]
        },
        ...
      }
      ```
6. Change the angular configuration to use a different builder (`@angular-builders`) from the default. This builder allows us to specify a custom webpack configuration which is necessary to load the SQLite web assembly module in the browser. So update `angular.json`:

   ```
   {
     “projects”: {
        “app”: {
          ...
          "architect": {
            "build": {
              "builder": "@angular-builders/custom-webpack:browser",
                 "options": {
                   "customWebpackConfig": {
                     "path": "./custom.webpack.config.js"
                 },
                 …
                 "assets": [
                   ...,
                   {
                     "glob": "**/*.wasm",
                     "input": "src/assets",
                     "output": ""
                   }
                 ]
               },
            },
            "serve": {
              "builder": "@angular-builders/custom-webpack:dev-server",
              ...
            },
          }
        }
      }
   }
   ```
	We’ll create the custom.webpack.config.js in the next step.
7. Create a custom webpack configuration so that we can load `sql-wasm.js`. This would look like this.

   ```
   const webpack = require("webpack");
   console.log("The custom config is used");
   module.exports = {
     resolve: {
       fallback: {
         "path": false,
         "fs": false,
         "crypto": false,
       }
     },
     plugins: [
       new webpack.ProvidePlugin({
         "window.SQL": "sql.js/dist/sql-wasm.js",
       }),
       new webpack.NormalModuleReplacementPlugin(/typeorm$/, function (result) {
         result.request = result.request.replace(/typeorm/, "typeorm/browser");
       }),
     ],
     optimization: {
       minimize: false,
     },
   };
   ```

   Note how we load the sqlite WASM plugin via a new plugin config. Also the resolve dictionary settings are key to get the whole thing to work properly.


If all went well, you should be able to create SQL tables and query them using TypeORM API.

## TypeORM Note
The 0.2.43 official release of TypeORM has a bug that as of this writing has been fixed in the code, but a production build including this build has not been uploaded to npmjs. Therefore, please clone the latest code from TypeORM repo, build it locally (use `npm run package` after creating a config file. See instructions in `DEVELOPER.md`) and install the package from the build output (`npm install <local-repo-path>`).


## Disclaimer
This is a sample code provided AS IS and no warranty is made to its accuracy or reliability. If you found any issues, please create an issue and I'll be happy to look into it.
