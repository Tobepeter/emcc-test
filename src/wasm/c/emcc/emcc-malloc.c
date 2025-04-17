#include "emcc-malloc.h"
#include <emscripten.h>
#include <stdio.h>

EM_JS(void, em_track, (const char *str),
      { window.emCallback.track(UTF8ToString(str)); });

EM_JS(void, em_notifyAdd, (void *ptr, int size),
      { window.emCallback.notifyAdd(ptr, size); });

EM_JS(void, em_notifyRemove, (void *ptr),
      { window.emCallback.notifyRemove(ptr); });

EMSCRIPTEN_KEEPALIVE
void test_mallocX()
{
  int *p = (int *)mallocX(100);
  printf("p: %p\n", p);
  freeX(p);

  int *p2 = (int *)callocX(10, sizeof(int));
  printf("p2: %p\n", p2);

  int *p3 = (int *)reallocX(p2, 200);
  printf("p3: %p\n", p3);
  freeX(p3);
}