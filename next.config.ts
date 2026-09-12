import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  // Let .mdx files be imported as modules (journal articles live in content/).
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  // Turbopack is the default bundler in Next 16. remark/rehype plugins must be
  // given as string names or [name, options] tuples, never imported functions,
  // because they are passed across to Rust. The journal needs none today.
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
