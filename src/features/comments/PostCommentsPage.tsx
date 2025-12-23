"use client";

import Link from "next/link";
import { useGetPostByIdQuery, useGetPostCommentsQuery } from "@/shared/api/jsonPlaceholderApi";
import { translatePostToRussian } from "@/shared/lib/translatePost";
import styles from "./PostCommentsPage.module.scss";

interface PostCommentsPageProps {
  postId: number;
  fromPage?: number;
  fromSearch?: string;
}

export function PostCommentsPage({ postId, fromPage = 1, fromSearch = "" }: PostCommentsPageProps) {
  const { data: post, isLoading: isPostLoading, isError: isPostError } =
    useGetPostByIdQuery(postId);
  const {
    data: comments,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useGetPostCommentsQuery(postId);

  const backHref = fromSearch
    ? `/?page=${fromPage}&search=${encodeURIComponent(fromSearch)}`
    : fromPage && fromPage !== 1
    ? `/?page=${fromPage}`
    : "/";

  return (
    <div className={styles.container}>
      <Link href={backHref} className={styles.backLink}>
        ← Назад к списку постов
      </Link>

      {isPostLoading && <p className={styles.info}>Загрузка поста...</p>}
      {isPostError && <p className={styles.error}>Не удалось загрузить пост</p>}

      {post && (
        <article className={styles.post}>
          <h1 className={styles.postTitle}>
            {translatePostToRussian(post).title}
          </h1>
          <p className={styles.postBody}>
            {translatePostToRussian(post).body}
          </p>
        </article>
      )}

      <h2 className={styles.commentsTitle}>Комментарии</h2>

      {isCommentsLoading && <p className={styles.info}>Загрузка комментариев...</p>}
      {isCommentsError && (
        <p className={styles.error}>Не удалось загрузить комментарии</p>
      )}

      {comments && comments.length === 0 && (
        <p className={styles.info}>Комментариев нет</p>
      )}

      <ul className={styles.commentsList}>
        {comments?.map((comment) => (
          <li key={comment.id} className={styles.commentItem}>
            <h3 className={styles.commentTitle}>{comment.name}</h3>
            <p className={styles.commentBody}>{comment.body}</p>
            <p className={styles.commentEmail}>{comment.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
