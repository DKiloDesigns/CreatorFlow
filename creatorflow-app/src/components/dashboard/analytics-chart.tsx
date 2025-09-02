import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography,
  Box
} from '@mui/material';


interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie' | 'donut';
  className?: string;
  loading?: boolean;
}

export function AnalyticsChart({
  title,
  data,
  type = 'bar',
  className,
  loading = false
}: AnalyticsChartProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Typography variant="h6" sx={{ fontSize: '1.125rem' }}>{title}</Typography>
        </CardHeader>
        <CardContent>
          <Box sx={{ height: 256, bgcolor: 'action.hover', borderRadius: 1, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <Typography variant="h6" sx={{ fontSize: '1.125rem' }}>{title}</Typography>
      </CardHeader>
      <CardContent>
        {type === 'bar' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {data.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <Typography component="span" sx={{ fontWeight: 500 }}>{item.label}</Typography>
                  <Typography component="span" sx={{ color: 'text.secondary' }}>{item.value}</Typography>
                </Box>
                <Box sx={{ width: '100%', bgcolor: 'action.hover', borderRadius: '50%', height: 8 }}>
                  <Box
                    sx={{
                      height: 8,
                      borderRadius: '50%',
                      transition: 'all 0.5s ease',
                      bgcolor: item.color || 'primary.main',
                      width: `${(item.value / maxValue) * 100}%`
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {type === 'line' && (
          <Box sx={{ height: 256, display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 0.5 }}>
            {data.map((item, index) => (
              <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '100%',
                    borderTopLeftRadius: 1,
                    borderTopRightRadius: 1,
                    transition: 'all 0.5s ease',
                    bgcolor: item.color || 'primary.main',
                    height: `${(item.value / maxValue) * 100}%`
                  }}
                />
                <Typography component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {type === 'pie' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', width: 128, height: 128 }}>
              <svg style={{ width: 128, height: 128, transform: 'rotate(-90deg)' }} viewBox="0 0 32 32">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const circumference = 2 * Math.PI * 14; // radius = 14
                  const strokeDasharray = (percentage / 100) * circumference;
                  const strokeDashoffset = index === 0 ? 0 : 
                    data.slice(0, index).reduce((sum, d) => 
                      sum + ((d.value / total) * circumference), 0
                    );
                  
                  return (
                    <circle
                      key={index}
                      cx="16"
                      cy="16"
                      r="14"
                      fill="none"
                      stroke={item.color || '#3b82f6'}
                      strokeWidth="4"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  );
                })}
              </svg>
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{total}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        {type === 'donut' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', width: 128, height: 128 }}>
              <svg style={{ width: 128, height: 128, transform: 'rotate(-90deg)' }} viewBox="0 0 32 32">
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const circumference = 2 * Math.PI * 12; // radius = 12
                  const strokeDasharray = (percentage / 100) * circumference;
                  const strokeDashoffset = index === 0 ? 0 : 
                    data.slice(0, index).reduce((sum, d) => 
                      sum + ((d.value / total) * circumference), 0
                    );
                  
                  return (
                    <circle
                      key={index}
                      cx="16"
                      cy="16"
                      r="12"
                      fill="none"
                      stroke={item.color || '#3b82f6'}
                      strokeWidth="3"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  );
                })}
              </svg>
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{total}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Legend */}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: item.color || 'primary.main'
                }}
              />
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  className
}: MetricCardProps) {
  return (
    <Card sx={{ ...(className && { className }) }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            {change && (
              <Typography variant="body2" sx={{ 
                color: change.isPositive ? 'success.main' : 'error.main' 
              }}>
                {change.isPositive ? '+' : ''}{change.value}%
              </Typography>
            )}
          </Box>
          {Icon && (
            <Icon style={{ width: 32, height: 32, color: 'text.secondary' }} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
} 