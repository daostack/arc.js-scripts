# arc.js-scripts
Scripts that run against @daostack/arc.js

## Installation

Clone or fork the arc.js-scripts repository from GitHub, then:

```
npm run build
```

## To Run a Script

1. Create a JavaScript file that exports a method that returns a promise that it is complete.
 When arc.js-scripts runs your script, the method will be invoked with two parameters: `web3` and the name of the network in lowercase.
 
    Two globals are also available: `web3` and `accounts`.
 
    See [scripts/example.ts](https://github.com/dkent600/arc.js-scripts/blob/master/scripts/example.ts) for an example of a script. Note that `npm run build` transpiles example.ts into the required JavaScript, putting the generated JavaScript in the "build/scripts" directory.
    
    When you refer to the script on the command line (see below), you must refer to the JavaScript file, not the TypeScript.

2. To execute your new script, run:

    `npm run script [pathToProviderConfig]|"local" [pathToScript] [methodNameInScript] [optionalParameters]`

    where the parameters are:

    <dl>
    <dt>pathToProviderConfig</dt>
    <dd>A json file containing an truffle-hdwallet-provider configuration, looking something like this:
      <pre>
    {
      "mnemonic": "...",
      "providerUrl": "https://kovan.infura.io/..."
    }</pre>
    
    If you supply "local" instead of a json file for `pathToProviderConfig`, then the script will not try to create a truffle-hdwallet-provider and will instead run against a node as configured in the Arc.js global configuration settings described [here](https://daostack.github.io/arc.js/Home/#use-default-network-settings) in the Arc.js documentation.
    
      </dd>
    <dt>pathToScript</dt><dd>the path to your JavaScript script file.  Can be either absolute or relative to build/scripts.</dd>
    
    <dt>methodNameInScript</dt><dd>the name of an exported method to invoke in your script</dd>
    <dt>optionalParameters</dt><dd>optional parameters that, if present, will be passed as arguments to your script method</dd>
    </dl>

## Notes

* Your method may call `InitializeArcJs` for cases where you want to use Arc contracts (see scripts/example.ts).

* TypeScript is not necessary, but if you want you can easily create scripts using TypeScript by placing your .ts files in a "local_scripts" folder and running `npm run build` to compile them.  The generated JavaScript will appear in the "build/local_scripts" folder.

    Regardless, you can create your JavaScript script files however you want.

* The build command (`npm run build`) will compile TypeScript files if any are found in the root "local_scripts" folder that you may create for yourself.  If it exists, this folder is excluded from the git repo.  Generated JavaScript files in this folder will appear in the "build/local_scripts" folder.

* You can start ganache with the command `npm run ganache`, migrate Arc contracts with `npm run migrateContracts` and create a Genesis DAO with `npm run createGenesisDao`.  See more about Arc.js contract migration in the Arc.js documentation [here](https://daostack.github.io/arc.js/Migration/).

* the "scripts" directory contains some useful scripts that you can use, for example:

    - **createDao** - create a DAO given a json spec for the DAO
