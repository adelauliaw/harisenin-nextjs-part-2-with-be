import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { apiRequest } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!result.data?.token) {
        throw new Error("Token tidak ditemukan.");
      }

      saveToken(result.data.token);

      router.push("/profile");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Belum punya akun? <Link href="/register">Register</Link>
      </p>
    </main>
  );
}