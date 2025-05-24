import NavBar from "../components/NavBar";
import AzLyricSearchLogic from "../components/AzLyricSearchLogic";

export default function Home() {
  return (
    <main>
      <NavBar />
      <div className="pt-5 pb-5">
        <AzLyricSearchLogic />
      </div>
    </main>
  );
}
