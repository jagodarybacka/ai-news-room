import { HashRouter, Route, Routes } from "react-router-dom"
import { BriefPage } from "@/pages/BriefPage"
import { ArchivePage } from "@/pages/ArchivePage"

// HashRouter so deep links (archive, past briefs) work on GitHub Pages
// without a 404.html rewrite hack.
function App() {
  return (
    <HashRouter>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        <Routes>
          <Route path="/" element={<BriefPage />} />
          <Route path="/brief/:date" element={<BriefPage />} />
          <Route path="/archive" element={<ArchivePage />} />
        </Routes>
      </div>
    </HashRouter>
  )
}

export default App
