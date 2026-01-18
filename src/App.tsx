import './App.css'
import { MainLayout } from './components/Layout/MainLayout'
import { RegisterModeContent } from './pages/RegisterMode/RegisterModeContent'

function App() {
  return (
    <div className="app">
      <MainLayout>
        {(mode) => {
          switch (mode) {
            case 'register':
              return <RegisterModeContent />;
            case 'product-management':
              return (
                <div className="placeholder-content">
                  <p>商品管理機能は未実装です</p>
                </div>
              );
            default:
              return (
                <div className="placeholder-content">
                  <p>選択されたモードは未実装です</p>
                </div>
              );
          }
        }}
      </MainLayout>
    </div>
  )
}

export default App
