import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import HomePage from './pages/HomePage'
import MessagePage from './pages/MessagePage'
import LinkPage from './pages/LinkPage'
import RequestsMade from './components/sidenav/RequestsMade'
import ReceivedRequests from './components/sidenav/ReceivedRequests'
import Peers from './components/sidenav/Peers'
import Community from './components/sidenav/Community'
import Settings from './pages/Settings'
import ProfilePage from './pages/ProfilePage'
import CommunityDetail from './components/sidenav/CommunityDetail'
import AIProfileMatcher from './pages/AIProfileMatcher'


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route path='/home' element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path='/links' element={
            <ProtectedRoute>
              <LinkPage />
            </ProtectedRoute>
          }>
            <Route index element={<RequestsMade />} />
            <Route path="received-requests" element={<ReceivedRequests />} />
            <Route path="peers" element={<Peers />} />
            <Route path="community/*" element={<Community />}>
              <Route path=":name" element={<CommunityDetail />} />
            </Route>
          </Route>
          <Route path='/messages' element={
            <ProtectedRoute>
              <MessagePage />
            </ProtectedRoute>
          } />
          <Route path='/ai-matcher' element={
            <ProtectedRoute>
              <AIProfileMatcher />
            </ProtectedRoute>
          } />
          <Route path='/settings' element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }/>
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App