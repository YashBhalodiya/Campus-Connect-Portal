import { cn, getUserInitials, stringToColor } from '../../lib/utils';

type AvatarProps = {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const Avatar = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className
}: AvatarProps) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const initials = name ? getUserInitials(name) : '';
  const bgColor = name ? stringToColor(name) : '#6b7280';

  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center overflow-hidden flex-shrink-0',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div 
          className="w-full h-full flex items-center justify-center font-medium text-white"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;