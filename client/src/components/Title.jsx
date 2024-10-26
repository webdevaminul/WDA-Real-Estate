export default function Title({ title, subTitle }) {
  return (
    <div className="my-5">
      <h2 className="text-center text-xl sm:text-2xl">{title} </h2>
      <p className="text-center font-sans font-light">{subTitle}</p>
    </div>
  );
}
