# arc.js-scripts
Scripts that run against @daostack/arc.js

# Run a script

<style>dt { font-weight: bold}</style>

1. Create a javascript file that exports a method that returns a promise that it is complete.
 The method will be invoked with two parameters: `web3` and the name of the network in lowercase. Note that `web3` will also be global. See scripts/test.ts for an example (note that `npm run build` converts test.ts into the required javascript, in case you want to try it out).
2. To execute your script, run:

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
