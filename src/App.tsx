import { useState } from 'react';
import { MockedUpload } from './MockedUpload';
import { RealUpload } from './RealUpload';

export default function App() {
  const [useRealUpload, setRealUpload] = useState(false);
  return (
    <>
      <div>
        <input
          type="checkbox"
          id="type"
          checked={useRealUpload}
          onChange={(e) => setRealUpload(e.target.checked)}
        />
        <label htmlFor="type">Use real upload</label>
      </div>
      {useRealUpload ? <RealUpload /> : <MockedUpload />}
    </>
  );
}
