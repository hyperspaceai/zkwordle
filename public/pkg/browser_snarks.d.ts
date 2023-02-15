/* tslint:disable */
/* eslint-disable */
/**
* @param {string} source
* @returns {Uint8Array}
*/
export function wat_to_bytecode(source: string): Uint8Array;
/**
* @param {string} source
* @returns {Uint8Array}
*/
export function compile_wat(source: string): Uint8Array;
/**
* @param {object} proof_obj
* @returns {boolean}
*/
export function verify(proof_obj: object): boolean;
/**
* @param {Uint8Array} binary
* @param {string} export_name
* @param {string} inputs_json
* @returns {any}
*/
export function execute(binary: Uint8Array, export_name: string, inputs_json: string): any;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly wat_to_bytecode: (a: number) => number;
  readonly compile_wat: (a: number) => number;
  readonly verify: (a: number) => number;
  readonly execute: (a: number, b: number, c: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

/**
* Synchronously compiles the given `bytes` and instantiates the WebAssembly module.
*
* @param {BufferSource} bytes
*
* @returns {InitOutput}
*/
export function initSync(bytes: BufferSource): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
