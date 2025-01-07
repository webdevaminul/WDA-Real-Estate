export default function Title({ title, subTitle }) {
  return (
    <div>
      <h2 className="text-center text-xl sm:text-2xl md:text-3xl">{title} </h2>
      <p className="text-center font-light mt-2">{subTitle}</p>
    </div>
  );
}
