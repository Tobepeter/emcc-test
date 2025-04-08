#include <stdio.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
int add(int a, int b) {
    return a + b;
}

EMSCRIPTEN_KEEPALIVE
int main() {
    printf("WebAssembly 模块已加载！\n");
    return 0;
}
