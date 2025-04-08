#include <stdio.h>
#include <emscripten.h>
#include "test.h"

EMSCRIPTEN_KEEPALIVE
void test(const char *str) {
    printf("test: %s\n", str);
}
