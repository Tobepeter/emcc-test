#include "emscripten/trace.h"
#include <emscripten.h>

// NOTE: not work
// https://github.com/emscripten-core/emscripten/issues/18121

EMSCRIPTEN_KEEPALIVE
void test_trace_start()
{
  emscripten_trace_configure("http://127.0.0.1:3001/", "MyApplication");
}

EMSCRIPTEN_KEEPALIVE
void test_emscripten_trace_report_memory_layout()
{
  emscripten_trace_report_memory_layout();
}

EMSCRIPTEN_KEEPALIVE 
void test_emscripten_trace_report_off_heap_data()
{
  emscripten_trace_report_off_heap_data();
}
