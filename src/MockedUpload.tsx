import { FileUploader } from '../lib';

const randomInt = (min: number, max: number) => Math.round(Math.random() * (max - min) + max);
const sleep = (ts: number) => new Promise((res) => setTimeout(res, ts));

const onFileUpload = async (file: File): Promise<string> => {
  const timeToResolve = Math.random() * randomInt(1000, 3000);
  await sleep(timeToResolve);
  const success = Math.random() > 0.5;
  if (success) {
    return `Success: ${file.name} saved`;
  }
  throw `Error: ${file.name} not saved`;
};

const onFileDelete = async (file: File): Promise<void> => {
  const timeToResolve = Math.random() * randomInt(1000, 3000);
  await sleep(timeToResolve);
  const success = Math.random() > 0.5;
  if (!success) {
    throw `Error: ${file.name} cannot be deleted`;
  }
};

export const MockedUpload = () => {
  return (
    <FileUploader
      maxFiles={3}
      fileTypes={['image/png', 'image/jpeg', 'image/svg', 'image/gif']}
      description="PNG, JPG, SVG or GIF"
      onFileUpload={onFileUpload}
      onFileDelete={onFileDelete}
    />
  );
};
