// app/verify/page.tsx

import React, { Suspense } from 'react';
import Example from './Example'; // Import the client component directly

const VerifyPage = () => {
  return (
    <div>
      {/* Wrap the Example component in Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        <Example />
      </Suspense>
    </div>
  );
};

export default VerifyPage;
