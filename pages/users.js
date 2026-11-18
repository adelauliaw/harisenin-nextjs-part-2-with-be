import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";
import { getToken } from "../lib/auth";

export default function Users() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    apiRequest("/users", { auth: true })
      .then((result) => setUsers(result.data || []))
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p>Loading users...</p>;

  return (
    <main>
      <h1>Users</h1>

      {message && <p>{message}</p>}

      {users.map((user) => (
        <article key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </article>
      ))}
    </main>
  );
}