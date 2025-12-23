"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import { useGetPostsQuery } from "@/shared/api/jsonPlaceholderApi";
import { PostsList } from "./ui/PostsList";
import styles from "./PostsPage.module.scss";

interface PostsPageProps {
  initialPage: number;
  initialSearch: string;
}

interface SearchFormValues {
  search: string;
}

const POSTS_PER_PAGE = 10;
const MAX_PAGES = 10;

export default function PostsPage({ initialPage, initialSearch }: PostsPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(initialPage || 1);
  const [search, setSearch] = useState(initialSearch || "");

  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: { search: initialSearch || "" },
  });

  useEffect(() => {
    reset({ search: initialSearch || "" });
  }, [initialSearch, reset]);

  const { data: posts, isLoading, isError } = useGetPostsQuery({
    page,
    limit: POSTS_PER_PAGE,
    search,
  });

  const pageCount = useMemo(() => MAX_PAGES, []);

  const updateUrl = (nextPage: number, nextSearch: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (nextPage && nextPage !== 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }
    if (nextSearch) {
      params.set("search", nextSearch);
    } else {
      params.delete("search");
    }

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url, { scroll: false });
  };

  const onSubmit = (values: SearchFormValues) => {
    const nextSearch = values.search.trim();
    setSearch(nextSearch);
    setPage(1);
    updateUrl(1, nextSearch);
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    const nextPage = selectedItem.selected + 1;
    setPage(nextPage);
    updateUrl(nextPage, search);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Посты</h1>

      <form className={styles.searchForm} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Поиск по заголовку..."
          className={styles.searchInput}
          {...register("search")}
        />
        <button type="submit" className={styles.searchButton}>
          Найти
        </button>
      </form>

      {isLoading && <p className={styles.info}>Загрузка...</p>}
      {isError && <p className={styles.error}>Не удалось загрузить посты</p>}

      {!isLoading && posts && posts.length === 0 && (
        <p className={styles.info}>Посты не найдены</p>
      )}

      {posts && posts.length > 0 && <PostsList posts={posts} />}

      <div className={styles.paginationWrapper}>
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageChange}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          forcePage={Math.min(page - 1, pageCount - 1)}
          containerClassName={styles.pagination}
          pageClassName={styles.pageItem}
          pageLinkClassName={styles.pageLink}
          activeClassName={styles.pageItemActive}
          activeLinkClassName={styles.pageLinkActive}
          previousClassName={styles.pageItem}
          nextClassName={styles.pageItem}
          previousLinkClassName={styles.pageLink}
          nextLinkClassName={styles.pageLink}
          disabledClassName={styles.pageItemDisabled}
        />
      </div>
    </div>
  );
}
