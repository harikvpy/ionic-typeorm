# TypeORM & sql.js integration with Angular

This is a sample project that shows how [TypeORM](https://typeorm.io) with [sql.js](https://sql.js.org) can be integrated with an Angular project. This project uses Ionic as a frontend, but that should be irrelevant and the approach ought to work with any Angular project.

## Versions
| Framework | Version |
| ---       | ---      |
| Angular   | 13       |
| Ionic     | 6        |
| Ionic CLI |  6.18.1 |
| TypeORM   | 0.2.44 |
| sql.js    | 1.6.2 |


## Steps
You can of course clone this repo and use it for your projects.

But if you are keen to know the steps involved in arriving at the solution, here it goes:

1. Create a basic Angular project. For this project I used `ionic-cli` to create a blank app.
   
   ```
   $ ionic start ionic-typeorm
   ```
   Choose `blank` project template, `Angular` project type and `Capacitor` integration. *Project type doesn't really matter*.

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
6. Change the angular configuration to use a different builder (`@angular-builders`) from the default. This builder allows us to specify a custom webpack configuration which is necessary to load the SQLite web assembly module in the browser. Also see how *.wasm is added to the assets list so that it's copied to the output root folder (where `sql-wasm.js` loads it from). So update `angular.json`:

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


If all went well, you should be able to create SQL tables and query them using TypeORM API. When you run the app for the first time, it'll create a `user` table with mock user records. Subsequently everytime the app runs, it'll query these records and log them to the console. So if you see log a message that begins 'All users:...' all is well.

## References
1. This [article](https://www.techiediaries.com/ionic-angular-typeorm-custom-webpack-configuration/) got me started. It's a little outdated, which warranted this repo and readme.
2. Relevant project docs and their GitHub issues

## Disclaimer
Code is provided AS IS with no warranty to its accuracy or reliability. That said, if you find any issues, please use the Github issue tracker and I'll be happy to look into it.
