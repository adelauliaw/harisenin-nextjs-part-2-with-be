# Next.js Part 1 --- Build the Frontend First, Then Connect the Existing Node.js API

Harisenin Bootcamp --- Full-Stack Web Developer

## Learning Goal

Mahasiswa membangun frontend Next.js terlebih dahulu: struktur folder,
components, pages, navigation, dan styling. Setelah seluruh halaman
terbentuk, frontend dihubungkan ke backend Node.js REST API Part 3 yang
sudah tersedia.

Tidak membuat backend atau endpoint baru.

Urutan pembelajaran: 1. Setup Next.js dengan Pages Router. 2. Buat
folder, components, dan pages. 3. Isi halaman dengan UI awal agar
website bisa dibuka dan dinavigasi. 4. Siapkan backend yang sudah ada
pada port `3001`. 5. Jalankan Sequelize Seeder untuk menyiapkan sample
posts dan slug. 6. Tambahkan `.env.local` dan `.env.example`. 7. Buat
API Helper dan Authentication Helper. 8. Hubungkan pages dengan endpoint
Node.js yang sudah tersedia. 9. Uji aplikasi full-stack.

------------------------------------------------------------------------

# PART 1 --- BUILD THE NEXT.JS FRONTEND FIRST

## 1. Application Architecture

``` text
BROWSER
   |
   v
NEXT.JS PAGES ROUTER
http://localhost:3000
   |
   | fetch() / HTTP request
   v
NODE.JS + EXPRESS REST API
http://localhost:3001
   |
   v
ROUTES -> JWT MIDDLEWARE -> CONTROLLERS
   |
   v
SEQUELIZE
   |
   v
MYSQL DATABASE
```

  Application          Port Address
  ------------------ ------ -------------------------
  Next.js frontend     3000 `http://localhost:3000`
  Node.js backend      3001 `http://localhost:3001`
  MySQL / MariaDB      3306 `localhost:3306`

Next.js dan Node.js harus menggunakan port berbeda.

## 2. Create Next.js Project

Buka terminal baru. Project backend yang sudah ada tidak perlu dihapus
atau dibuat ulang.

``` bash
npx create-next-app@latest
```

Project name:

``` text
harisenin-nextjs-part-1
```

Pilih konfigurasi berikut jika prompt tersebut muncul:

  Prompt                         Pilihan
  ------------------------------ ---------
  TypeScript                     No
  Linter                         ESLint
  React Compiler                 No
  Tailwind CSS                   No
  Code inside `src/` directory   No
  App Router                     No
  Customize import alias         No

**Penting:** pilih `App Router = No` karena kelas ini menggunakan Pages
Router, `getStaticProps()`, dan `getStaticPaths()`.

> Prompt dapat berbeda mengikuti versi create-next-app. Pastikan
> menggunakan Pages Router, bukan App Router.

Masuk ke project:

``` bash
cd harisenin-nextjs-part-1
npm run dev
```

Buka `http://localhost:3000`.

Next.js biasanya sudah membuat folder `pages/` dan file awal seperti
`pages/index.js` serta `pages/_app.js`. **Jangan menghapus folder
pages.** Kita akan melengkapi dan mengganti isi file tersebut.

## 3. Create Project Structure

Buat struktur berikut. Jika `pages/`, `pages/index.js`, atau
`pages/_app.js` sudah dibuat otomatis, gunakan file tersebut dan jangan
membuat duplikat.

``` text
harisenin-nextjs-part-1/
|
├── pages/
│   ├── _app.js
│   ├── index.js
│   ├── about.js
│   ├── login.js
│   ├── register.js
│   ├── profile.js
│   ├── users.js
│   └── posts/
│       ├── index.js
│       └── [slug].js
|
├── components/
│   ├── Layout.js
│   ├── Navbar.js
│   └── PostCard.js
|
├── lib/
│   ├── api.js
│   └── auth.js
|
├── styles/
│   └── globals.css
|
├── .env.local
├── .env.example
└── public/
```

Buat folder yang belum tersedia:

``` bash
mkdir components lib pages/posts styles
```

Jika folder sudah ada, tidak perlu dibuat ulang.

  Folder / File   Responsibility
  --------------- ----------------------------------
  `pages/`        Menentukan halaman dan URL
  `components/`   Menyimpan UI reusable
  `lib/api.js`    Mengelola request ke REST API
  `lib/auth.js`   Mengelola token login di browser
  `styles/`       Menyimpan global CSS
  `.env.local`    Menyimpan alamat API lokal

## 4. Build Reusable Components

Pada tahap ini fokusnya membuat tampilan dan struktur frontend. Belum
ada request ke backend.

### 4.1 Navbar

Buat `components/Navbar.js`:

``` jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/posts">Posts</Link>
      <Link href="/login">Login</Link>
      <Link href="/register">Register</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/users">Users</Link>
    </nav>
  );
}
```

`Link` berasal dari `next/link`. `href` menentukan tujuan navigasi.
Navbar dapat digunakan kembali di semua halaman.

### 4.2 Layout

Buat `components/Layout.js`:

``` jsx
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="container">
        {children}
      </div>
    </>
  );
}
```

`children` adalah konten halaman yang dimasukkan ke dalam Layout.

### 4.3 PostCard

Buat `components/PostCard.js`:

``` jsx
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      <Link href={`/posts/${post.slug}`}>
        Read Post
      </Link>
    </article>
  );
}
```

Komponen ini menerima data artikel melalui props. Pada tahap UI awal,
data masih berasal dari contoh lokal. Nanti sumbernya diganti dengan
API.

## 5. Create Pages --- UI Awal

Isi seluruh halaman agar struktur aplikasi dan navigasi sudah berjalan
sebelum dihubungkan ke Node.js.

### 5.1 Home Page

Buka `pages/index.js`, lalu isi:

``` jsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Harisenin Full-Stack Blog</h1>

      <p>
        Frontend built with Next.js.
        Backend powered by Node.js REST API.
      </p>

      <Link href="/posts">Explore Posts</Link>
    </main>
  );
}
```

URL: `http://localhost:3000/`

### 5.2 About Page

Buat `pages/about.js`:

``` jsx
export default function About() {
  return (
    <main>
      <h1>About This Project</h1>
      <p>
        This application uses Next.js Pages Router
        as the frontend and Node.js Express as the backend.
      </p>
    </main>
  );
}
```

URL: `http://localhost:3000/about`

### 5.3 Posts List --- UI Awal

Buat `pages/posts/index.js`:

``` jsx
import PostCard from "../../components/PostCard";

const posts = [
  {
    id: 1,
    title: "Belajar Next.js Routing",
    slug: "belajar-nextjs-routing",
    content: "Belajar file-based routing di Next.js.",
  },
  {
    id: 2,
    title: "Dynamic Route dengan Slug",
    slug: "dynamic-route-dengan-slug",
    content: "Memahami dynamic route menggunakan slug.",
  },
];

export default function PostsPage() {
  return (
    <main>
      <h1>Posts</h1>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}
```

Data ini hanya sementara untuk membangun UI. Pada tahap integrasi, data
akan diganti dengan response endpoint `GET /api/posts`.

### 5.4 Dynamic Detail Page --- UI Awal

Buat `pages/posts/[slug].js`:

``` jsx
import { useRouter } from "next/router";

export default function PostDetail() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <main>
      <h1>Post Detail</h1>
      <p>Current slug: {slug}</p>
    </main>
  );
}
```

Coba buka:

``` text
http://localhost:3000/posts/belajar-nextjs-routing
http://localhost:3000/posts/dynamic-route-dengan-slug
```

Satu file `[slug].js` dapat menangani banyak URL. Kode awal ini
menggunakan `useRouter()` untuk memahami dynamic route. Saat integrasi
API, file ini akan diganti dengan implementasi `getStaticPaths()` dan
`getStaticProps()`.

### 5.5 Login Page --- UI Awal

Buat `pages/login.js`:

``` jsx
export default function Login() {
  return (
    <main>
      <h1>Login</h1>
      <form>
        <label>Email</label>
        <input type="email" placeholder="name@email.com" />

        <label>Password</label>
        <input type="password" placeholder="Password" />

        <button type="submit">Login</button>
      </form>
    </main>
  );
}
```

### 5.6 Register Page --- UI Awal

Buat `pages/register.js`:

``` jsx
export default function Register() {
  return (
    <main>
      <h1>Register</h1>
      <form>
        <label>Name</label>
        <input type="text" placeholder="Full name" />

        <label>Email</label>
        <input type="email" placeholder="name@email.com" />

        <label>Password</label>
        <input type="password" placeholder="Create password" />

        <button type="submit">Register</button>
      </form>
    </main>
  );
}
```

### 5.7 Profile Page --- UI Awal

Buat `pages/profile.js`:

``` jsx
export default function Profile() {
  return (
    <main>
      <h1>My Profile</h1>
      <p>User profile will appear here.</p>
    </main>
  );
}
```

### 5.8 Users Page --- UI Awal

Buat `pages/users.js`:

``` jsx
export default function Users() {
  return (
    <main>
      <h1>Users</h1>
      <p>User list will appear here.</p>
    </main>
  );
}
```

## 6. Connect Layout Through \_app.js

Buka `pages/_app.js`, lalu ganti isinya:

``` jsx
import "../styles/globals.css";
import Layout from "../components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
```

Penjelasan: - `_app.js` adalah custom App untuk Pages Router. -
`Component` adalah halaman yang sedang dibuka. - `pageProps` adalah
props yang diterima halaman. - `Layout` membungkus seluruh halaman agar
Navbar tampil konsisten.

## 7. Add Global Styling

Buat `styles/globals.css`:

``` css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f7f7f7;
  color: #111;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 20px 40px;
  background: #111;
}

nav a {
  color: white;
  text-decoration: none;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 24px;
}

main {
  padding: 24px 0;
}

.post-card {
  background: white;
  padding: 24px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
}

.post-card h2 {
  margin-top: 0;
}

input {
  display: block;
  width: 100%;
  max-width: 420px;
  padding: 12px;
  margin: 8px 0 16px;
}

button {
  padding: 10px 16px;
  cursor: pointer;
}
```

### Frontend Checkpoint

Jalankan:

``` bash
npm run dev
```

Pastikan halaman berikut dapat dibuka:

  URL                               Expected
  --------------------------------- ----------------------------------
  `/`                               Home page
  `/about`                          About page
  `/posts`                          Posts list dengan data sementara
  `/posts/belajar-nextjs-routing`   Detail page menampilkan slug
  `/login`                          Login form
  `/register`                       Register form
  `/profile`                        Profile placeholder
  `/users`                          Users placeholder

Sampai tahap ini frontend sudah terbentuk. Data posts masih sementara
dan form belum mengirim request.

------------------------------------------------------------------------

# PART 2 --- PREPARE THE EXISTING NODE.JS BACKEND

## 8. Use the Existing Backend Project

Gunakan project backend yang sudah selesai:

``` text
harisenin-nodejs-rest-api-part-3
```

Tidak perlu membuat project Node.js baru.

Endpoint yang sudah tersedia:

  Method   Endpoint               Purpose                           Authentication
  -------- ---------------------- --------------------------------- ----------------
  `POST`   `/api/auth/register`   Register                          No
  `POST`   `/api/auth/login`      Login dan memperoleh JWT          No
  `GET`    `/api/profile`         Profil user aktif                 Bearer Token
  `GET`    `/api/users`           Daftar user                       Bearer Token
  `GET`    `/api/posts`           Daftar artikel                    No
  `GET`    `/api/posts/:slug`     Detail artikel berdasarkan slug   No

Contoh URL lengkap:

``` text
POST http://localhost:3001/api/auth/register
POST http://localhost:3001/api/auth/login
GET  http://localhost:3001/api/profile
GET  http://localhost:3001/api/users
GET  http://localhost:3001/api/posts
GET  http://localhost:3001/api/posts/belajar-nextjs-routing
```

Endpoint `/api/profile` dan `/api/users` membutuhkan header:

``` http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 9. Update Backend Port and index.js

Karena Next.js berjalan di port `3000`, backend harus menggunakan port
`3001`.

Di file `.env` backend:

``` env
SERVER_PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=

DATABASE_NAME=fsd_bootcamp
DATABASE_NAME_TEST=fsd_bootcamp_test

JWT_SECRET=your_backend_jwt_secret
```

Sesuaikan `DATABASE_PASSWORD` dengan konfigurasi MySQL lokal.

Buka `src/index.js` dan ganti seluruh isinya:

``` js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { sequelize } = require("./models");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Node.js REST API Part 3",
    data: null,
  });
});

app.use("/api", routes);

app.use((error, req, res, next) => {
  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
    data: null,
  });
});

const PORT = process.env.SERVER_PORT || 3001;

const start = async () => {
  await sequelize.authenticate();

  console.log("Database connected");

  app.listen(PORT, () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );
  });
};

start().catch(console.error);
```

Perubahan: - Hapus `require("node:path")`. - Hapus `express.static()`
yang sebelumnya menyajikan HTML melalui `/dashboard`. - Pertahankan
`cors()`, `express.json()`, routes, error handler, dan Sequelize. - Ubah
port backend menjadi `3001`.

Express sekarang menyediakan REST API. Next.js menjadi frontend
aplikasi.

Jalankan backend:

``` bash
npm run dev
```

Expected:

``` text
Database connected
Server running on http://localhost:3001
```

Tes:

``` text
GET http://localhost:3001/
GET http://localhost:3001/api/posts
```

------------------------------------------------------------------------

# PART 3 --- SEEDER: PREPARE POSTS AND SLUGS

## 10. Why Do We Need Seeder?

Seeder dijalankan di project backend Node.js, bukan di project Next.js.

Tujuannya mengisi tabel `posts` dengan sample data agar endpoint posts
memiliki data yang bisa dibaca oleh Next.js.

``` text
Sequelize Seeder
       |
       v
MySQL: posts
       |
       v
GET /api/posts
       |
       v
Next.js getStaticPaths()
       |
       v
/posts/[slug]
```

## 11. Ensure a User Exists

Tabel `posts` membutuhkan `user_id` karena memiliki relasi foreign key
ke tabel `users`.

Jika belum ada user, register melalui Postman:

``` http
POST http://localhost:3001/api/auth/register
Content-Type: application/json
```

Body:

``` json
{
  "name": "Bootcamp Student",
  "email": "student@example.com",
  "password": "Belajar123!"
}
```

Password contoh mengikuti aturan validator backend: minimal 8 karakter,
huruf besar, huruf kecil, angka, dan simbol.

## 12. Generate Seeder

Dari root project backend:

``` bash
npx sequelize-cli seed:generate --name sample-posts
```

Dengan konfigurasi `.sequelizerc` yang sudah mengarahkan `seeders-path`
ke `src/database/seeders`, file baru dibuat di folder:

``` text
src/database/seeders/
```

Buka file seeder yang baru dibuat dan ganti isinya:

``` js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users ORDER BY id ASC LIMIT 1",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const userId = users[0]?.id;

    if (!userId) {
      throw new Error(
        "User belum tersedia. Register user terlebih dahulu."
      );
    }

    const now = new Date();

    await queryInterface.bulkInsert("posts", [
      {
        user_id: userId,
        title: "Belajar Next.js Routing",
        slug: "belajar-nextjs-routing",
        content:
          "Next.js Pages Router menggunakan file di folder pages sebagai route.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userId,
        title: "Dynamic Route dengan Slug",
        slug: "dynamic-route-dengan-slug",
        content:
          "Satu file [slug].js dapat digunakan untuk menampilkan banyak detail page.",
        created_at: now,
        updated_at: now,
      },
      {
        user_id: userId,
        title: "My First Full Stack Post",
        slug: "my-first-full-stack-post",
        content:
          "Node.js menjadi backend dan Next.js menjadi frontend aplikasi full-stack.",
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("posts", {
      slug: [
        "belajar-nextjs-routing",
        "dynamic-route-dengan-slug",
        "my-first-full-stack-post",
      ],
    });
  },
};
```

Penjelasan: - Seeder mencari `id` user yang sudah ada. - `user_id`
memenuhi relasi foreign key. - Setiap post memiliki `title`, `slug`, dan
`content`. - `created_at` dan `updated_at` diisi karena migration
mewajibkan nilai dan tidak memberikan default value. - Slug harus unik
karena digunakan sebagai identitas URL.

## 13. Run Seeder

Dari root backend:

``` bash
npx sequelize-cli db:seed:all
```

Untuk membatalkan seluruh seeder:

``` bash
npx sequelize-cli db:seed:undo:all
```

Jangan menjalankan seeder berulang kali dengan slug yang sama tanpa undo
atau memeriksa data terlebih dahulu. Kolom slug memiliki aturan unique.

## 14. Verify Seed Data

Di DBeaver:

``` sql
USE fsd_bootcamp;

SELECT
  id,
  user_id,
  title,
  slug,
  content,
  created_at,
  updated_at
FROM posts
ORDER BY id ASC;
```

Pastikan tiga artikel tersedia dan masing-masing memiliki slug.

Kemudian tes melalui Postman:

``` http
GET http://localhost:3001/api/posts
```

Tes detail:

``` http
GET http://localhost:3001/api/posts/belajar-nextjs-routing
```

Jika berhasil, backend siap menyediakan data untuk Next.js.

------------------------------------------------------------------------

# PART 4 --- CONNECT NEXT.JS TO NODE.JS

## 15. Add Next.js Environment Variables

Kembali ke project Next.js:

``` text
harisenin-nextjs-part-1/
```

Buat `.env.local` di root project:

``` env
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Buat juga `.env.example`:

``` env
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Fungsi:

  -----------------------------------------------------------------------
  Variable                            Usage
  ----------------------------------- -----------------------------------
  `API_URL`                           Request dari server Next.js,
                                      seperti `getStaticProps()` dan
                                      `getStaticPaths()`

  `NEXT_PUBLIC_API_URL`               Request dari browser, seperti
                                      register, login, profile, dan users
  -----------------------------------------------------------------------

`NEXT_PUBLIC_API_URL` boleh terlihat di browser karena hanya berisi
alamat API. Jangan pernah memasukkan `JWT_SECRET`, password database,
atau secret backend ke environment variable berawalan `NEXT_PUBLIC_`.

Pastikan `.env.local` tidak di-push ke Git. Setelah membuat atau
mengubah environment variables, restart Next.js:

``` bash
Ctrl + C
npm run dev
```

## 16. Create API Helper

Buat `lib/api.js`:

``` js
const SERVER_API_URL = process.env.API_URL;
const CLIENT_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Server-side: get all posts
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

// Server-side: get one post by slug
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

// Client-side: register, login, profile, users
export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.auth) {
    const token = sessionStorage.getItem(
      "harisenin_rest_api_token"
    );

    if (!token) {
      throw new Error(
        "Token tidak ditemukan. Silakan login."
      );
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
```

### Understand API Helper

``` text
Next.js Page
     |
     v
lib/api.js
     |
     v
fetch()
     |
     v
Node.js REST API
     |
     v
JSON Response
     |
     v
Next.js Page / Component
```

`getAllPosts()` dan `getPostBySlug()` digunakan oleh data-fetching
function Pages Router di sisi server.

`apiRequest()` digunakan oleh event handler atau `useEffect()` di
browser. Jangan membaca `sessionStorage` saat render server karena
`sessionStorage` hanya tersedia di browser.

## 17. Create Authentication Helper

Buat `lib/auth.js`:

``` js
export const TOKEN_KEY = "harisenin_rest_api_token";

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}
```

Token hanya diakses dari browser. `sessionStorage` digunakan untuk
latihan ini. Untuk aplikasi production, pertimbangkan session berbasis
HttpOnly Secure Cookie.

------------------------------------------------------------------------

# PART 5 --- REPLACE TEMPORARY UI WITH REAL API DATA

Pada Part 1, halaman Posts menggunakan array lokal dan halaman detail
hanya membaca slug dari URL. Sekarang kita mengganti data sementara
tersebut dengan response dari Node.js.

## 18. Update Posts List --- getStaticProps

Buka kembali `pages/posts/index.js` dan ganti seluruh isinya:

``` jsx
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
```

Buka:

``` text
http://localhost:3000/posts
```

Sekarang data diambil dari:

``` http
GET http://localhost:3001/api/posts
```

Alur:

``` text
pages/posts/index.js
        |
        v
getStaticProps()
        |
        v
getAllPosts()
        |
        v
lib/api.js
        |
        v
fetch()
        |
        v
GET /api/posts
        |
        v
Node.js -> Sequelize -> MySQL
        |
        v
JSON Response
        |
        v
props -> PostCard
```

Next.js tidak mengambil data langsung dari MySQL. Next.js meminta data
melalui REST API Node.js.

## 19. Update Dynamic Detail Page --- getStaticPaths

Buka `pages/posts/[slug].js` dan ganti kode awal yang menggunakan
`useRouter()`:

``` jsx
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
```

### Understand the Slug Flow

Data dari endpoint `GET /api/posts` memiliki slug:

``` text
belajar-nextjs-routing
dynamic-route-dengan-slug
my-first-full-stack-post
```

`getStaticPaths()` membentuk daftar:

``` js
[
  {
    params: {
      slug: "belajar-nextjs-routing",
    },
  },
  {
    params: {
      slug: "dynamic-route-dengan-slug",
    },
  },
  {
    params: {
      slug: "my-first-full-stack-post",
    },
  },
]
```

Satu file:

``` text
pages/posts/[slug].js
```

dapat menghasilkan tiga halaman:

``` text
/posts/belajar-nextjs-routing
/posts/dynamic-route-dengan-slug
/posts/my-first-full-stack-post
```

Satu template, banyak halaman.

Test slug yang tidak tersedia:

``` text
http://localhost:3000/posts/post-tidak-ada
```

Dengan `fallback: false`, slug yang tidak termasuk daftar paths akan
menghasilkan 404.

------------------------------------------------------------------------

# PART 6 --- CONNECT AUTHENTICATION PAGES

## 20. Connect Login Page

Buka `pages/login.js` dan ganti seluruh isinya:

``` jsx
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
```

Endpoint:

``` http
POST http://localhost:3001/api/auth/login
```

Alur:

``` text
Login Form
    |
    v
POST /api/auth/login
    |
    v
Node.js Auth Controller
    |
    v
bcrypt.compare()
    |
    v
jwt.sign()
    |
    v
JWT Token
    |
    v
sessionStorage
```

## 21. Connect Register Page

Buka `pages/register.js` dan ganti seluruh isinya:

``` jsx
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { apiRequest } from "../lib/api";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      setMessage(result.message || "Register berhasil.");
      router.push("/login");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Sudah punya akun? <Link href="/login">Login</Link>
      </p>
    </main>
  );
}
```

Endpoint:

``` http
POST http://localhost:3001/api/auth/register
```

Backend tetap melakukan validasi email, password, dan duplicate email.
Frontend tidak menggantikan validasi backend.

------------------------------------------------------------------------

# PART 7 --- CONNECT PROTECTED PAGES

## 22. Connect Profile Page

Buka `pages/profile.js` dan ganti seluruh isinya:

``` jsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { apiRequest } from "../lib/api";
import { getToken, removeToken } from "../lib/auth";

export default function Profile() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    apiRequest("/profile", { auth: true })
      .then((result) => setProfile(result.data))
      .catch((error) => {
        setMessage(error.message);
        removeToken();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <main>
      <h1>My Profile</h1>

      {message && <p>{message}</p>}

      {profile && (
        <>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </>
      )}

      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
```

Endpoint:

``` http
GET http://localhost:3001/api/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

## 23. Connect Users Page

Buka `pages/users.js` dan ganti seluruh isinya:

``` jsx
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
```

Endpoint:

``` http
GET http://localhost:3001/api/users
Authorization: Bearer YOUR_JWT_TOKEN
```

**Security note:** pengecekan token di frontend hanya mengatur navigasi.
Perlindungan data tetap dilakukan oleh JWT middleware di backend.
`sessionStorage` adalah pendekatan latihan, bukan pilihan penyimpanan
token paling aman untuk production.

------------------------------------------------------------------------

# PART 8 --- RUN AND TEST BOTH PROJECTS

## 24. Run Backend

Terminal 1:

``` bash
cd harisenin-nodejs-rest-api-part-3
npm run dev
```

Expected:

``` text
Database connected
Server running on http://localhost:3001
```

## 25. Run Frontend

Terminal 2:

``` bash
cd harisenin-nextjs-part-1
npm run dev
```

Buka:

``` text
http://localhost:3000
```

Jangan matikan backend saat menguji frontend.

## 26. Full-Stack Test Checklist

  ---------------------------------------------------------------------------------
  Feature                 URL / Action                      Expected
  ----------------------- --------------------------------- -----------------------
  Home                    `/`                               Homepage tampil

  About                   `/about`                          About page tampil

  Register                `/register`                       User berhasil dibuat

  Login                   `/login`                          JWT diterima

  Profile                 `/profile`                        Profil user tampil

  Users                   `/users`                          Daftar user tampil

  Posts                   `/posts`                          Data dari MySQL tampil

  Post detail             `/posts/belajar-nextjs-routing`   Detail artikel tampil

  Unknown slug            `/posts/post-tidak-ada`           404
  ---------------------------------------------------------------------------------

### Test Authentication

1.  Register user baru.
2.  Login menggunakan email dan password tersebut.
3.  Periksa response memiliki `data.token`.
4.  Token disimpan di `sessionStorage`.
5.  Buka `/profile`.
6.  Next.js mengirim header `Authorization: Bearer`.
7.  Backend memverifikasi token melalui JWT middleware.
8.  Logout menghapus token dari `sessionStorage`.

### Test Posts

1.  Jalankan Seeder di backend.
2.  Tes `GET /api/posts`.
3.  Buka `/posts` pada Next.js.
4.  Pastikan artikel dari database tampil.
5.  Klik `Read Post`.
6.  Pastikan URL menggunakan slug.
7.  Pastikan detail artikel sesuai dengan slug yang dipilih.

------------------------------------------------------------------------

# PART 9 --- STATIC GENERATION AND BUILD

## 27. Understand Static Generation

Pada Pages Router, `getStaticProps()` dan `getStaticPaths()` digunakan
untuk membuat halaman statis.

Dalam production: 1. Seeder menambahkan data ke MySQL. 2. Node.js
menyediakan data melalui `/api/posts`. 3. Next.js membaca daftar slug
melalui `getStaticPaths()`. 4. Next.js membangun halaman detail untuk
setiap slug. 5. Jika ada artikel baru setelah production build, jalankan
ulang build dan deploy agar halaman statis baru ikut dibuat.

Untuk latihan development, Next.js menjalankan ulang proses
data-fetching saat halaman diminta. Namun, perubahan database tidak
otomatis memperbarui production static pages.

## 28. Build Next.js

Pastikan backend hidup di port `3001`.

Pada terminal frontend:

``` bash
npm run build
```

Jika build berhasil:

``` bash
npm run start
```

Test:

``` text
http://localhost:3000
http://localhost:3000/about
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/profile
http://localhost:3000/users
http://localhost:3000/posts
http://localhost:3000/posts/belajar-nextjs-routing
```

------------------------------------------------------------------------

# PART 10 --- TROUBLESHOOTING

## A. fetch failed

Kemungkinan: - Backend belum berjalan. - Port backend salah. - `API_URL`
salah. - `.env.local` belum dibaca karena Next.js belum direstart.

Check:

``` text
http://localhost:3001/
http://localhost:3001/api/posts
```

Pastikan `.env.local`:

``` env
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## B. CORS Error

Jika request dari browser ditolak oleh CORS, pastikan backend
mengizinkan origin:

``` text
http://localhost:3000
```

Backend pada latihan ini menggunakan:

``` js
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
```

Untuk production, ganti origin dengan domain frontend yang sebenarnya.

## C. posts.map is not a function

Periksa response API:

``` json
{
  "message": "Success",
  "data": []
}
```

Helper harus mengembalikan:

``` js
return result.data;
```

Bukan:

``` js
return result;
```

## D. Post detail 404

Check:

``` text
GET http://localhost:3001/api/posts
```

Pastikan setiap artikel memiliki slug dan slug bersifat unik.

Nama file:

``` text
pages/posts/[slug].js
```

Parameter:

``` js
params: {
  slug: post.slug
}
```

## E. Login berhasil tetapi Profile 401

Periksa: - Apakah login mengembalikan `data.token`? - Apakah token
disimpan di `sessionStorage`? - Apakah request profile mengirim
`Authorization: Bearer TOKEN`? - Apakah token belum kedaluwarsa? -
Apakah `JWT_SECRET` backend tetap sama?

Jangan menaruh `JWT_SECRET` di frontend.

## F. Slug baru tidak muncul setelah production build

Pastikan data baru sudah masuk MySQL dan `GET /api/posts` sudah
menampilkan slug baru. Backend harus hidup ketika build dilakukan.

Kemudian jalankan kembali:

``` bash
npm run build
```

------------------------------------------------------------------------

# FINAL CHECKLIST

## Frontend Structure

``` text
[ ] Next.js Pages Router berhasil dibuat
[ ] pages/ tersedia
[ ] components/ tersedia
[ ] lib/ tersedia
[ ] styles/ tersedia
[ ] Navbar dibuat
[ ] Layout dibuat
[ ] PostCard dibuat
[ ] Home page dibuat
[ ] About page dibuat
[ ] Posts list dibuat
[ ] Dynamic detail page dibuat
[ ] Login page dibuat
[ ] Register page dibuat
[ ] Profile page dibuat
[ ] Users page dibuat
[ ] Global CSS diterapkan
[ ] Navigation berfungsi
```

## Backend and Data

``` text
[ ] Backend berjalan pada port 3001
[ ] MySQL berjalan
[ ] Database fsd_bootcamp tersedia
[ ] Seeder sample posts sudah dijalankan
[ ] Setiap post memiliki slug unik
[ ] GET /api/posts berhasil
[ ] GET /api/posts/:slug berhasil
[ ] POST /api/auth/register berhasil
[ ] POST /api/auth/login berhasil
[ ] GET /api/profile tersedia
[ ] GET /api/users tersedia
```

## Next.js Integration

``` text
[ ] .env.local dibuat
[ ] .env.example dibuat
[ ] API_URL benar
[ ] NEXT_PUBLIC_API_URL benar
[ ] lib/api.js dibuat
[ ] lib/auth.js dibuat
[ ] Posts mengambil data dari Node.js
[ ] getStaticProps berjalan
[ ] getStaticPaths mengambil slug dari API
[ ] Detail artikel berhasil ditampilkan
[ ] Login berhasil
[ ] Register berhasil
[ ] Profile menggunakan JWT
[ ] Users menggunakan JWT
[ ] Logout berfungsi
[ ] npm run build berhasil
```

------------------------------------------------------------------------

# FINAL LEARNING FLOW

``` text
PART 1 — BUILD FRONTEND
       |
       v
Create Next.js Project
       |
       v
Create Components
       |
       v
Create Pages
       |
       v
Navigation + Styling
       |
       v
Frontend Ready
       |
       v
PART 2 — PREPARE BACKEND DATA
       |
       v
Run Sequelize Seeder
       |
       v
MySQL Posts + Slugs
       |
       v
Node.js REST API
       |
       v
PART 3 — CONNECT API
       |
       v
.env.local
       |
       v
lib/api.js + lib/auth.js
       |
       v
getStaticProps()
       |
       v
getStaticPaths()
       |
       v
JWT Authentication
       |
       v
React Components
       |
       v
FULL-STACK APPLICATION
```

## Key Mental Model

  Technology             Responsibility
  ---------------------- -------------------------------------------
  Next.js Pages Router   Membuat halaman dan routing
  Components             Membuat UI reusable
  `Link`                 Navigasi ant halaman
  Styled JSX / CSS       Mengatur tampilan
  Sequelize Seeder       Mengisi data awal ke database
  MySQL                  Menyimpan data
  Node.js + Express      Menyediakan REST API
  `fetch()`              Mengirim HTTP request
  `lib/api.js`           Mengorganisasi fungsi request API
  `lib/auth.js`          Mengelola token di browser
  `getStaticProps()`     Menyiapkan data halaman
  `getStaticPaths()`     Menentukan dynamic paths
  `[slug].js`            Satu template untuk banyak halaman detail
  JWT                    Autentikasi request ke protected endpoint

**Target akhir:** mahasiswa mampu membangun frontend Next.js dari
struktur folder sampai halaman berfungsi, kemudian menghubungkannya
dengan endpoint backend yang sudah tersedia, menampilkan data MySQL
melalui REST API, dan membuat halaman artikel dinamis berdasarkan slug.

------------------------------------------------------------------------

# Reference Documentation

-   Pages Router: https://nextjs.org/docs/pages
-   Pages and Layouts:
    https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts
-   Linking and Navigating:
    https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating
-   Dynamic Routes:
    https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes
-   getStaticProps:
    https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props
-   getStaticPaths:
    https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths
-   CSS-in-JS / Styled JSX:
    https://nextjs.org/docs/pages/guides/css-in-js
