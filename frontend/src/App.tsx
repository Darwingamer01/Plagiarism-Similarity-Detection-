import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import HeaderOnlyLayout from './components/layout/HeaderOnlyLayout'
import { LoadingSpinner } from './components/ui/loading-spinner'

// Lazy Load Pages
// LandingPage is eager loaded for better LCP
import LandingPage from './pages/LandingPage'
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'))
const VerifyEmailOTPPage = lazy(() => import('./pages/VerifyEmailOTPPage'))
const CompleteRegistrationPage = lazy(() => import('./pages/CompleteRegistrationPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const UploadPage = lazy(() => import('./pages/UploadPage'))
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'))
const SimilarityCheckPage = lazy(() => import('./pages/SimilarityCheckPage'))
const ResultsPage = lazy(() => import('./pages/ResultsPage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'))
const SetPasswordPage = lazy(() => import('./pages/SetPasswordPage'))
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'))
const DashboardDocumentationPage = lazy(() => import('./pages/DashboardDocumentationPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const SecurityPage = lazy(() => import('./pages/SecurityPage'))

function App() {
  console.log('App component rendering...')

  const { isAuthenticated } = useAuthStore()
  console.log('isAuthenticated:', isAuthenticated)

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/verify-email" element={!isAuthenticated ? <VerifyEmailPage /> : <Navigate to="/dashboard" />} />
          <Route path="/complete-registration" element={!isAuthenticated ? <CompleteRegistrationPage /> : <Navigate to="/dashboard" />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={!isAuthenticated ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/security" element={<SecurityPage />} />

          {/* Protected routes */}
          <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="similarity-check" element={<SimilarityCheckPage />} />
            <Route path="results/:id" element={<ResultsPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="verify-email-otp" element={<VerifyEmailOTPPage />} />
            <Route path="dashboard-documentation" element={<DashboardDocumentationPage />} />
          </Route>

          {/* Protected routes without Sidebar */}
          <Route element={isAuthenticated ? <HeaderOnlyLayout /> : <Navigate to="/login" />}>
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/set-password" element={<SetPasswordPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
