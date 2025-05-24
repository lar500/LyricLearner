import NavBar from '../components/NavBar'
import EnglishLyricSearchLogic from '../components/EnglishLyricSearchLogic'


export default function Home() {
  return (
    <main>
      <NavBar />
      <div className = "pt-5 pb-5">
        <EnglishLyricSearchLogic />
        <p>Lyrics provided by Genius</p>      
      </div>
    </main>
  )
}
