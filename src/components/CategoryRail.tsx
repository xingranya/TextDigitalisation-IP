import { motion } from 'framer-motion'

interface CategoryRailProps {
  activeCategory: string
  categories: string[]
  counts: Record<string, number>
  onSelect: (category: string) => void
}

export function CategoryRail({
  activeCategory,
  categories,
  counts,
  onSelect,
}: CategoryRailProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="paper-panel sticky top-4 z-20 flex flex-wrap gap-2 p-3 backdrop-blur-md"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`filter-chip ${isActive ? 'filter-chip-active' : ''}`}
            >
              <span>{category}</span>
              <small>{counts[category] ?? 0}</small>
            </button>
          )
        })}
      </motion.div>
    </section>
  )
}
