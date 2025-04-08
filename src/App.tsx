import { Button, Space, Spin, Typography } from 'antd'
import 'antd/dist/reset.css'
import { useEffect, useState } from 'react'
import './App.css'
import { axiosClient } from './utils/axios-clent'
import { wasmLoader, wasmModule } from './utils/wasm-loader'

function App() {
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [str, setStr] = useState('')

  const loadWasm = async () => {
    setLoading(true)
    axiosClient.init()
    await wasmLoader.initWasm()
    setLoading(false)
    setStr(wasmModule.UTF8ToString(wasmModule._getStr()))
  }

  const handleTriggerEmCallback = () => {
    wasmModule._triggerEmCallback()
  }

  useEffect(() => {
    loadWasm()
  }, [])

  const handleAdd = () => {
    const sum = wasmModule._add(5, 3)
    setResult(sum)
  }

  const { Title, Text } = Typography

  return (
    <Spin spinning={loading}>
      <div className="h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
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
        </Space>
      </div>
    </Spin>
  )
}

export default App
