const Card = ({ children, className = '', hover = false }) => {
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200' : ''
  
  const classes = `${baseClasses} ${hoverClasses} ${className}`
  
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

// Card components for different sections
export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
)

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
)

export default Card