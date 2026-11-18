import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Node.js + Next.js</h1>

      <p>
        Backend menggunakan Node.js REST API.
        Frontend menggunakan Next.js Pages Router.
      </p>

      <Link href="/posts">
        Explore Posts
      </Link>

      <p>
        <Link href="/login">Login</Link>
        {" | "}
        <Link href="/register">Register</Link>
      </p>
    </main>
  );
}