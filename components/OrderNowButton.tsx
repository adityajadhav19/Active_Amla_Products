"use client";

type Props = {
  productId: number;
  name: string;
  price: string;
  inStock: boolean;
};

export default function OrderNowButton({
  productId,
  name,
  price,
  inStock,
}: Props) {
  const handleClick = () => {
    const message =
      `Hello Royal Cake Studio 

I would like to order the following product:

Product ID: ${productId}
Product Name: ${name}
Price: ${price}

Please share availability and next steps.
Thank you!`;

    window.open(
      `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      disabled={!inStock}
      onClick={handleClick}
      className={`mt-5 w-full px-4 py-2 rounded text-white transition duration-200 ${inStock
          ? "bg-[rgb(139,69,19)] hover:scale-105 hover:shadow-md dark:bg-amber-700 dark:hover:bg-amber-600"
          : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
        }`}
    >
      {inStock ? "Order Now" : "Out of Stock"}
    </button>
  );
}
