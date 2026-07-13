import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Loader2, MessageSquare } from "lucide-react";
import useForums from "../../hooks/useForums";
import useDiscussions from "../../hooks/useDiscussions";
import DiscussionCard from "../../components/forum/DiscussionCard";
import CreateDiscussion from "../../components/forum/CreateDiscussion";
import { useAuth } from "../../components/context/AuthContext";

const ForumDetails = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const { singleForum, fetchForumBySlug, loading: forumLoading } = useForums();
  const { discussions, fetchDiscussionsByForum, loading: discussionsLoading } = useDiscussions();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchForumBySlug(slug);
  }, [slug, fetchForumBySlug]);

  useEffect(() => {
    if (singleForum?._id) {
      fetchDiscussionsByForum(singleForum._id);
    }
  }, [singleForum, fetchDiscussionsByForum]);

  if (forumLoading || !singleForum) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  const handleDiscussionCreated = () => {
    setShowCreate(false);
    fetchDiscussionsByForum(singleForum._id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link
          to="/community/forums"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Forums
        </Link>

        {/* Forum Header */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-4xl shadow-sm">
              {singleForum.icon || "💬"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {singleForum.name}
              </h1>
              <p className="text-slate-500 mt-1">{singleForum.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1">
                  <MessageSquare size={12} />
                  {singleForum.discussionCount || 0} Discussions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800">
            Discussions
          </h2>
          {user && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-[0px_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all text-sm"
            >
              <Plus size={18} />
              Start Discussion
            </button>
          )}
        </div>

        {/* Discussions List */}
        {discussionsLoading && discussions.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-red-600" size={30} />
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No discussions yet</h3>
            <p className="text-slate-500 text-sm">Be the first to start a conversation!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {discussions.map((discussion) => (
              <DiscussionCard key={discussion._id} discussion={discussion} />
            ))}
          </div>
        )}

        {/* Create Discussion Modal */}
        {showCreate && (
          <CreateDiscussion
            forumId={singleForum._id}
            onClose={() => setShowCreate(false)}
            onCreated={handleDiscussionCreated}
          />
        )}
      </div>
    </div>
  );
};

export default ForumDetails;