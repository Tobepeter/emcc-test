#include <emscripten.h>
#include <stdlib.h>

static void malloc_free_test(int size) {
  int *ptr = (int *)malloc(size);
  free(ptr);
}

EMSCRIPTEN_KEEPALIVE
void emcc_free_test() {
  malloc_free_test(100);
}
