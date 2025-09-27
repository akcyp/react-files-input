import { useState } from 'react';
import { MockedUpload } from './MockedUpload';
import { RealUpload } from './RealUpload';
import { FormUpload } from './FormUpload';
import { CollectUpload } from './CollectUpload';

type Variant = 'mock' | 'real' | 'form' | 'collect';

export default function App() {
  const [demoVariant, setDemoVariant] = useState<Variant>('form');
  return (
    <div>
      <div className="flex flex-col mb-3">
        <label
          htmlFor="type"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select variant:{' '}
        </label>
        <select
          id="type"
          value={demoVariant}
          onChange={(e) => setDemoVariant(e.target.value as Variant)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="mock">Mocked upload</option>
          <option value="real">Real upload</option>
          <option value="form">Inside form</option>
          <option value="collect">Collect files on client</option>
        </select>
      </div>
      {demoVariant === 'mock' && <MockedUpload />}
      {demoVariant === 'real' && <RealUpload />}
      {demoVariant === 'form' && <FormUpload />}
      {demoVariant === 'collect' && <CollectUpload />}
    </div>
  );
}
