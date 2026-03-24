import React from 'react';
import { createRoot } from 'react-dom/client';
import { OfferLetterRenderer } from './src/components/recruitment/OfferLetterRenderer';

const htmlContent = `
  <div>
    <h1>Offer Letter for {{Name}}</h1>
    <p>Dear {{Name}},</p>
    <p>We are pleased to offer you the position. Here is a script attempt: <script>document.body.style.backgroundColor = 'red'; document.body.innerHTML += '<div id="xss-test">XSS Executed</div>';</script></p>
    <p>Please let us know if you accept.</p>
  </div>
`;

const variables = {
  Name: "John Doe"
};

const root = createRoot(document.getElementById('root')!);
root.render(<OfferLetterRenderer htmlContent={htmlContent} variables={variables} />);
