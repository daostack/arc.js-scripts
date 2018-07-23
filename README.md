# arc.js-scripts
Scripts that run against @daostack/arc.js

## Installation

Run the following command to install and build arc.js-scripts:

```
npm install @arc.js-scripts
npm run build
```

## To Run a Script

1. Create a javascript file that exports a method that returns a promise that it is complete.
 When arc.js-scripts runs your script, the method will be invoked with two parameters: `web3` and the name of the network in lowercase. (Note that `web3` will also be global.)
 
    See scripts/example.ts for an example of a script. Note that `npm run build` will have converted test.ts into the required javascript, in case you want to try the test out.  The generated javascript will be found in the "build" directory.  You must run the javascript, not the typescript.
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
    <dt>pathToScript</dt><dd>the path to your javascript script file</dd>
    <dt>methodNameInScript</dt><dd>the name of an exported method to invoke in your script</dd>
    </dl>

Note: Your method may call `InitializeArcJs` for cases where you want to use Arc contracts.
