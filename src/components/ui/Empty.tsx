interface EmptyProps {
  image: string;
  title: string;
  desc: string;
}

export default function Empty({ image, title, desc }: EmptyProps) {
  return (
    <section>
      <img src={image} alt="" />
      <h3>{title}</h3>
      <p>{desc}</p>
    </section>
  );
}
