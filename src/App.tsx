
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import JobMarketDashboard from "./pages/JobMarketDashboard";
import ResumeSuggestions from "./pages/ResumeSuggestions";
import InterviewBot from "./pages/InterviewBot";
import ExpertRegistration from "./pages/ExpertRegistration";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertProfileEdit from "./pages/ExpertProfileEdit";
import ExpertsSearch from "./pages/ExpertsSearch";
import ExpertDetails from "./pages/ExpertDetails";
import UserReferrals from "./pages/UserReferrals";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/job-market" element={
              <ProtectedRoute>
                <JobMarketDashboard />
              </ProtectedRoute>
            } />
            <Route path="/resume-analysis" element={
              <ProtectedRoute>
                <ResumeSuggestions />
              </ProtectedRoute>
            } />
            <Route path="/interview-bot" element={
              <ProtectedRoute>
                <InterviewBot />
              </ProtectedRoute>
            } />
            <Route path="/expert-registration" element={
              <ProtectedRoute>
                <ExpertRegistration />
              </ProtectedRoute>
            } />
            <Route path="/expert-dashboard" element={
              <ProtectedRoute>
                <ExpertDashboard />
              </ProtectedRoute>
            } />
            <Route path="/expert-profile/edit" element={
              <ProtectedRoute>
                <ExpertProfileEdit />
              </ProtectedRoute>
            } />
            <Route path="/experts" element={<ExpertsSearch />} />
            <Route path="/experts/:expertId" element={<ExpertDetails />} />
            <Route path="/my-referrals" element={
              <ProtectedRoute>
                <UserReferrals />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
