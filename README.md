# 实现vite+wasm结合的基础框架

- 实现配置化wasm和解析
- 支持自定义命令行构建
- 支持自动构建刷新wasm
- 支持本地化的日志文件系统
- 支持命令合并套件

# clangd

## Diagnostics

### UnusedIncludes: None

平时不喜欢被管理include，最多警告，不要报错

### Suppress:

attribute_section_invalid_for_target
这个 EM_ASM 一直报这个错误

### bugprone-suspicious-include

这个不让我引入c文件，但是单元测是太常见了

### bugprone-easily-swappable-parameters

不允许相邻参数都是void \*，只是担心代码交换了传参顺序，但这个太常见了

### bugprone-reserved-identifier

不允许使用保留的标识符
这个不允许，struct定义使用下划线（但是无法结合typedef）
而且哪怕是static内部变量也会检测，很多开源库都是这么做的，比如 \_\_malloc

### bugprone-multi-level-implicit-pointer-conversion

不允许多级隐式指针转换
这个没法解决，stb_ds.h 的数组按照 void \*，但是我们经常会声明 MyStruct \*\*array = NULL;

### misc-unused-parameters

不允许使用未使用的参数


