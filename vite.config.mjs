import { defineConfig, loadEnv, transformWithEsbuild } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"
import path from "path"

const config = ({ mode }) => {
  // Load .env file
  import.meta.env = { ...import.meta.env, ...loadEnv(mode, process.cwd()) }
  const isReverseProxy = import.meta.env.VITE_REVERSE_PROXY === "true"

  return defineConfig({
    base: isReverseProxy ? "/26/" : "/",
    define: {
      QUOTE: JSON.stringify('"'),
    },
    plugins: [
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          // 🔧 Tambahkan dukungan untuk file .jsx juga
          if (!id.match(/src\/.*\.[jt]sx?$/)) return null

          return transformWithEsbuild(code, id, {
            loader: id.endsWith(".ts") || id.endsWith(".tsx") ? "tsx" : "jsx",
            jsx: "automatic",
          })
        },
      },
      react(),
      tailwindcss(),
    ],
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          ".js": "jsx",  // 🔧 Pastikan .js dibaca sebagai JSX
          ".ts": "tsx",  // 🔧 Tambahan: untuk TSX agar cepat diproses
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // ✅ sesuai tsconfig
      },
    },
    server: {
      port: parseInt(import.meta.env.VITE_PORT),
    },
  })
}

export default config
