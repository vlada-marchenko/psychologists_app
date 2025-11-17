
type IconProps = {
  name: string;
  width?: number;
  height?: number;
  className?: string;
};

export default function Icon({ name, width = 24, height = 24, className }: IconProps) {
  return (
    <svg width={width} height={height} className={className} aria-hidden="true">
      <use href={`/icons.svg#icon-${name}`} />
    </svg>
  );
}