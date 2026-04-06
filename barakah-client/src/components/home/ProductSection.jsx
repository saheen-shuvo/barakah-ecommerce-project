import Container from "../shared/Container";
import SectionTitle from "../shared/SectionTitle";
import ProductCard from "../products/ProductCard";

const ProductSection = ({ title, subtitle, link, products, bgClass = "bg-[#faf7f0]" }) => {
  return (
    <section className={`${bgClass} py-14 lg:py-20`}>
      <Container>
        <SectionTitle
          title={title}
          subtitle={subtitle}
          link={link}
          linkText="View All"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default ProductSection;