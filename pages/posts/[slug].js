import {
  getAllPosts,
  getPostBySlug,
} from "../../lib/api";

export async function getStaticPaths() {
  const posts = await getAllPosts();

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
}

export default function PostDetail({ post }) {
  return (
    <main>
      <h1>{post.title}</h1>

      <p>{post.content}</p>

      {post.user && (
        <p>Author: {post.user.name}</p>
      )}
    </main>
  );
}