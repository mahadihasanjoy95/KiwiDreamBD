import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCurrency } from '@/hooks/useCurrency'

const COLORS = ['#7C3AED','#16A34A','#F59E0B','#0EA5E9','#EC4899','#10B981','#F97316','#64748B']

const CustomTooltip = ({ active, payload, format }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-brand-mid rounded-xl px-3 py-2 shadow-brand-md text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-brand">{format(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export function DonutChart({ data }) {
  const { format } = useCurrency()

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="55%"
          outerRadius="75%"
          paddingAngle={3}
          startAngle={90}
          endAngle={-270}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip format={format} />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
