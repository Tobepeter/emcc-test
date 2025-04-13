#include <stdio.h>
#include <emscripten.h>
#include <emscripten/console.h>
#include "emcc-console.h"

EMSCRIPTEN_KEEPALIVE
void emcc_console()
{
  emscripten_console_log("emscripten_console_log\n");
  emscripten_console_warn("emscripten_console_warn\n");
  emscripten_console_error("emscripten_console_error\n");

  emscripten_console_logf("emscripten_console_logf %d\n", 123);
  emscripten_console_warnf("emscripten_console_warnf %d\n", 123);
  emscripten_console_errorf("emscripten_console_errorf %d\n", 123);

  // NOTE: 在ESM模式其实很难替换的，因为第一次执行时候，已经注入到了，__emscripten_out 的 out 函数中了
  _emscripten_out("emscripten_out\n");
  _emscripten_err("emscripten_err\n");
}
