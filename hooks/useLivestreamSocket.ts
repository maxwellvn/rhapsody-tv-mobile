import { socketService } from "@/services/socket.service";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SocketUser {
  id: string;
  fullName: string;
  avatar?: string;
  gender?: "male" | "female";
}

export interface SocketComment {
  id: string;
  content: string;
  user: SocketUser;
  parentCommentId?: string;
  createdAt: string;
}

export const useLivestreamSocket = (livestreamId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [comments, setComments] = useState<SocketComment[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const livestreamIdRef = useRef<string | undefined>(livestreamId);

  useEffect(() => {
    livestreamIdRef.current = livestreamId;
  }, [livestreamId]);

  useEffect(() => {
    if (!livestreamId) return;

    const initSocket = async () => {
      const socket = await socketService.connect();
      if (!socket) {
        setIsConnected(false);
        setError("Please sign in to use live chat");
        return;
      }

      socket.on("connect", () => {
        setIsConnected(true);
        setError(null);
        // Join the room once connected
        socket.emit("joinLivestream", { livestreamId });
      });

      socket.on("connect_error", (err: Error) => {
        setIsConnected(false);
        setError(err.message || "Unable to connect to livestream chat");
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
      });

      socket.on("newComment", (comment: SocketComment) => {
        setComments((prev) => [...prev, comment]);
      });

      socket.on("commentHistory", (data: { comments: SocketComment[] }) => {
        setComments(data.comments);
      });

      socket.on("commentDeleted", (data: { commentId: string }) => {
        setComments((prev) => prev.filter((c) => c.id !== data.commentId));
      });

      socket.on("viewerCount", (data: { count: number }) => {
        setViewerCount(data.count);
      });

      socket.on(
        "updateLikeCount",
        (data: { livestreamId: string; count: number }) => {
          if (data.livestreamId === livestreamIdRef.current) {
            setLikeCount(data.count);
          }
        },
      );

      socket.on(
        "userLikeStatus",
        (data: { livestreamId: string; hasLiked: boolean }) => {
          if (data.livestreamId === livestreamIdRef.current) {
            setHasLiked(data.hasLiked);
          }
        },
      );

      socket.on("error", (data: { message: string }) => {
        setError(data.message);
      });

      // If already connected, join immediately
      if (socket.connected) {
        setIsConnected(true);
        socket.emit("joinLivestream", { livestreamId });
      }
    };

    initSocket();

    return () => {
      if (livestreamId) {
        socketService.emit("leaveLivestream", { livestreamId });
      }
      socketService.off("connect");
      socketService.off("disconnect");
      socketService.off("connect_error");
      socketService.off("newComment");
      socketService.off("commentHistory");
      socketService.off("commentDeleted");
      socketService.off("viewerCount");
      socketService.off("updateLikeCount");
      socketService.off("userLikeStatus");
      socketService.off("error");
    };
  }, [livestreamId]);

  const sendComment = useCallback(
    (content: string, parentCommentId?: string) => {
      if (livestreamId) {
        socketService.emit("sendComment", {
          livestreamId,
          content,
          parentCommentId,
        });
      }
    },
    [livestreamId],
  );

  const toggleLike = useCallback(() => {
    if (livestreamId) {
      socketService.emit("toggleLike", { livestreamId });
      console.log("Like toggled for livestream:", livestreamId);
    }
  }, [livestreamId]);

  return {
    isConnected,
    comments,
    viewerCount,
    likeCount,
    hasLiked,
    error,
    sendComment,
    toggleLike,
  };
};
