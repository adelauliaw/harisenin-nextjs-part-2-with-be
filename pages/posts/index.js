import PostCard from "../../components/PostCard";
import { getAllPosts } from "../../lib/api";

export async function getStaticProps() {
  const posts = await getAllPosts();

  return {
    props: {
      posts,
    },
  };
}

export default function PostsPage({ posts }) {
  return (
    <main>
      <h1>Posts</h1>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
        />
      ))}
    </main>
  );
}