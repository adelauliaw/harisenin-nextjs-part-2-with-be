const SERVER_API_URL = process.env.API_URL;
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllPosts() {
  const response = await fetch(
    `${SERVER_API_URL}/api/posts`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const result = await response.json();

  return result.data;
}

export async function getPostBySlug(slug) {
  const response = await fetch(
    `${SERVER_API_URL}/api/posts/${encodeURIComponent(slug)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  const result = await response.json();

  return result.data;
}

export async function apiRequest(
  path,
  options = {}
) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.auth) {
    const token = sessionStorage.getItem(
      "harisenin_rest_api_token"
    );

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan login.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${CLIENT_API_URL}/api${path}`,
    {
      ...options,
      headers,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || `Request gagal (${response.status})`
    );
  }

  return result;
}