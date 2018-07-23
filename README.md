# arc.js-scripts
Scripts that run against @daostack/arc.js

## Installation

Clone or fork the arc.js-scripts repository from GitHub, then:

```
npm run build
```

## To Run a Script

1. Create a JavaScript file that exports a method that returns a promise that it is complete.
 When arc.js-scripts runs your script, the method will be invoked with two parameters: `web3` and the name of the network in lowercase
 
 Two globals are also available: `web3` and `accounts`.
 
    See scripts/example.ts for an example of a script. Note that `npm run build` will have converted test.ts into the required JavaScript, in case you want to try the test out.  The generated JavaScript will be found in the "build" directory.  You must run the JavaScript, not the typescript.
2. To execute your new script, run:

    `npm run script [pathToProviderConfig] [pathToScript] [methodNameInScript]`

    where the parameters are:

    <dl>
    <dt>pathToProviderConfig</dt>
    <dd>A json file containing the provider configuration, looking something like this:
      <pre>
    {
      "mnemonic": "...",
      "providerUrl": "https://kovan.infura.io/..."
    }</pre>
      </dd>
    <dt>pathToScript</dt><dd>the path to your JavaScript script file</dd>
    <dt>methodNameInScript</dt><dd>the name of an exported method to invoke in your script</dd>
    </dl>

## Notes

* Your method may call `InitializeArcJs` for cases where you want to use Arc contracts (see scripts/example.ts).

* Typescript is not necessary, but if you want you can easily create scripts using TypeScript by placing your .ts files in the "scripts" folder and running `npm run build` to compile them.  The generated JavaScript will appear in the "build" folder.

    In any case, you can create your JavaScript script files however you want.

* The build command (`npm run build`) will compile TypeScript files if any are found in a `local-scripts` folder that you may create for yourself.  This folder would be excluded from the git repo and npm package.  Generated JavaScript files will appear in the "build" folder.
