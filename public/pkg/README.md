# Browser demo of PoET

So there's no convenient way to build everything since there's some manual shimming required after building the Wasm binary to get it working.

First compile the Wasm runtime:

```sh
wasm-pack build --release --target web --out-dir www/pkg
```

Then edit the output `www/pkg/browser_snarks.js` file and add external import support:

```diff
- function getImports() {
-   const imports = { };
+ function getImports(externs) {
+   const imports = { ...externs };

- function initSync(bytes) {
-   const imports = getImports();
+ function initSync(bytes, externs) {
+   const imports = getImports(externs);

- async function init(input) {
-   // unchanged...
-   const imports = getImports();
+ async function init(input, externs) {
+   // unchanged...
+   const imports = getImports(externs);
```

You also have to specifically mention that the host functions will be available from the imports object:

```diff
- const ret = state_get(getStringFromWasm0(arg1, arg2));
+ const ret = imports.state_get(getStringFromWasm0(arg1, arg2));
- state_set(
+ imports.state_set(
```

This is a step that you'll have to do every time you make changes in the runtime (which shouldn't be too often; however I will automate this later). Once this is done you can install the local server dependencies:

```sh
cd www
npm i
```

And then run the server:

```sh
npm start
```
