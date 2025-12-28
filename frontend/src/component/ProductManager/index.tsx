import { useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import Input from "../InputField";
import ProductForm from "../ProductForm";
import Button from "../Button";
type Product = { id: number; name: string; price: number; };


const ProductManager = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<number | "">("");

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const handleSave = () => {
    if (!editName || editPrice === "" || editId === null) return;

    updateProduct({
      id: editId,
      name: editName,
      price: Number(editPrice),
    });

    setEditId(null);
    setEditName("");
    setEditPrice("");
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Product Manager
      </h1>

      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />


      <ProductForm
        onSubmit={(name, price) =>
          createProduct({
            id: Date.now(),
            name,
            price,
          })
        }
      />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

     
      <div className="grid gap-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded flex justify-between items-center shadow-sm"
          >
            {editId === item.id ? (
              <div className="flex gap-2 w-full">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Input
                  type="number"
                  className="w-32"
                  value={editPrice}
                  onChange={(e) =>
                    setEditPrice(Number(e.target.value))
                  }
                />

                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={handleSave}
                >
                  Save
                </Button>

                <Button
                  className="bg-gray-500 hover:bg-gray-600"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-gray-600">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </Button>

                  <Button
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => deleteProduct(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
