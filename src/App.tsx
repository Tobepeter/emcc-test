import { useEffect, useState } from 'react'
import { Button, Card, Typography, Space, Spin } from 'antd'
import { wasmLoader, wasmModule } from './utils/wasm-loader'
import 'antd/dist/reset.css'
import './App.css'

function App() {
  const [result, setResult] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [str, setStr] = useState('')

  const loadWasm = async () => {
    setLoading(true)
    await wasmLoader.initWasm()
    setLoading(false)
    setStr(wasmModule.UTF8ToString(wasmModule._getStr()))
  }

  useEffect(() => {
    loadWasm()
  }, [])

  const handleAdd = async () => {
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
        </Space>
      </div>
    </Spin>
  )
}

export default App
