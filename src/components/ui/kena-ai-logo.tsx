import * as React from 'react';
import Image from 'next/image';

export const KenaAILogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { className, ...rest } = props;
  return (
    <div className={className} {...rest}>
      <Image 
        src="/KenaAI.png" 
        alt="KenaAI" 
        width={133} 
        height={50} 
        priority
      />
    </div>
  );
};
