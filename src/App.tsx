import { faker } from '@faker-js/faker';
import { FileUploader } from './file-uploader/FileUploader';

/*
# Task Description

You will create a very simple app that allows the user to save a hypothetical file to the server by clicking a button. 
When the button is clicked, a save request should be sent to the server. 
Please note - occasionally, there may be errors on the server side that need to be handled appropriately.

## Levels

This task is divided into three difficulty levels. 
Please choose the one you are most comfortable solving:

1. Single Request Only
Ensure that only one request can be sent at a time. No parallel requests should be allowed.

2. Limit to Three Parallel Requests
Allow up to three requests to be sent in parallel. No more than three requests should run simultaneously.

3. Three Parallel Requests with Feedback
Allow up to three requests to be sent in parallel (maximum of three). 
Additionally, inform the user about the status of each action—whether the file was saved successfully or not.

## Additional Notes

- Keep the UI minimalistic but meaningful!
- The design should be simple and intuitive while clearly conveying the necessary information.
- If possible use proper TypeScript types.
- If you have a preferred library that fits the requirements, you’re welcome to use it!

GLHF 🚀

*/

const SaveFile = (file: File, _: AbortController): Promise<string> => {
  console.log(`Called SaveFile for ${file.name}`);
  return new Promise((res, rej) => {
    const timeToResolve = faker.number.int({ min: 1000, max: 3000 });

    setTimeout(() => {
      Math.random() > 0.5
        ? res(`Success: ${file.name} saved`)
        : rej(`Error: ${file.name} not saved`);
    }, timeToResolve);
  });
};

export default function App() {
  return (
    <div className="h-screen w-screen p-8">
      <FileUploader
        maxFiles={3}
        fileTypes={['image/png', 'image/jpeg', 'image/svg', 'image/gif']}
        description="PNG, JPG, SVG or GIF"
        onFileUpload={SaveFile}
      />
    </div>
  );
}
