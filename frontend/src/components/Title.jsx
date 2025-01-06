export default function Title({ title, subTitle }) {
  return (
    <div className="my-5">
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl sm:font-bold">{title} </h2>
      <p className="text-center font-light mt-2">{subTitle}</p>
    </div>
  );
}
