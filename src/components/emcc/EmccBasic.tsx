import { Button, Space, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { wasmModule } from '@/utils/wasm-loader'

export const EmccBasic = () => {
  const [result, setResult] = useState<number | null>(null)
  const [str, setStr] = useState('')
  const [heavyResult, setHeavyResult] = useState<string>('')
  const [isHeavyEnabled, setIsHeavyEnabled] = useState(true)

  useEffect(() => {
    setStr(wasmModule.UTF8ToString(wasmModule._getStr()))
  }, [])

  const handleTriggerEmCallback = () => {
    wasmModule._triggerEmCallback()
  }

  const handleAdd = () => {
    const sum = wasmModule._add(5, 3)
    setResult(sum)
  }

  const handleHeavy = () => {
    setHeavyResult('handleHeavy...')
    setIsHeavyEnabled(false)

    // 需要先修改了UI
    setTimeout(() => {
      console.time('heavy')
      const result = wasmModule._heavy()
      console.timeEnd('heavy')
      setHeavyResult(result.toString())
      setIsHeavyEnabled(true)
    }, 10)
  }

  const handleCustom = () => {
    wasmModule.print = (message) => {
      console.log('[print]', message)
    }
    wasmModule.printErr = (message) => {
      console.error('[printErr]', message)
    }
    wasmModule._emcc_console()
  }

  const miscButtons = [
    { label: 'Memory Increase', onClick: () => wasmModule._mem_increase() },
    { label: 'Memory Free', onClick: () => wasmModule._mem_free() },
    { label: 'Clear Console', onClick: () => console.clear() },
    { label: 'Custom', onClick: handleCustom },
  ]

  const { Title, Text } = Typography

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Title level={2} className="text-center">
        WebAssembly 测试
      </Title>
      <Button type="primary" onClick={handleAdd} block>
        计算 5 + 3
      </Button>
      <Text className="text-center block">
        计算结果: <Text strong>{result ?? '-'}</Text>
      </Text>

      <Text className="text-center block">
        获取字符串: <Text strong>{str ?? '-'}</Text>
      </Text>

      <Button type="primary" onClick={handleTriggerEmCallback} block>
        触发 emCallback
      </Button>

      <Button type="primary" onClick={handleHeavy} disabled={!isHeavyEnabled} block>
        Heavy
      </Button>
      <Text className="text-center block">
        Heavy 结果: <Text strong>{heavyResult || '-'}</Text>
      </Text>

      {miscButtons.map((button) => (
        <Button key={button.label} type="primary" onClick={button.onClick} block>
          {button.label}
        </Button>
      ))}
    </Space>
  )
}
