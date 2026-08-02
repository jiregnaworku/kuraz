import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FaTimes,
  FaPaperPlane,
  FaTrash,
  FaUserCircle,
  FaReply,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { getComments, addComment, deleteComment } from "../api/commentApi";

export default function CommentModal({
  open,
  onClose,
  productId,
  setCommentsCount,
}) {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const prevProductIdRef = useRef(null);

  // Reply states
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingSending, setReplyingSending] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Stable reference to setCommentsCount
  const setCommentsCountRef = useRef(setCommentsCount);
  useEffect(() => {
    setCommentsCountRef.current = setCommentsCount;
  }, [setCommentsCount]);

  // Update comment count helper
  const updateCommentsCount = useCallback((count) => {
    if (setCommentsCountRef.current) {
      setCommentsCountRef.current(count);
    }
  }, []);

  // ==========================
  // Load Comments from Database
  // ==========================
  useEffect(() => {
    if (!open || !productId) return;

    // Check if productId changed - using ref to avoid state update in effect
    if (prevProductIdRef.current !== productId) {
      prevProductIdRef.current = productId;
      setComments([]);
    }

    let isMounted = true;

    const fetchComments = async () => {
      try {
        setLoading(true);
        console.log("Fetching comments for product:", productId);
        const data = await getComments(productId);
        console.log("Received data:", data);

        // Handle different possible response shapes from the backend
        let commentsList = [];
        if (Array.isArray(data)) {
          commentsList = data;
        } else if (Array.isArray(data?.comments)) {
          commentsList = data.comments;
        } else if (Array.isArray(data?.data)) {
          commentsList = data.data;
        } else if (Array.isArray(data?.data?.comments)) {
          commentsList = data.data.comments;
        } else if (data?.comment) {
          commentsList = [data.comment];
        } else if (data?.data?.comment) {
          commentsList = [data.data.comment];
        }

        console.log("Processed comments:", commentsList);

        if (isMounted) {
          setComments(commentsList);
          updateCommentsCount(commentsList.length);
        }
      } catch (err) {
        console.error("Failed to load comments for product:", productId, err);
        if (isMounted) {
          setComments([]);
          updateCommentsCount(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchComments();

    return () => {
      isMounted = false;
    };
  }, [open, productId, updateCommentsCount]); // Removed prevProductId dependency

  // ==========================
  // ESC closes modal + lock body scroll
  // ==========================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  // ==========================
  // Add Top-Level Comment
  // ==========================
  const handleAddComment = async () => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (!text.trim()) return;

    try {
      setSending(true);
      const data = await addComment(productId, text.trim());
      const newComment = data.comment || data.data || data;

      setComments((prev) => {
        const updated = [newComment, ...prev];
        updateCommentsCount(updated.length);
        return updated;
      });
      setText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert(err.response?.data?.message || "Unable to post comment.");
    } finally {
      setSending(false);
    }
  };

  // ==========================
  // Add Reply
  // ==========================
  const handleReplySubmit = async (parentId) => {
    if (!user) {
      navigate("/signin");
      return;
    }

    if (!replyText.trim()) return;

    try {
      setReplyingSending(true);
      const data = await addComment(productId, replyText.trim(), parentId);
      const newComment = data.comment || data.data || data;

      setComments((prev) => {
        const updated = [newComment, ...prev];
        updateCommentsCount(updated.length);
        return updated;
      });
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Failed to reply:", err);
      alert(err.response?.data?.message || "Unable to post reply.");
    } finally {
      setReplyingSending(false);
    }
  };

  // ==========================
  // Delete Comment
  // ==========================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await deleteComment(id);
      setComments((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        updateCommentsCount(updated.length);
        return updated;
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert(err.response?.data?.message || "Unable to delete comment.");
    }
  };

  // Reset reply state when modal closes
  const handleClose = useCallback(() => {
    setReplyingTo(null);
    setReplyText("");
    setText("");
    onClose();
  }, [onClose]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 transition-opacity duration-300"
    >
      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full flex-col bg-white shadow-2xl 
                   rounded-t-2xl sm:rounded-2xl 
                   h-[92dvh] sm:h-auto sm:max-h-[85vh] 
                   sm:max-w-lg md:max-w-xl lg:max-w-2xl 
                   ring-1 ring-black/5 
                   animate-in slide-in-from-bottom-8 sm:zoom-in-95 fade-in duration-300"
      >
        {/* ==========================
            HEADER
        ========================== */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Comments
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              {comments.length} comment{comments.length !== 1 && "s"}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* ==========================
            COMMENTS LIST
        ========================== */}
        <div className="flex-1 overflow-y-auto overscroll-contain bg-white">
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-gray-200 border-t-[#d4af37]" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-300">
                <FaUserCircle className="text-3xl" />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900">
                No comments yet
              </h3>
              <p className="mt-1.5 text-[13px] text-gray-500 max-w-[240px]">
                Be the first to share your thoughts on this product.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className={`group relative px-4 py-3.5 sm:px-5 transition-colors hover:bg-gray-50/80 ${
                    comment.replyTo ? "pl-12 sm:pl-14" : ""
                  }`}
                >
                  {/* Visual thread line for replies */}
                  {comment.replyTo && (
                    <div className="absolute left-7 sm:left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="shrink-0 relative z-10">
                      {comment.user?.profileImage ? (
                        <img
                          src={comment.user.profileImage}
                          alt={comment.user.fullName}
                          className="h-10 w-10 rounded-full object-cover bg-gray-100 ring-1 ring-gray-100"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#24312c] text-white">
                          <FaUserCircle className="text-xl" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-x-1.5 flex-wrap">
                        <span className="text-[15px] font-bold text-gray-900 truncate">
                          {comment.user?.fullName || "Anonymous User"}
                        </span>
                        {comment.replyTo && (
                          <span className="text-[13px] text-[#d4af37] font-medium">
                            · replied
                          </span>
                        )}
                        <span className="text-[13px] text-gray-400">·</span>
                        <span className="text-[13px] text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <p className="mt-1 text-[15px] leading-5 text-gray-800 whitespace-pre-wrap break-words">
                        {comment.message || comment.comment}
                      </p>

                      {/* Actions */}
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment._id ? null : comment._id,
                            )
                          }
                          className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-[#d4af37] transition-colors"
                        >
                          <FaReply className="text-[11px]" />
                          Reply
                        </button>

                        {(user?._id === comment.user?._id ||
                          user?.role === "admin") && (
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 sm:opacity-100"
                            aria-label="Delete comment"
                            title="Delete comment"
                          >
                            <FaTrash className="text-[11px]" />
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Inline reply composer */}
                      {replyingTo === comment._id && (
                        <div className="mt-3 flex gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="shrink-0 pt-0.5">
                            {user?.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt=""
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                                <FaUserCircle className="text-base" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <textarea
                              rows={2}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.user?.fullName || "User"}...`}
                              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[14px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                              autoFocus
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleReplySubmit(comment._id)}
                                disabled={replyingSending || !replyText.trim()}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#24312c] px-4 py-1.5 text-[13px] font-semibold text-white hover:bg-[#d4af37] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {replyingSending ? (
                                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <>
                                    <FaPaperPlane className="text-[10px]" />
                                    Reply
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==========================
            FOOTER – sticky composer
        ========================== */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-3 py-3 sm:px-4 sm:py-3.5">
          {!user && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-[13px] font-medium text-amber-800">
              <FaUserCircle className="text-sm shrink-0" />
              <span>Please sign in to leave a comment.</span>
            </div>
          )}

          <div className="flex items-end gap-2.5">
            <div className="shrink-0 pb-1">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <FaUserCircle className="text-lg" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <textarea
                rows={1}
                value={text}
                disabled={sending || !user}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder={
                  user ? "Post your reply..." : "Sign in to comment..."
                }
                className="w-full min-h-[40px] max-h-28 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none focus:border-[#d4af37] focus:bg-white focus:ring-2 focus:ring-[#d4af37]/15 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              />
            </div>

            <button
              type="button"
              onClick={handleAddComment}
              disabled={sending || !text.trim() || !user}
              className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#24312c] text-white hover:bg-[#d4af37] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Send comment"
            >
              {sending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <FaPaperPlane className="text-sm" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
