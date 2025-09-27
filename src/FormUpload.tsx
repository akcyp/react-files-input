import { FileUploader } from '../lib';

export const FormUpload = () => {
  return (
    <form action="https://www.w3schools.com/action_page.php">
      <FileUploader maxFiles={2} inputName="files" />
      <button
        type="submit"
        className="mt-3 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </form>
  );
};
