import { useState } from 'react';
import { MockedUpload } from './MockedUpload';
import { RealUpload } from './RealUpload';
import { FormUpload } from './FormUpload';

type Variant = 'mock' | 'real' | 'form' | 'collect';
export default function App() {
  const [demoVariant, setDemoVariant] = useState<Variant>('form');
  return (
    <>
      <div>
        <label htmlFor="type">Select variant: </label>
        <select
          id="type"
          value={demoVariant}
          onChange={(e) => setDemoVariant(e.target.value as Variant)}
        >
          <option value="mock">Mocked upload</option>
          <option value="real">Read upload</option>
          <option value="form">Inside form</option>
          <option value="collect">Collect files on client</option>
        </select>
      </div>
      {demoVariant === 'mock' && <MockedUpload />}
      {demoVariant === 'real' && <RealUpload />}
      {demoVariant === 'form' && <FormUpload />}
    </>
  );
}
