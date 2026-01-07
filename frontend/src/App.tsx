import { Routes, Route, Navigate } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import { useAuthStore } from './stores/authStore'
import Layout from './components/layout/Layout'
import HeaderOnlyLayout from './components/layout/HeaderOnlyLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import VerifyEmailOTPPage from './pages/VerifyEmailOTPPage'
import CompleteRegistrationPage from './pages/CompleteRegistrationPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import DocumentsPage from './pages/DocumentsPage'
import SimilarityCheckPage from './pages/SimilarityCheckPage'
import ResultsPage from './pages/ResultsPage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ChangePasswordPage from './pages/ChangePasswordPage'
import SetPasswordPage from './pages/SetPasswordPage'
import DocumentationPage from './pages/DocumentationPage'
import DashboardDocumentationPage from './pages/DashboardDocumentationPage'

import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'
import SecurityPage from './pages/SecurityPage'

function App() {
  console.log('App component rendering...')

  const { isAuthenticated } = useAuthStore()
  console.log('isAuthenticated:', isAuthenticated)

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
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
    </div>
  )
}

export default App
