import NavBar from './components/NavBar'
import SearchBar from './components/SearchBar'
import EnglishLyricSearchLogic from './components/EnglishLyricSearchLogic'

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className = "pt-5 pb-5">
        <EnglishLyricSearchLogic />
      </div>
    </main>
  )
}
