import Link from "next/link";
import type { Post } from "@/shared/api/jsonPlaceholderApi";
import { translatePostToRussian } from "@/shared/lib/translatePost";
import styles from "./PostsList.module.scss";

interface PostsListProps {
  posts: Post[];
}

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <ul className={styles.list}>
      {posts.map((post) => {
        const translated = translatePostToRussian(post);

        return (
          <li key={post.id} className={styles.item}>
            <Link href={`/posts/${post.id}`} className={styles.title}>
              {translated.title}
            </Link>
            <p className={styles.body}>{translated.body.slice(0, 120)}...</p>
          </li>
        );
      })}
    </ul>
  );
};
