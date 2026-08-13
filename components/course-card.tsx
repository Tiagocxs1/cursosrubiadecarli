import Image from 'next/image'
import Link from 'next/link'
import { BookOpenIcon, Play, CheckCircle, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { IconBadge } from './icon-badge'
import { CourseProgress } from './course-progress'
import { motion } from 'framer-motion'

type CourseCardProps = {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
}

export default function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group h-full overflow-hidden rounded-3xl border border-[#D4AF37]/10 bg-white p-4 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"
    >
      <Link href={`/courses/${id}`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image fill className="object-cover transition-transform duration-700 group-hover:scale-105" alt={title} src={imageUrl} />
          
          {/* Premium overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/90 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-[#D4AF37] transition-colors">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>

        <div className="flex flex-col pt-4">
          <div className="line-clamp-2 text-xl font-bold text-[#1A1A1A] transition-colors group-hover:text-[#D4AF37]">
            {title}
          </div>
          <p className="text-xs text-[#4A3F35] font-medium mt-1">{category}</p>
          
          <div className="my-3 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2 text-[#4A3F35]">
              <IconBadge size="sm" icon={BookOpenIcon} variant="gold" />
              <span className="font-medium">
                {chaptersLength} {chaptersLength === 1 ? 'Módulo' : 'Módulos'}
              </span>
            </div>
          </div>

          {progress !== null ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-[#4A3F35]">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Progresso
                </span>
                <span>{progress}%</span>
              </div>
              <CourseProgress variant={progress === 100 ? 'success' : 'default'} size="sm" value={progress} />
              {progress === 100 && (
                <div className="flex items-center gap-2 text-[#D4AF37] font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Concluído
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#1A1A1A]">{formatPrice(price)}</span>
              <button className="px-4 py-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white rounded-lg font-medium transition-colors text-sm">
                Matricular-se
              </button>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
