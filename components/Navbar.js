import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      {" | "}
      <Link href="/posts">Posts</Link>
      {" | "}
      <Link href="/profile">Profile</Link>
      {" | "}
      <Link href="/users">Users</Link>
      {" | "}
      <Link href="/login">Login</Link>
    </nav>
  );
}