import { useEffect, useState } from "react";
import "./style.css";

export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);

  async function fetchProduct() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://dummyjson.com/products?limit=20&skip=${count * 20}`
      );
      const result = await response.json();

      if (result && result.products && result.products.length) {
        
        const uniqueProducts = [
          ...new Map(result.products.map((item) => [item.id, item])).values(),
        ];

        // Add only new products
        setProducts((prevData) => {
          const prevProductIds = new Set(prevData.map((p) => p.id));
          const newProducts = uniqueProducts.filter(
            (item) => !prevProductIds.has(item.id)
          );
          return [...prevData, ...newProducts];
        });

        if (products.length + uniqueProducts.length >= 100) {
          setDisableButton(true);
        }
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, [count]);

  useEffect(() => {
    if (products.length >= 100) setDisableButton(true);
  }, [products]);

  if (loading) {
    return <div>Loading data! Please wait.</div>;
  }

  return (
    <div className="load-more-container">
      <div className="product-container">
        {products.length > 0 ? (
          products.map((item) => (
            <div className="product" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
      <div className="button-container">
        <button disabled={disableButton} onClick={() => setCount(count + 1)}>
          Load more products
        </button>
        {disableButton && <p>You have reached 100 products!</p>}
      </div>
    </div>
  );
}
