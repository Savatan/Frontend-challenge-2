import PostsPage from "@/features/posts/PostsPage";

interface HomeProps {
  searchParams?: {
    page?: string;
    search?: string;
  };
}

export default function Home({ searchParams }: HomeProps) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search ?? "";

  return <PostsPage initialPage={page} initialSearch={search} />;
}
