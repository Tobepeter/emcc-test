#include "emcc-malloc.h"
#include <emscripten.h>
#include <stdio.h>

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