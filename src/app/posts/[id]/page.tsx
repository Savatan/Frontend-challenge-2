import { PostCommentsPage } from "@/features/comments/PostCommentsPage";

interface PostPageProps {
  params: { id: string };
  searchParams?: {
    page?: string;
    search?: string;
  };
}

export default function PostPage({ params, searchParams }: PostPageProps) {
  const postId = Number(params.id);
  const fromPage = Number(searchParams?.page) || 1;
  const fromSearch = searchParams?.search ?? "";

  return (
    <PostCommentsPage
      postId={postId}
      fromPage={fromPage}
      fromSearch={fromSearch}
    />
  );
}
