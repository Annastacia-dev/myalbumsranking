import Albums from './components/Albums'
import Ranking from './components/Ranking'

function App() {

  return (
    <div className='min-h-screen grid md:grid-cols-2'>
      <Albums />
      <Ranking />
    </div>
  )
}

export default App
