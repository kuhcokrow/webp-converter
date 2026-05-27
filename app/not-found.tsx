"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 transition-colors dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="bg-linear-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-9xl font-bold text-transparent">
            404
          </h1>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mx-auto mb-8 max-w-md text-slate-600 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Silakan
          kembali ke halaman utama.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  )
}
