import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { version } from 'vue'
import { parse } from 'semver'
import type { SemVer } from 'semver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { PascalCasedName, name } from './package.json'

const { major, minor } = parse(version) as SemVer
console.log(major, minor)
export default {
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
  build: {
    lib: {
      name,
      entry: 'src/index.ts',
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        '@ledangdung/vanilla-jsoneditor',
        'vue-demi',
      ],
      output: {
        globals: {
          [name]: PascalCasedName,
        },
      },
    },
  },
  plugins: [{
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(/\{\{ NAME }}/, name).replaceAll(/\{\{ VUE_VERSION }}/g, String(major === 3 ? major : `${major}.${minor}`))
    },
  }, dts({ rollupTypes: true }), AutoImport({
    // targets to transform
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    // global imports to register
    imports: [
      // presets
      (major === 3 || (major === 2 && minor >= 7)) ? 'vue' : '@vue/composition-api',
    ],
  }), Components(), { ...visualizer(), apply: 'build' }, vue()],
}
