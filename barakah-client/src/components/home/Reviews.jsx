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
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2f1f] mb-12">
            What Our Customers Say
          </h2>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={600}
                    height={450}
                    className="rounded-xl object-cover border-2 border-[#d4af37]"
                  />
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-3 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-lg ${
                        i < review.rating ? "text-[#d4af37]" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {review.description}
                </p>

                {/* Name */}
                <h4 className="font-semibold text-[#3d2f1f]">{review.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
