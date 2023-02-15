let wasm;

const cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}

function getObject(idx) {
  return heap[idx];
}

function dropObject(idx) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}

function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder("utf-8");

const encodeString =
  typeof cachedTextEncoder.encodeInto === "function"
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
          read: arg.length,
          written: buf.length,
        };
      };

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7f) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3));
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

function isLikeNone(x) {
  return x === undefined || x === null;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == "number" || type == "boolean" || val == null) {
    return `${val}`;
  }
  if (type == "string") {
    return `"${val}"`;
  }
  if (type == "symbol") {
    const description = val.description;
    if (description == null) {
      return "Symbol";
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == "function") {
    const name = val.name;
    if (typeof name == "string" && name.length > 0) {
      return `Function(${name})`;
    } else {
      return "Function";
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = "[";
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ", " + debugString(val[i]);
    }
    debug += "]";
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == "Object") {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return "Object(" + JSON.stringify(val) + ")";
    } catch (_) {
      return "Object";
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}
/**
 * @param {string} source
 * @returns {Uint8Array}
 */
export function wat_to_bytecode(source) {
  const ret = wasm.wat_to_bytecode(addHeapObject(source));
  return takeObject(ret);
}

/**
 * @param {string} source
 * @returns {Uint8Array}
 */
export function compile_wat(source) {
  const ret = wasm.compile_wat(addHeapObject(source));
  return takeObject(ret);
}

/**
 * @param {object} proof_obj
 * @returns {boolean}
 */
export function verify(proof_obj) {
  const ret = wasm.verify(addHeapObject(proof_obj));
  return takeObject(ret);
}

/**
 * @param {Uint8Array} binary
 * @param {string} export_name
 * @param {Array<any>} input_uint8arrays
 * @returns {any}
 */
export function execute(binary, export_name, input_uint8arrays) {
  const ret = wasm.execute(
    addHeapObject(binary),
    addHeapObject(export_name),
    addHeapObject(input_uint8arrays)
  );
  return takeObject(ret);
}

function handleError(f, args) {
  try {
    return f.apply(this, args);
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
  }
}

async function load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn(
            "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
            e
          );
        } else {
          throw e;
        }
      }
    }

    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}

function getImports(externs) {
  const imports = { ...externs };
  imports.wbg = {};
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbg_stateget_d31b0717cb020e37 = function (arg0, arg1, arg2) {
    const ret = imports.state_get(getStringFromWasm0(arg1, arg2));
    const ptr0 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_stateset_5f59ba834942d092 = function (
    arg0,
    arg1,
    arg2,
    arg3
  ) {
    imports.state_set(
      getStringFromWasm0(arg0, arg1),
      getStringFromWasm0(arg2, arg3)
    );
  };
  imports.wbg.__wbindgen_string_get = function (arg0, arg1) {
    const obj = getObject(arg1);
    const ret = typeof obj === "string" ? obj : undefined;
    var ptr0 = isLikeNone(ret)
      ? 0
      : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbg_log_17733ab6fa45831d = function (arg0) {
    console.log(getObject(arg0));
  };
  imports.wbg.__wbg_instanceof_Window_42f092928baaee84 = function (arg0) {
    const ret = getObject(arg0) instanceof Window;
    return ret;
  };
  imports.wbg.__wbg_getItem_1db55b1eb4116c1e = function () {
    return handleError(function (arg0, arg1, arg2, arg3) {
      const ret = getObject(arg1).getItem(getStringFromWasm0(arg2, arg3));
      var ptr0 = isLikeNone(ret)
        ? 0
        : passStringToWasm0(
            ret,
            wasm.__wbindgen_malloc,
            wasm.__wbindgen_realloc
          );
      var len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    }, arguments);
  };
  imports.wbg.__wbg_localStorage_ef2b9820e472266b = function () {
    return handleError(function (arg0) {
      const ret = getObject(arg0).localStorage;
      return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_get_ad41fee29b7e0f53 = function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_length_a73bfd4c96dd97ef = function (arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbg_newnoargs_971e9a5abe185139 = function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_get_72332cd2bc57924c = function () {
    return handleError(function (arg0, arg1) {
      const ret = Reflect.get(getObject(arg0), getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_call_33d7bcddbbfa394a = function () {
    return handleError(function (arg0, arg1) {
      const ret = getObject(arg0).call(getObject(arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_new_e6a9fecc2bf26696 = function () {
    const ret = new Object();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_self_fd00a1ef86d1b2ed = function () {
    return handleError(function () {
      const ret = self.self;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_window_6f6e346d8bbd61d7 = function () {
    return handleError(function () {
      const ret = window.window;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_globalThis_3348936ac49df00a = function () {
    return handleError(function () {
      const ret = globalThis.globalThis;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbg_global_67175caf56f55ca9 = function () {
    return handleError(function () {
      const ret = global.global;
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
  };
  imports.wbg.__wbg_buffer_34f5ec9f8a838ba0 = function (arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_newwithbyteoffsetandlength_88fdad741db1b182 = function (
    arg0,
    arg1,
    arg2
  ) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_cda198d9dbc6d7ea = function (arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_1a930cfcda1a8067 = function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
  };
  imports.wbg.__wbg_length_51f19f73d6d9eff3 = function (arg0) {
    const ret = getObject(arg0).length;
    return ret;
  };
  imports.wbg.__wbg_byteLength_ddb215ba7b4484fd = function (arg0) {
    const ret = getObject(arg0).byteLength;
    return ret;
  };
  imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_2762e698c2f5b7e0 = function () {
    return handleError(function (arg0, arg1, arg2) {
      const ret = Reflect.set(
        getObject(arg0),
        getObject(arg1),
        getObject(arg2)
      );
      return ret;
    }, arguments);
  };
  imports.wbg.__wbg_parse_db5dff7be8419fa0 = function () {
    return handleError(function (arg0, arg1) {
      const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    }, arguments);
  };
  imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(
      ret,
      wasm.__wbindgen_malloc,
      wasm.__wbindgen_realloc
    );
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  imports.wbg.__wbindgen_memory = function () {
    const ret = wasm.memory;
    return addHeapObject(ret);
  };

  return imports;
}

function initMemory(imports, maybe_memory) {}

function finalizeInit(instance, module) {
  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;
  cachedInt32Memory0 = new Int32Array();
  cachedUint8Memory0 = new Uint8Array();

  return wasm;
}

function initSync(bytes, externs) {
  const imports = getImports(externs);

  initMemory(imports);

  const module = new WebAssembly.Module(bytes);
  const instance = new WebAssembly.Instance(module, imports);

  return finalizeInit(instance, module);
}

async function init(input, externs) {
  if (typeof input === "undefined") {
    input = new URL("browser_snarks_bg.wasm", import.meta.url);
  }
  const imports = getImports(externs);

  if (
    typeof input === "string" ||
    (typeof Request === "function" && input instanceof Request) ||
    (typeof URL === "function" && input instanceof URL)
  ) {
    input = fetch(input);
  }

  initMemory(imports);

  const { instance, module } = await load(await input, imports);

  return finalizeInit(instance, module);
}

export { initSync };
export default init;
