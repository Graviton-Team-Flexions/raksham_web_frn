import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import SignIn from '../pages/auth/SignIn.jsx'
import CreateAccount from '../pages/auth/CreateAccount.jsx'
import AppLayout from '../components/app/AppLayout.jsx'
import RequireSession from '../components/app/RequireSession.jsx'
import DashboardPage from '../pages/app/DashboardPage.jsx'
import AskSachiPage from '../pages/app/AskSachiPage.jsx'
import ProblemAreasPage from '../pages/app/ProblemAreasPage.jsx'
import AdvocatesPage from '../pages/app/AdvocatesPage.jsx'
import DraftsPage from '../pages/app/DraftsPage.jsx'
import DraftDetailPage from '../pages/app/DraftDetailPage.jsx'
import ChecklistPage from '../pages/app/ChecklistPage.jsx'
import ChecklistDetailPage from '../pages/app/ChecklistDetailPage.jsx'
import ResourcesPage from '../pages/app/ResourcesPage.jsx'
import ResourceArticlePage from '../pages/app/ResourceArticlePage.jsx'
import LegalSearchPage from '../pages/app/LegalSearchPage.jsx'
import LegalDocumentPage from '../pages/app/LegalDocumentPage.jsx'
import ResourceTemplatePage from '../pages/app/ResourceTemplatePage.jsx'
import AppPlaceholderPage from '../pages/app/AppPlaceholderPage.jsx'

// Start every route change at the top, or at the in-page anchor named in the URL.
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [pathname, hash])
  return null
}

// Sections of the signed-in app that are not built yet render an honest placeholder.
const placeholderPaths = ['privacy', 'help']

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/create-account" element={<CreateAccount />} />
        <Route
          path="/app"
          element={
            <RequireSession>
              <AppLayout />
            </RequireSession>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<DashboardPage />} />
          <Route path="ask-sachi" element={<AskSachiPage />} />
          <Route path="problem-areas" element={<ProblemAreasPage />} />
          <Route path="advocates" element={<AdvocatesPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="drafts/:draftId" element={<DraftDetailPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="checklist/:checklistId" element={<ChecklistDetailPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="resources/search" element={<LegalSearchPage />} />
          <Route path="resources/legal/:docId" element={<LegalDocumentPage />} />
          <Route path="resources/articles/:articleId" element={<ResourceArticlePage />} />
          <Route path="resources/templates/:templateId" element={<ResourceTemplatePage />} />
          {placeholderPaths.map((path) => (
            <Route key={path} path={path} element={<AppPlaceholderPage />} />
          ))}
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
