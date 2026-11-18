import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article>
      <h2>{post.title}</h2>

      <p>{post.content}</p>

      <Link href={`/posts/${post.slug}`}>
        Read Post
      </Link>

      <style jsx>{`
        article {
          background: white;
          padding: 24px;
          margin-bottom: 16px;
          border: 1px solid #ddd;
          border-radius: 12px;
        }

        h2 {
          margin-top: 0;
        }
      `}</style>
    </article>
  );
}