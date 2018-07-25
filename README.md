# arc.js-scripts
Scripts that run against @daostack/arc.js

## Installation

Clone or fork the arc.js-scripts repository from GitHub, then:

```
npm run build
```

## Run a Script

1. Create a JavaScript file that exports a method that returns a promise that it is complete.
 When arc.js-scripts runs your script, the method will be invoked with two parameters: `web3` and the name of the network in lowercase.
 
    Two globals will also be made available: `web3` and `accounts`.
 
    See [scripts/example.ts](https://github.com/dkent600/arc.js-scripts/blob/master/scripts/example.ts) for an example of a script.
    
    Note that `npm run build` transpiles example.ts into the required JavaScript, putting the generated JavaScript in the "build/scripts" directory.
    
    When you refer to the script on the command line (see below), you must refer to a JavaScript file, not to TypeScript.

2. Run the script

    Get help on command line options:
    
    `node ./build/scripts/arcScript.js -h`

    Run the example script against a local node with default url and port:

    `node ./build/scripts/arcScript.js -s ./example.js -m exampleMethod`

## Use truffle-hdwallet-provider

  If you want to use the truffle-hdwallet-provider rather than a local node then you must supply the `provider` option:

  `node ./build/scripts/arcScript.js -p '[pathToConfig]'`

  The path should reference a json file containing a truffle-hdwallet-provider configuration, looking something like this:

  <pre>
  {
    "mnemonic": "...",
    "providerUrl": "https://kovan.infura.io/..."
  }</pre>
    
## Notes

* Your method may call `InitializeArcJs` for cases where you want to use Arc contracts (see scripts/example.ts).

* TypeScript is not necessary, you can create your JavaScript script files however you want.  But if you want you can easily create scripts using TypeScript by placing your .ts files in a "local_scripts" folder and running `npm run build` to compile them.  The generated JavaScript will appear in the "build/local_scripts" folder.  Run can then run your script like this:

    `node ./build/scripts/arcScript.js -s ../local_scripts/[yourscript].js -m [yourMethod]`

* If you are using truffle-hdwallet-provider and you run a script and it connects to the provider but then returns without executing your script, make sure that a node is listening on the url you
provided in your provider configuration file.

* The "scripts" directory contains some useful scripts that you can use, for example:


    Script | Method | Purpose
    ---------|---------|----------
    daoCreate | create | create a DAO given a json spec for the DAO
    daoParticipantsList | list | list participants in the given DAO, by reputation
    ethTransfer | transfer | transfer ETH from one account to another
    tokenTransfer | transfer | transfer tokens from one account to another
    tokenMint | mint | mint tokens to an account
