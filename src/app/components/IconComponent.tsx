import { ReactNode } from "react";

interface Props {
  icon: any;
  children?: ReactNode;
  size: number;
  color: string;
  cursor?: "pointer";
}

const IconComponent = ({ icon: Icon, children, ...otherProps }: Props) => {
  return (
    <div>
      {Icon && <Icon {...otherProps} />} {children}
    </div>
  );
};

export default IconComponent;

/* Alternative with Switch */
// const getIconFromName = (iconName, iconProps) => {
//   switch (iconName) {
//     case 'territories':
//       return <CrossIcon {...iconProps} />;
//     case 'allreports':
//         return <LiaBusinessTimeSolid {...iconProps} />;
//   }
// }
