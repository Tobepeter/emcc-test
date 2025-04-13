#include "emcc-macro.h"
#include <emscripten.h>
#include <stdio.h>

void emcc_macro()
{
  // === 是否emcc构建 ===
#ifdef __EMSCRIPTEN__
  printf("__EMSCRIPTEN__\n");
#else
  printf("not __EMSCRIPTEN__\n");
#endif

  // === print version ===
  // NOTE: 导入 <emscripten.h> 和 <emscripten/version.h> 都是可以的
  printf("EMSCRIPTEN_VERSION_MAJOR: %d\n", __EMSCRIPTEN_major__);
  printf("EMSCRIPTEN_VERSION_MINOR: %d\n", __EMSCRIPTEN_minor__);
  printf("EMSCRIPTEN_VERSION_TINY: %d\n", __EMSCRIPTEN_tiny__);

  // === llvm and clang ===
  printf("__llvm__: %d\n", __llvm__);
  printf("__clang__: %d\n", __clang__);
  printf("__clang_major__: %d\n", __clang_major__);
  printf("__clang_minor__: %d\n", __clang_minor__);
  printf("__clang_patchlevel__: %d\n", __clang_patchlevel__);

  // The preprocessor string __VERSION__ indicates the GCC compatible version
  //  which is expanded to also show Emscripten version information
  printf("__VERSION__: %s\n", __VERSION__);

// === user defined macro ===
#ifdef DEBUG
  printf("macro DEBUG\n");
#else
  printf("macro no DEBUG\n");
#endif
}