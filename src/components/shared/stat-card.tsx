"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function StatCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const [show, setShow] = useState(!!reduceMotion)

  useEffect(() => {
    if (inView) setShow(true)
  }, [inView])

  return (
    <div ref={ref}>
      <Card>
        <CardContent className="py-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="font-heading text-2xl font-bold text-primary"
          >
            {value}
          </motion.div>
          <div className="mt-1 text-sm font-medium text-foreground">{label}</div>
          {trend && <div className="mt-1 text-xs text-muted-foreground">{trend}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
