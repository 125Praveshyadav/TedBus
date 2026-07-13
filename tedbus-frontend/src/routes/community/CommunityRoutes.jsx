import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../components/context/AuthContext";

// Pages
import CommunityHome from "../../pages/community/CommunityHome";
import CreatePost from "../../pages/community/CreatePost";
import PostDetails from "../../pages/community/PostDetails";
import Trending from "../../pages/community/Trending";
 import Leaderboard from "../../pages/community/Leaderboard";
//  import SavedPosts from "../../pages/community/SavedPosts";

import Forums from "../../pages/forum/Forums";
import ForumDetails from "../../pages/forum/ForumDetails";
import DiscussionDetails from "../../pages/forum/DiscussionDetails";
import CreateDiscussion from "../../pages/forum/CreateDiscussion";

import CommunityProfile from "../../pages/profile/CommunityProfile";

import EditPost from "../../pages/community/EditPost";

// // Admin
// import CommunityAdmin from "../../pages/admin/CommunityAdmin";

const CommunityRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<CommunityHome />} />
      <Route path="/trending" element={<Trending />} /> 
      <Route path="/leaderboard" element={<Leaderboard />} />
      
      <Route
        path="/create-post"
        element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
      />

      <Route path="/post/:id" element={<PostDetails />} />
      <Route path="/edit-post/:id" element={isAuthenticated ? <EditPost /> : <Navigate to="/login" />} />
      <Route path="/forums" element={<Forums />} />

      <Route path="/forums/:slug" element={<ForumDetails />} />

      <Route path="/forums/:slug/discussion/:id"  element={<DiscussionDetails />} />

      {/* Protected Routes */}

{/*       
      <Route
        path="/saved"
        element={isAuthenticated ? <SavedPosts /> : <Navigate to="/login" />}
      />  */}
      <Route
        path="/create-discussion/:forumId"
        element={
          isAuthenticated ? <CreateDiscussion /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? <CommunityProfile /> : <Navigate to="/login" />
        }
      />

      <Route path="/profile/:id" element={<CommunityProfile />} />

      {/* Admin Community Routes */}
      {/* <Route
        path="/admin"
        element={isAuthenticated ? <CommunityAdmin /> : <Navigate to="/login" />}
      /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/community" />} />
    </Routes>
  );
};

export default CommunityRoutes;
