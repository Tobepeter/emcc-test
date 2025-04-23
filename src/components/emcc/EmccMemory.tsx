import { wasmModule } from '@/utils/wasm-loader'
import { Button, message, Space, Typography } from 'antd'
import { useRef, useState } from 'react'

export const EmccMemory = () => {
  const { Title } = Typography
  const ptrArr = useRef<number[]>([])

  const memMonitorBtns = [
    {
      label: 'Memory MallocX',
      onClick: () => {
        const ptr = wasmModule._mem_mallocX()
        ptrArr.current.push(ptr)
      },
    },
    {
      label: 'Memory FreeX',
      onClick: () => {
        if (ptrArr.current.length === 0) {
          message.error('没有可释放的内存')
          return
        }
        const ptr = ptrArr.current.pop()
        wasmModule._mem_freeX(ptr)
      },
    },
    { label: 'Clear Console', onClick: () => console.clear() },
  ]

  return (
    <div>
      <Space direction="vertical" size="large" className="w-full">
        <Title level={2} className="text-center">
          WebAssembly 内存监控
        </Title>
        {memMonitorBtns.map((button) => (
          <Button key={button.label} onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
      </Space>
    </div>
  )
}
