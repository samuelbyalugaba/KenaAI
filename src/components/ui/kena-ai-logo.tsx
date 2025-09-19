import * as React from 'react';
import Image from 'next/image';
import KenaAILogoSrc from '@/../KenaAI.png';

export const KenaAILogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div className={className} {...rest}>
      <Image 
        src={KenaAILogoSrc} 
        alt="KenaAI" 
        width={133} 
        height={50} 
        priority
      />
    </div>
  );
};
