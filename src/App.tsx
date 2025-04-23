import { Card, Spin, Tabs, TabsProps } from 'antd'
import 'antd/dist/reset.css'
import { useEffect, useState } from 'react'
import './App.css'
import { EmccBasic } from './components/emcc/EmccBasic'
import { EmccMemory } from './components/emcc/EmccMemory'
import { axiosClient } from './utils/axios-client'
import { wasmLoader } from './utils/wasm-loader'

function App() {
  const [loading, setLoading] = useState(true)

  const loadWasm = async () => {
    axiosClient.init()
    await wasmLoader.initWasm()
    setLoading(false)
  }

  useEffect(() => {
    loadWasm()
  }, [])

  if (loading) {
    return <Spin spinning={loading} />
  }

  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: '基础',
      children: <EmccBasic />,
    },
    {
      key: 'mem-monitor',
      label: '内存监控',
      children: <EmccMemory />,
    },
  ]

  // TODO: 持久化？
  const defaultIndex = 1

  return (
    <Card>
      <Tabs defaultActiveKey={items[defaultIndex].key} items={items} />
    </Card>
  )
}

export default App
