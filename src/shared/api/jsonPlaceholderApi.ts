import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export const jsonPlaceholderApi = createApi({
  reducerPath: 'jsonPlaceholderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getPosts: builder.query<
      Post[],
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => {
        const params = new URLSearchParams();
        params.set('_page', String(page));
        params.set('_limit', String(limit));
        if (search) params.set('title_like', search);
        return `posts?${params.toString()}`;
      },
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `posts/${id}`,
    }),
    getPostComments: builder.query<Comment[], number>({
      query: (postId) => `posts/${postId}/comments`,
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostCommentsQuery,
} = jsonPlaceholderApi;
