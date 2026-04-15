import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Container from "../shared/Container";

async function getReviews() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${baseUrl}/api/reviews`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const result = await res.json();
    return result?.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Reviews() {
  const reviews = await getReviews();

  if (!reviews.length) {
    return (
      <section className="bg-[#faf7f0] py-16 text-center">
        <p className="text-gray-500">No reviews available right now.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#faf7f0] py-16">
      <Container>
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold text-[#3d2f1f] md:text-4xl">
            What Our Customers Say
          </h2>

          <div className="carousel carousel-center w-full gap-6 rounded-box p-2">
            {reviews.map((review) => (
              <div key={review._id} className="carousel-item w-[320px]">
                <div className="w-full rounded-2xl bg-white p-6 shadow-md transition hover:shadow-xl">
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={review.image}
                      alt={review.name}
                      width={300}
                      height={200}
                      className="h-[180px] w-full rounded-xl border-2 border-[#d4af37] object-cover"
                    />
                  </div>

                  <div className="mb-3 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? "text-[#d4af37]" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {review.description}
                  </p>

                  <h4 className="text-center font-semibold text-[#3d2f1f]">
                    {review.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}