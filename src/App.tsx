import { HashRouter, Route, Routes } from "react-router-dom"
import { BriefPage } from "@/pages/BriefPage"
import { ArchivePage } from "@/pages/ArchivePage"
import { ReadingListPage } from "@/pages/ReadingListPage"
import { WeeklyPage } from "@/pages/WeeklyPage"
import { BrainrotButton } from "@/components/BrainrotButton"

// HashRouter so deep links (archive, past briefs) work on GitHub Pages
// without a 404.html rewrite hack.
function App() {
  return (
    <HashRouter>
      <div className="mx-auto max-w-5xl px-4 pb-6 sm:px-8">
        <Routes>
          <Route path="/" element={<BriefPage />} />
          <Route path="/brief/:date" element={<BriefPage />} />
          <Route path="/weekly" element={<WeeklyPage />} />
          <Route path="/weekly/:date" element={<WeeklyPage />} />
          <Route path="/archive" element={<ArchivePage />} />
          <Route path="/reading-list" element={<ReadingListPage />} />
        </Routes>
      </div>
      <BrainrotButton />
    </HashRouter>
  )
}

export default App
