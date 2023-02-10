const ErrorModal = () => {
  return (
    <div
      className="absolute text-white bg-red-400  shadow-xl border border-red-500 rounded text-center
            w-10/12  p-4 left-0 right-0 mx-auto top-1/4
           grid grid-rows-1"
    >
      <p className=" text-xl font-bold">Invalid word!</p>
    </div>
  );
};
export default ErrorModal;
