/*
  PURPOSE OF COMPONENT:
  - popup notification for when an image is successfully uploaded to S3 and the database
*/

function ToastNotification({ isVisible }) {
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg transition-opacity ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      Successfully Uploaded
    </div>
  );
}