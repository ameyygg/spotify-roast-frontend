import { BrowserRouter, Routes, Route } from 'react-router'
import './App.css'
import Login from './components/Login'
import Roast from './components/Roast'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/login' element={<Login />} />
          <Route path='/roast' element={<Roast />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
