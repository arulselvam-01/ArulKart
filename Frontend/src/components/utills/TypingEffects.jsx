import React from 'react';
import TypingEffect from 'react-typing-effect';

const ReactTypingEffect = () => {
  return (
    <TypingEffect
      text={['Mobiles...', 'Clothes...', 'Electronics...', "Laptops...", "Accessories...", "Shoes...", "Books...", "Tech Products...", "Beauty Products...", "Home Products..."]}
      speed={50}
      eraseSpeed={20}
      eraseDelay={2000}
      typingDelay={500}
      cursor="|"
    />
  );
};

export default ReactTypingEffect;
