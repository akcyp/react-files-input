import { FileUploader } from '../lib';

export const FormUpload = () => {
  return (
    <form action="https://www.w3schools.com/action_page.php">
      <FileUploader maxFiles={2} inputName="files" />
      <input type="submit" value="Submit" />
    </form>
  );
};
