import React from 'react'
import checkIcon from '../assets/images/ckeckIcon.svg'

interface SectionPointCardProps {
  image?: string
  icon?: React.ReactNode
  title?: string
  points?: string[]
}

const SectionPointCard: React.FC<SectionPointCardProps> = ({
  image,
  icon,
  title = 'Essential Maintenance',
  points = [
    'Discover expert techniques for teak care, hull cleaning, and polishing.',
    'Simplify your Exterior Department management with service bookings and a worldwide supply network.',
  ],
}) => {
  const [isHovering, setIsHovering] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div
      className={`px-9 py-[46px] md:px-5 md:py-5 flex flex-col gap-[10px] h-full rounded-[13px] transition-all duration-300 ease-in-out ${
        isHovering
          ? 'bg-[#E6EFF2] transform -translate-y-[10px] shadow-[0_10px_20px_rgba(4,135,217,0.2)]'
          : 'bg-[#E6EFF28A]'
      } md:h-auto`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header Section */}
      <div className="flex flex-col gap-[10px]">
        {/* Icon/Image */}
        <div className="transition-transform duration-300 ease-in-out">
          {image ? (
            <img
              src={image}
              alt={title}
              className={isMobile ? 'w-[50px] h-[50px]' : 'w-[76px] h-[76px]'}
            />
          ) : (
            <div
              className={`flex items-center justify-center bg-[#02214B] rounded-full ${
                isMobile ? 'w-[50px] h-[50px]' : 'w-[76px] h-[76px]'
              }`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-medium text-[30px] leading-[36.6px] tracking-[1%] text-[#131313] border-b 
          border-[#02214B59] pb-[10px] mb-[10px]">
          {title}
        </h3>
      </div>

      {/* Points List */}
      <div className="flex flex-col gap-2">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-1.5">
            <img
              src={checkIcon}
              alt="check"
              className={isMobile ? 'w-[20px] h-[20px] flex-shrink-0' : 'w-[26px] h-[26px] flex-shrink-0'}
            />
            <p className="font-normal text-[18px] leading-[26.55px] text-[#373737]">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SectionPointCard